# Nursing Educational Backend API Updates

## Overview

This document provides information about the recent updates to the Nursing Educational Backend API. The updates focus on implementing user authentication, role-based authorization, and patient data retrieval functionality.

## Key Updates

### 1. Hard-Coded Admin Account

The admin username and password are now hard-coded in `Program.cs` for development and testing purposes:

- **Email**: `admin@nursing.edu`
- **Password**: `Admin123!`
- **Role**: `Admin`

This account is automatically created in development environments when the application starts up if it doesn't already exist.

### 2. Authentication System

The backend now implements a JWT-based authentication system with the following features:

- Identity Framework integration for secure user management
- JWT tokens with role claims and NurseId for authorization
- User registration with corresponding Nurse table record creation
- Token-based access control for API endpoints

### 3. New Endpoints

#### Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/Auth/register` | POST | Register a new nurse user |
| `/api/Auth/login` | POST | Login and get JWT token |
| `/api/Auth/logout` | POST | Logout (token invalidation) |

#### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/Patients/admin/ids` | GET | Get all patient IDs (admin only) |
| `/api/Patients/admin/patient/{id}/cognitive` | GET | Get patient with cognitive data (admin only) |
| `/api/Patients/admin/patient/{id}/assessments` | GET | Get patient assessment data (admin only) |

#### Nurse Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/Patients/nurse/ids` | GET | Get patient IDs assigned to the nurse or with NULL NurseId |
| `/api/Patients/nurse/patient/{id}/cognitive` | GET | Get patient with cognitive data (only assigned patients) |
| `/api/Patients/nurse/patient/{id}/assessments` | GET | Get patient assessment data (only assigned patients) |

### 4. Branch Update

All changes have been implemented on the `backend-end-update` branch in the repository. The following files have been updated:

- **Controllers**:
  - `AuthController.cs` (New) - Handles user registration, login, and logout
  - `PatientsController.cs` (Updated) - Includes endpoints for retrieving patients and assessment data

- **Models**:
  - `NursingDbContext.cs` (Updated for Identity)

- **DTOs**:
  - `LoginResponse.cs` (New)
  - `NurseLoginRequest.cs` (New)
  - `RegisterRequest.cs` (New)

- **Configuration**:
  - `Program.cs` (Updated with Identity and JWT configuration)
  - `appsettings.json` (Updated with JWT settings)

### 5. Testing with Postman

Due to differences in curl command syntax between Windows and Linux/Mac, it's recommended to use Postman for testing the APIs. Here are the basic steps:

1. **Register a new user**:
   - POST to `/api/Auth/register`
   - Body: `{"email": "nurse@example.com", "password": "Nurse123!", "confirmPassword": "Nurse123!", "fullName": "Test Nurse", "studentNumber": "N12345"}`

2. **Login**:
   - POST to `/api/Auth/login`
   - Body: `{"email": "nurse@example.com", "password": "Nurse123!"}`
   - Save the returned token

3. **Access protected endpoints**:
   - Add an Authorization header: `Bearer [your_token]`
   - Make requests to the nurse or admin endpoints

4. **Retrieve patient assessment data**:
   - For cognitive data only: GET to `/api/Patients/admin/patient/1/cognitive` (admin) or `/api/Patients/nurse/patient/1/cognitive` (nurse)
   - For standardized assessments: GET to `/api/Patients/admin/patient/1/assessments` (admin) or `/api/Patients/nurse/patient/1/assessments` (nurse)
   - Remember to include the Authorization header

4. **Retrieve patient assessment data**:
   - For cognitive data only: GET to `/api/Patients/admin/patient/1/cognitive` (admin) or `/api/Patients/nurse/patient/1/cognitive` (nurse)
   - For standardized assessments: GET to `/api/Patients/admin/patient/1/assessments` (admin) or `/api/Patients/nurse/patient/1/assessments` (nurse)
   - Remember to include the Authorization header

### 6. Important Notes

- **DO NOT modify the database structure.** The current implementation works with the existing database schema.
- Admin users can access all patients; regular nurses can only access assigned patients or those with NULL NurseId.
- The JWT token contains the NurseId claim for efficient authorization without additional database queries.
- For security reasons, passwords are stored using Identity Framework's password hashing.

## Technical Details

### Assessment Data Endpoints

The API provides endpoints to retrieve various types of assessment data for patients:



#### Patient Assessments Data

- **Endpoint**: `/api/Patients/admin/patient/{id}/assessments` (Admin) or `/api/Patients/nurse/patient/{id}/assessments` (Nurse)
- **Description**: Retrieves a patient with their assessment records in a standardized format
- **Response Structure**:
  ```json
  {
    "patient": { /* patient data */ },
    "assessments": [
      {
        "recordId": 1,
        /* assessment data organized by category */
      }
    ]
  }
  ```

#### Cognitive Assessment Data

- **Endpoint**: `/api/Patients/admin/patient/{id}/cognitive` (Admin) or `/api/Patients/nurse/patient/{id}/cognitive` (Nurse)
- **Description**: Retrieves a patient with their cognitive assessment records
- **Response Structure**:
  ```json
  {
    "patient": { /* patient data */ },
    "cognitiveData": [
      {
        "recordId": 1,
        "cognitive": {
          "cognitiveId": 1,
          "speech": "Clear",
          "loc": "Alert",
          "mmse": "28/30",
          "confusion": "None"
        }
      }
    ]
  }
  ```

### Authentication Flow

1. User registers or logs in using credentials
2. Backend validates credentials and generates a JWT token
3. Token includes user identity, role claims, and NurseId
4. Client includes token in Authorization header for all subsequent requests
5. Backend validates token and authorizes access based on claims

### Role-Based Authorization

Two primary roles are implemented:

1. **Admin**: Can access all endpoints and all patient data
2. **Nurse**: Can only access their assigned patients or unassigned (NULL NurseId) patients

### Database Integration

- User authentication data is stored in Identity Framework tables
- Domain-specific nurse data remains in the existing Nurse table
- NurseId is used to link Identity users with Nurse records

## Troubleshooting

- If API returns 401 Unauthorized: Check that your token is valid and not expired
- If API returns 403 Forbidden: Check that you have the required role for the endpoint
- If API returns 404 Not Found: Check that the requested resource exists and you have access to it
- If patient data is missing assessment records: Check that the records exist in the database with proper foreign key relationships
- If `/complete` endpoint returns empty records: Verify that the patient has associated records in the Record table
- If patient data is missing assessment records: Check that the records exist in the database with proper foreign key relationships
- If `/complete` endpoint returns empty records: Verify that the patient has associated records in the Record table
