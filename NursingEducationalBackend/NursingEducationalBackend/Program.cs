using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Identity.Web;
using NursingEducationalBackend.Models;
using System.Security.Claims;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    var expectedScopes = builder.Configuration["AzureAd:Scopes"]?.Split(' ');

    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .RequireAssertion(context =>
        {
            var scopeClaim = context.User.FindFirst("http://schemas.microsoft.com/identity/claims/scope")?.Value
                ?? context.User.FindFirst("scp")?.Value;

            if (string.IsNullOrWhiteSpace(scopeClaim) || expectedScopes == null || expectedScopes.Length == 0)
                return false;

            var tokenScopes = scopeClaim.Split(' ');

            return expectedScopes.Any(s =>
            {
                var normalized = s?.Trim();
                if (string.IsNullOrWhiteSpace(normalized))
                {
                    return false;
                }

                // Support full scope URIs and bare scope names.
                var lastSegment = normalized.Split('/').LastOrDefault();
                return tokenScopes.Contains(normalized) || tokenScopes.Contains(lastSegment);
            });
        })
        .Build();

    options.Filters.Add(new AuthorizeFilter(policy));
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});



builder.Services.AddHttpClient();
builder.Services.AddScoped<NursingEducationalBackend.Utilities.GraphInviteService>();



// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<NursingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: TimeSpan.FromSeconds(30),
        errorNumbersToAdd: null
    )));

builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<NursingDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(options =>
    {
        builder.Configuration.Bind("AzureAd", options);
    },
    options =>
    {
        builder.Configuration.Bind("AzureAd", options);
    });

var AllowFrontendOrigins = "_allowFrontendOrigins";
var allowedOrigins = Environment.GetEnvironmentVariable("AllowedOrigins")?.Split(';', StringSplitOptions.RemoveEmptyEntries)
                     ?? new[] { "http://localhost:5173" };

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

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<NursingDbContext>();
    dbContext.Database.Migrate();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseRouting();
app.UseCors(AllowFrontendOrigins);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();

// Add middleware to enrich claims with roles and NurseId from database
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        var userManager = context.RequestServices.GetRequiredService<UserManager<IdentityUser>>();
        
        // Get EntraUserId and email from token
        var entraUserId = context.User.FindFirst("oid")?.Value 
            ?? context.User.FindFirst("sub")?.Value;
        
        var email = context.User.FindFirst("preferred_username")?.Value 
            ?? context.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
            ?? context.User.FindFirst("email")?.Value
            ?? context.User.FindFirst("upn")?.Value
            ?? context.User.FindFirst(ClaimTypes.Upn)?.Value
            ?? context.User.FindFirst("unique_name")?.Value;
        
        var identity = (System.Security.Claims.ClaimsIdentity)context.User.Identity;
        var dbContext = context.RequestServices.GetRequiredService<NursingDbContext>();
        
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
                        identity.AddClaim(new Claim(ClaimTypes.Role, role));
                    }
                }
            }
        }
    }

    await next();
});

app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }

    if (!await roleManager.RoleExistsAsync("Instructor"))
    {
        await roleManager.CreateAsync(new IdentityRole("Instructor"));
    }

    if (!await roleManager.RoleExistsAsync("Nurse"))
    {
        await roleManager.CreateAsync(new IdentityRole("Nurse"));
    }
}

if (app.Environment.IsDevelopment())
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var dbContext = scope.ServiceProvider.GetRequiredService<NursingDbContext>();

            const string adminEmail = "admin@nursing.edu";

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
            }

            // 🔥 TEMPORARILY DISABLE CLASS SEED (THIS IS THE CRASH PART)
            // Comment this out for now
            /*
            var campusId = await EnsureDevelopmentCampusAsync(dbContext);

      
        // Create a default classroom for local devtesting
        if (dbContext.Classes.FirstOrDefault(c => c.JoinCode == "DEVTST") == null)
        {


            // Ensure default campus exists
                
            var defaultCampus = new Campus
            {
                Name = "Default Campus",
                Address = ""
            };

            dbContext.Campuses.Add(defaultCampus);
            await dbContext.SaveChangesAsync();
          
  

            int campusId = defaultCampus.CampusId;

            Class devClass = new Class
            {
                Name = "Development Testing",
                Description = "Local only classroom for development purposes.",
                JoinCode = "DEVTST",
                InstructorId = 1,
                CampusId = campusId,
                StartDate = new DateOnly(2026, 01, 01),
                EndDate = new DateOnly(3000, 12, 31)
            };
 
            await dbContext.Classes.AddAsync(devClass);
            await dbContext.SaveChangesAsync();*/
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DEV SEED ERROR] {ex.Message}");
    }
}

app.Run();

static async Task<int> EnsureDevelopmentCampusAsync(NursingDbContext dbContext)
{
    var connection = dbContext.Database.GetDbConnection();

    if (connection.State != ConnectionState.Open)
    {
        await connection.OpenAsync();
    }

    string campusTableName;

    await using (var checkCampusCommand = connection.CreateCommand())
    {
        checkCampusCommand.CommandText = @"
            SELECT CASE 
                WHEN OBJECT_ID(N'[Campus]', N'U') IS NOT NULL THEN 'Campus'
                WHEN OBJECT_ID(N'[Campuses]', N'U') IS NOT NULL THEN 'Campuses'
                ELSE ''
            END";

        campusTableName = (string)(await checkCampusCommand.ExecuteScalarAsync() ?? "");
    }

    if (string.IsNullOrWhiteSpace(campusTableName))
    {
        throw new InvalidOperationException("No Campus or Campuses table was found in the database.");
    }

    await using (var insertCommand = connection.CreateCommand())
    {
        insertCommand.CommandText = $@"
            IF NOT EXISTS (SELECT 1 FROM [{campusTableName}])
            BEGIN
                INSERT INTO [{campusTableName}] ([Name], [Address])
                VALUES ('Development Campus', '123 Main Street')
            END";

        await insertCommand.ExecuteNonQueryAsync();
    }

    await using (var selectCommand = connection.CreateCommand())
    {
        selectCommand.CommandText = $"SELECT TOP 1 [CampusId] FROM [{campusTableName}] ORDER BY [CampusId]";

        var result = await selectCommand.ExecuteScalarAsync();

        if (result == null)
        {
            throw new InvalidOperationException("Campus table exists, but no CampusId could be found.");
        }

        return Convert.ToInt32(result);
    }
}