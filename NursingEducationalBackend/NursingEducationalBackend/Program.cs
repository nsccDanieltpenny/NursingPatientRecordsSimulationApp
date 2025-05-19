using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using NursingEducationalBackend.Models;
using System.Security.Claims;
using NursingEducationalBackend.Services;



var builder = WebApplication.CreateBuilder(args);

// In Program.cs
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();

// Add services to the container.

builder.Services.AddScoped<IChangeHistoryService, ChangeHistoryService>();
builder.Services.AddScoped<NursingEducationalBackend.Utilities.PatientDataSubmissionHandler>();





// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()     // ← this replaces .WithOrigins(...)
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"[DEBUG] Using connection string: {defaultConnection}");


builder.Services.AddDbContext<NursingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity services
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<NursingDbContext>()
    .AddDefaultTokenProviders();

// Configure Identity options
builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;
});

// --- JWT Authentication Section: Uncommented ---
builder.Services.AddAuthentication(options =>
{
   options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
   options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
   options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Set to true in production if using HTTPS
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtSettings:Audience"], // Ensure this is set in Azure App Settings
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],     // Ensure this is set in Azure App Settings
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])) // Ensure this is set in Azure App Settings and is strong/long enough
    };
});
// --- End JWT Authentication Section ---

// Add Authorization
builder.Services.AddAuthorization();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
//app.UseHttpsRedirection(); // Consider enabling this in production

app.UseStaticFiles();

// --- Authentication/Authorization Middleware: Uncommented ---
// Add authentication middleware before authorization
app.UseAuthentication();
app.UseAuthorization();
// --- End Authentication/Authorization Middleware ---

app.MapControllers();

// Add this after setting up Identity services
if (app.Environment.IsDevelopment())
{
    // Create an admin user in development
    using (var scope = app.Services.CreateScope())
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Create Admin role if it doesn't exist
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

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

            // Ensure you have a strong password policy compliant password
            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");

                // Create corresponding entry in Nurse table
                var dbContext = scope.ServiceProvider.GetRequiredService<NursingDbContext>();
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
            else
            {
                // Log errors if user creation failed
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error creating admin user: {error.Description}");
                }
            }
        }
    }
}
app.Run();
