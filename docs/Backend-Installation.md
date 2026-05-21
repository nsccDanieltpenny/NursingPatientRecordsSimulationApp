# Getting Started 

This document serves as an **overview** of the backend for ***CARE***. Please read the following document carefully to get a clear idea of what is going on. This project was written in C# using the ASP.NET Core 9.0 framework with Entity Framework Core for database management. For a comprehensive API guide, please have a look at our [API Breakdown](/NursingEducationalBackend/api-documentation.md). 

**NOTE:** The backend uses Microsoft Entra ID (Azure AD) for authentication and SQL Server for data storage.

# Installation

## Prerequisites
- Ensure you have the following installed:
  - [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
  - [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) or [SQL Server LocalDB](https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb)
  - [Git](https://git-scm.com/) (for version control)
  - A code editor such as [Visual Studio 2022](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/nsccDanieltpenny/NursingPatientRecordsSimulationApp
cd NursingEducationalBackend/NursingEducationalBackend
```

### 2. Install Necessary Dependencies

Using the .NET CLI, restore the required NuGet packages:
```bash
dotnet restore
```

If you're using Visual Studio, the packages will be restored automatically when you open the solution file (NursingEducationalBackend.sln).

### 3. Configure Environment Variables

You'll need to configure the `appsettings.Development.json` file in the `NursingEducationalBackend/NursingEducationalBackend` directory to ensure proper connection to the database and authentication services.

The file should contain the following structure:

```json
{
    "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "Domain": "your-domain.onmicrosoft.com",
        "TenantId": "your-tenant-id",
        "ClientId": "your-client-id",
        "Scopes": "access_as_user"
    },
    "ConnectionStrings": {
        "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CAREDev;Integrated Security=True;"
    },
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    }
}
```

**Configuration Notes:**
- **AzureAd**: These values will be provided by whoever is managing Azure AD/Entra ID for your team
  - `TenantId`: Your Azure AD tenant ID
  - `ClientId`: The application (client) ID for the backend API
  - `Domain`: Your Azure AD domain
- **ConnectionStrings**: 
  - For local development, the default LocalDB connection string should work out of the box
  - For a different SQL Server instance, modify the connection string accordingly
  - Example for SQL Server: `"Server=localhost;Database=CAREDev;Trusted_Connection=True;TrustServerCertificate=True;"`

### 4. Set Up CORS for Frontend (Optional for Development)

By default, the backend allows requests from `http://localhost:5173` (the default Vite dev server port). If your frontend runs on a different port, you can set the `AllowedOrigins` environment variable:

```bash
# Windows (PowerShell)
$env:AllowedOrigins="http://localhost:5173;http://localhost:3000"

# Windows (Command Prompt)
set AllowedOrigins=http://localhost:5173;http://localhost:3000
```

### 5. Apply Database Migrations

The application is configured to automatically run migrations on startup, so the database will be created and seeded when you first run the application. However, if you want to manually apply migrations, you can use:

```bash
dotnet ef database update
```

**Note:** Entity Framework Core Tools are required for manual migrations. They should already be included in the project dependencies.

### 6. Run the Application

Start the development server using the .NET CLI:

```bash
dotnet run
```

Or if you're using Visual Studio, simply press F5 or click the "Run" button.

The API will typically be available at:
- **HTTP**: `http://localhost:5232` (or the port shown in your console output)
- **HTTPS**: `https://localhost:7145` (or the port shown in your console output)

### 7. Verify the Installation

Once the application is running, you can verify it's working by:
- Opening the OpenAPI/Swagger documentation at `http://localhost:5232/openapi/v1.json` (when running in Development mode)
- Testing the API endpoints using tools like [Bruno](https://www.usebruno.com/) or [Thunder Client](https://www.thunderclient.com/)
- Checking the console output for any errors

## Additional Notes

### Database
- The project uses **Entity Framework Core** with **SQL Server**
- The database context is `NursingDbContext`
- Migrations are located in the `Migrations` folder
- The database will include ASP.NET Identity tables for user and role management

### Authentication & Authorization
- The API uses **Microsoft Entra ID (Azure AD)** for JWT bearer token authentication
- ASP.NET Core Identity is used for role-based authorization
- User roles are stored in the database and added to JWT claims automatically during requests

### Common Issues

**Issue: Database connection fails**
- Verify SQL Server LocalDB is installed: `sqllocaldb info`
- Check if LocalDB instance is running: `sqllocaldb start MSSQLLocalDB`
- Verify the connection string in `appsettings.Development.json`

**Issue: Port already in use**
- Change the port in `Properties/launchSettings.json`
- Or set the port via command line: `dotnet run --urls "http://localhost:5000"`

**Issue: CORS errors from frontend**
- Ensure the frontend URL is included in the `AllowedOrigins` environment variable
- Check the console output to see which origins are allowed