using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using NursingEducationalBackend.Models;
using System.Security.Claims;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<NursingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: TimeSpan.FromSeconds(30),
        errorNumbersToAdd: null
    )));

// Add Identity services (for database only, not for authentication)
builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<NursingDbContext>()
    .AddDefaultTokenProviders();

// Configure ONLY Microsoft Entra authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(options =>
    {
        builder.Configuration.Bind("AzureAd", options);
    },
    options =>
    {
        builder.Configuration.Bind("AzureAd", options);
    });

//CORS setup
var AllowFrontendOrigins = "_allowFrontendOrigins";
var allowedOrigins = Environment.GetEnvironmentVariable("AllowedOrigins")?.Split(';', StringSplitOptions.RemoveEmptyEntries) ?? new[] { "http://localhost:5173" };
Console.WriteLine($"[DEBUG] Allowed Origin: {allowedOrigins[0]}");
builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowFrontendOrigins, policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

//Manually run migrations so we have a database on publish
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<NursingDbContext>();
    dbContext.Database.Migrate();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(AllowFrontendOrigins);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Add authentication middleware before authorization
app.UseAuthentication();

// Add middleware to enrich claims with roles and NurseId from database
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        var dbContext = context.RequestServices.GetRequiredService<NursingDbContext>();
        var userManager = context.RequestServices.GetRequiredService<UserManager<IdentityUser>>();
        
        // Get EntraUserId and email from token
        var entraUserId = context.User.FindFirst("oid")?.Value 
            ?? context.User.FindFirst("sub")?.Value;
        
        var email = context.User.FindFirst("preferred_username")?.Value 
            ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
            ?? context.User.FindFirst("email")?.Value
            ?? context.User.FindFirst("upn")?.Value
            ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Upn)?.Value
            ?? context.User.FindFirst("unique_name")?.Value;
        
        var identity = (System.Security.Claims.ClaimsIdentity)context.User.Identity;
        
        // Look up nurse record and add NurseId claim
        Nurse? nurse = null;
        if (!string.IsNullOrEmpty(entraUserId))
        {
            nurse = await dbContext.Nurses.FirstOrDefaultAsync(n => n.EntraUserId == entraUserId);
        }
        if (nurse == null && !string.IsNullOrEmpty(email))
        {
            nurse = await dbContext.Nurses.FirstOrDefaultAsync(n => n.Email == email);
        }
        
        if (nurse != null)
        {
            // Add NurseId as a claim for easy access in controllers
            identity.AddClaim(new System.Security.Claims.Claim("NurseId", nurse.NurseId.ToString()));
        }
        
        // Add roles from Identity system
        if (!string.IsNullOrEmpty(email))
        {
            var identityUser = await userManager.FindByEmailAsync(email);
            if (identityUser != null)
            {
                var roles = await userManager.GetRolesAsync(identityUser);
                if (roles.Any())
                {
                    foreach (var role in roles)
                    {
                        // Add role claims to the principal
                        identity.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, role));
                    }
                }
            }
        }
    }
    
    await next();
});

app.UseAuthorization();

app.MapControllers();

//Create necessary roles
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    // Create Admin role if it doesn't exist
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }

    //Create instructor role if it doesn't exist
    if (!await roleManager.RoleExistsAsync("Instructor"))
    {
        await roleManager.CreateAsync(new IdentityRole("Instructor"));
    }

    //Create nurse role if it doesn't exist
    if (!await roleManager.RoleExistsAsync("Nurse"))
    {
        await roleManager.CreateAsync(new IdentityRole("Nurse"));
    }
}

// Add this after setting up Identity services
if (app.Environment.IsDevelopment())
{
    // Create an admin user in development
    using (var scope = app.Services.CreateScope())
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<NursingDbContext>();

        // Hard-coded admin email
        const string adminEmail = "admin@nursing.edu";

        // Create admin user if it doesn't exist
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, "Admin123!");
            await userManager.AddToRoleAsync(adminUser, "Admin");

            // Create corresponding entry in Nurse table
            var adminNurse = new Nurse
            {
                Email = adminEmail,
                FullName = "System Administrator",
                StudentNumber = "ADMIN"
            };

            await dbContext.Nurses.AddAsync(adminNurse);
            await dbContext.SaveChangesAsync();

            // Add NurseId claim
            await userManager.AddClaimAsync(adminUser, new Claim("NurseId", adminNurse.NurseId.ToString()));
        }

        // Create a default classroom for local devtesting
        if (dbContext.Classes.FirstOrDefault(c => c.JoinCode == "DEVTST") == null)
        {
            Class devClass = new Class
            {
                Name = "Development Testing",
                Description = "Local only classroom for development purposes.",
                JoinCode = "DEVTST",
                InstructorId = 1,
                StartDate = new DateOnly(2026, 01, 01),
                EndDate = new DateOnly(3000, 12, 31)
            };

            await dbContext.Classes.AddAsync(devClass);
            await dbContext.SaveChangesAsync();
        }
    }


}
   
app.Run();