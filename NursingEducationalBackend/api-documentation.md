## Patient Write Endpoints

These endpoints handle creating and updating patient data in the system.

### Create Patient
- **URL**: `/api/patients/create`
- **Method**: `POST`
- **Auth Required**: No (Currently commented out in code)
- **Description**: Creates a new patient record
- **Request Body**: JSON object with Patient properties
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/patients/create" \
    -H "Content-Type: application/json" \
    -d '{
      "fullName": "John Doe",
      "sex": "Male",
      "patientWristId": "P12345",
      "nextOfKin": "Jane Doe (Wife)",
      "height": "5'\''10\"",
      "weight": 180,
      "dateOfBirth": "1975-05-15",
      "allergies": "Penicillin, Shellfish",
      "isolationPrecautions": "None",
      "diagnosis": "Type 2 Diabetes",
      "admissionDate": "2025-03-20",
      "room": "101"
    }'
  ```
- **Success Response**: 
  - **Code**: 200 OK
- **Error Responses**:
  - **400 Bad Request**: If validation fails
    ```json
    "Unable to create patient"
    ```

### Assign Nurse to Patient
- **URL**: `/api/patients/{id}/assign-nurse/{nurseId}`
- **Method**: `POST`
- **Auth Required**: No (Currently commented out in code)
- **URL Parameters**:
  - `id=[integer]` where `id` is the PatientId
  - `nurseId=[integer]` where `nurseId` is the ID of the nurse to assign
- **Description**: Assigns a nurse to a patient
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/patients/1/assign-nurse/2" \
    -H "Content-Type: application/json"
  ```
- **Success Response**: 
  ```json
  {
    "nurseId": 2
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: If operation fails
    ```json
    "Nurse id unable to be assigned"
    ```

### Submit Patient Data
- **URL**: `/api/patients/{id}/submit-data`
- **Method**: `POST`
- **Auth Required**: No
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Description**: Submits or updates various types of patient assessment data
- **Request Body**: Dictionary of key-value pairs where keys follow the format `table-{tableType}-{patientId}`
- **Supported Table Types**:
  - elimination
  - mobility
  - nutrition
  - cognitive
  - safety
  - adl
  - behaviour
  - progressnote
  - skinandsensoryaid
  - profile
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/patients/1/submit-data" \
    -H "Content-Type: application/json" \
    -d '{
      "table-cognitive-1": {
        "speech": "Clear and coherent",
        "loc": "Alert and oriented x4",
        "mmse": "28/30",
        "confusion": "No signs of confusion"
      },
      "table-progressnote-1": {
        "note": "Patient reports feeling well this morning. Vitals stable.",
        "timestamp": "2025-04-13T10:30:00"
      }
    }'
  ```
- **Success Response**: 
  - **Code**: 200 OK
### Admin Debug Endpoint

#### List All Database Tables (Admin)
- **URL**: `/api/Patients/debug/tables`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Returns database information for debugging purposes
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/debug/tables" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AbnVyc2luZy5lZHUiLCJqdGkiOiJjZDZhNWE2OC00NzM5LTQ4YmItYWNmMC1lNjQyMDNiZTZkNDciLCJOdXJzZUlkIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQyNjExOTY1LCJpc3MiOiJOdXJzaW5nRWR1Y2F0aW9uYWxCYWNrZW5kIiwiYXVkIjoiTnVyc2luZ0VkdWNhdGlvbmFsQXBwIn0.7vR4EE9vzc8vC9XOgQ9XlZQZimzp8s9-hQdOSVAX9Hc" \
    -H "Content-Type: application/json"
  ```
- **Success Response**: 
  ```json
  {
    "databaseProvider": "Microsoft.EntityFrameworkCore.Sqlite",
    "availableTables": [
      "AspNetRoleClaims",
      "AspNetRoles",
      "AspNetUserClaims",
      "AspNetUserLogins",
      "AspNetUserRoles",
      "AspNetUsers",
      "AspNetUserTokens",
      "Patients",
      "Nurses",
      "Cognitives",
      "Nutritions",
      "Eliminations",
      "Mobilities",
      "Safeties",
      "Adls",
      "SkinAndSensoryAids",
      "Behaviours",
      "ProgressNotes",
      "Records"
    ],
    "connectionInfo": "Data Source=nursing.db",
    "dbContextType": "NursingEducationalBackend.Models.NursingDbContext",
    "models": {
      "patientsDbSet": "Registered",
      "patientEntityType": "Patients"
    }
  }
  ```
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
  - **403 Forbidden**: If user doesn't have Admin role
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error listing tables",
      "error": "Error message",
      "stackTrace": "Stack trace details",
      "innerException": "Inner exception message"
    }
    ```### Get Patient Assessment By Type (Nurse)
- **URL**: `/api/Patients/nurse/patient/{id}/{tableType}`
- **Method**: `GET`
- **Auth Required**: Yes (Currently commented out in code)
- **Description**: Retrieves a specific assessment type for a patient
- **URL Parameters**: 
  - `id=[integer]` where `id` is the PatientId
  - `tableType=[string]` where `tableType` is one of: "adl", "behaviour", "cognitive", "elimination", "mobility", "nutrition", "progressnote", "safety", "skinandsensoryaid"
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/nurse/patient/1/cognitive" \
    -H "Authorization: Bearer {jwt_token}"
  ```
- **Success Response**: 
  ```json
  {
    "cognitiveId": 1,
    "speech": "Clear and coherent",
    "loc": "Alert and oriented x4",
    "mmse": "28/30",
    "confusion": "No signs of confusion"
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: If invalid table type is provided
    ```json
    { "message": "Invalid table type" }
    ```
  - **404 Not Found**: If patient or table data not found
    ```json
    "Table not found"
    ```## Basic Patient Endpoints

### Get All Patients
- **URL**: `/api/Patients`
- **Method**: `GET`
- **Auth Required**: No (Currently commented out in code)
- **Description**: Returns a list of all patients in the system
- **Example Request**:
  ```bash
  curl -X GET "http://localhost:5232/api/Patients"
  ```
- **Success Response**: 
  ```json
  [
    {
      "patientId": 1,
      "patientWristId": "W-0001",
      "fullName": "John Doe",
      "dob": "1975-07-04",
      "nurseId": 1,
      "gender": "Male",
      "roomNumber": "101",
      "admitDate": "2023-05-15",
      "diagnosis": "Hypertension",
      "allergies": "Penicillin",
      "code": "Full Code"
    },
    // More patients...
  ]
  ```

### Get Patient By ID
- **URL**: `/api/Patients/{id}`
- **Method**: `GET`
- **Auth Required**: No (Currently commented out in code)
- **Description**: Returns a specific patient by ID
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Example Request**:
  ```bash
  curl -X GET "http://localhost:5232/api/Patients/1"
  ```
- **Success Response**: 
  ```json
  {
    "patientId": 1,
    "patientWristId": "W-0001",
    "fullName": "John Doe",
    "dob": "1975-07-04",
    "nurseId": 1,
    "gender": "Male",
    "roomNumber": "101",
    "admitDate": "2023-05-15",
    "diagnosis": "Hypertension",
    "allergies": "Penicillin",
    "code": "Full Code"
  }
  ```# Nursing Educational Backend API Documentation

## Overview

This API documentation covers the endpoints for the Nursing Educational Backend system. The API allows for authentication, patient management, and medical record creation/retrieval. All secure endpoints require a valid JWT token obtained through the login process.

## Authentication Endpoints

### Register
- **URL**: `/api/Auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Registers a new nurse user in the system
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "fullName": "User Name",
    "studentNumber": "12345"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "user@example.com",
      "password": "Password123!",
      "confirmPassword": "Password123!",
      "fullName": "User Name",
      "studentNumber": "12345"
    }'
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "User registered successfully!"
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: If the email already exists or validation fails
    ```json
    {
      "success": false,
      "message": "Email already exists!"
    }
    ```
    Or
    ```json
    {
      "success": false,
      "message": "User creation failed! Please check user details and try again.",
      "errors": [
        { "code": "PasswordTooShort", "description": "Passwords must be at least 6 characters." },
        // Other potential validation errors
      ]
    }
    ```

### Login
- **URL**: `/api/Auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticates a nurse user and returns a JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "user@example.com",
      "password": "Password123!"
    }'
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidXNlckBleGFtcGxlLmNvbSIsImp0aSI6ImI0YWM3Y2FkLTA1YTUtNDdhNy04MGQxLWE4NzYzZDdhMGQzMCIsIk51cnNlSWQiOiIxIiwiZXhwIjoxNzQyNjE5MjczLCJpc3MiOiJOdXJzaW5nRWR1Y2F0aW9uYWxCYWNrZW5kIiwiYXVkIjoiTnVyc2luZ0VkdWNhdGlvbmFsQXBwIn0.X_3KpjeKyvXUlA9y7H_OTI9MWYEL0-x4pxu4jORIk2Q",
    "nurseId": 1,
    "fullName": "User Name",
    "email": "user@example.com",
    "roles": ["Admin"]  // For admin users, or [] for regular nurses
  }
  ```
- **Error Responses**:
  - **401 Unauthorized**: If authentication fails
    ```json
    {
      "success": false,
      "message": "Invalid email or password."
    }
    ```
  - **401 Unauthorized**: If nurse record not found
    ```json
    {
      "success": false,
      "message": "Nurse record not found."
    }
    ```

### Logout
- **URL**: `/api/Auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Logs out the current user (primarily handled client-side by removing JWT)
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Auth/logout" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWJjZEBnbWFpbC5jb20iLCJqdGkiOiJiNGFjN2NhZC0wNWE1LTQ3YTctODBkMS1hODc2M2Q3YTBkMzAiLCJOdXJzZUlkIjoiMSIsImV4cCI6MTc0MjYxOTI3MywiaXNzIjoiTnVyc2luZ0VkdWNhdGlvbmFsQmFja2VuZCIsImF1ZCI6Ik51cnNpbmdFZHVjYXRpb25hbEFwcCJ9.5qCT3VhwvjrjWlqI1BI_GeyGLXj4lWl76Jg3ov6Xn3U" \
    -H "Content-Type: application/json"
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## JWT Token Information

The JWT token returned by the login endpoint contains the following claims:

- **Name**: The user's email address
- **Jti**: A unique token identifier
- **NurseId**: The nurse's ID in the system
- **Roles**: (If assigned) User roles such as "Admin"
- **Expiration**: Token expiration time (configured in minutes via JwtSettings:DurationInMinutes)
- **Issuer**: The issuing authority (configured via JwtSettings:Issuer)
- **Audience**: The intended audience (configured via JwtSettings:Audience)

## Patient Endpoints

### Admin Endpoints

#### Get All Patients (Admin)
- **URL**: `/api/Patients/admin/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Returns a list of all patients in the system (admin access only)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/admin/ids" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AbnVyc2luZy5lZHUiLCJqdGkiOiJjZDZhNWE2OC00NzM5LTQ4YmItYWNmMC1lNjQyMDNiZTZkNDciLCJOdXJzZUlkIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQyNjExOTY1LCJpc3MiOiJOdXJzaW5nRWR1Y2F0aW9uYWxCYWNrZW5kIiwiYXVkIjoiTnVyc2luZ0VkdWNhdGlvbmFsQXBwIn0.7vR4EE9vzc8vC9XOgQ9XlZQZimzp8s9-hQdOSVAX9Hc" \
    -H "Content-Type: application/json"
  ```
- **Success Response**: 
  ```json
  [
    {
      "patientId": 1,
      "patientWristId": "W-0001", 
      "fullName": "John Doe",
      "dob": "1975-07-04",
      "nurseId": 1,
      "gender": "Male",
      "roomNumber": "101",
      "admitDate": "2023-05-15",
      "diagnosis": "Hypertension",
      "allergies": "Penicillin",
      "code": "Full Code"
    },
    {
      "patientId": 2,
      "patientWristId": "W-0002", 
      "fullName": "Jane Smith",
      "dob": "1980-03-22",
      "nurseId": 2,
      "gender": "Female",
      "roomNumber": "102",
      "admitDate": "2023-06-01",
      "diagnosis": "Diabetes Type 2",
      "allergies": "None",
      "code": "DNR"
    }
  ]
  ```
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
  - **403 Forbidden**: If user doesn't have Admin role
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error retrieving patients",
      "error": "Error message"
    }
    ```
  - **500 Internal Server Error**: If ID mapping issue occurs
    ```json
    {
      "message": "Error retrieving patient IDs - all IDs are 0"
    }
    ```

#### Get Patient with Cognitive Data (Admin)
- **URL**: `/api/Patients/admin/patient/{id}/cognitive`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Description**: Retrieves patient information with cognitive assessment data (admin access only)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/admin/patient/1/cognitive" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AbnVyc2luZy5lZHUiLCJqdGkiOiJjZDZhNWE2OC00NzM5LTQ4YmItYWNmMC1lNjQyMDNiZTZkNDciLCJOdXJzZUlkIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQyNjExOTY1LCJpc3MiOiJOdXJzaW5nRWR1Y2F0aW9uYWxCYWNrZW5kIiwiYXVkIjoiTnVyc2luZ0VkdWNhdGlvbmFsQXBwIn0.7vR4EE9vzc8vC9XOgQ9XlZQZimzp8s9-hQdOSVAX9Hc" \
    -H "Content-Type: application/json"
  ```
- **Success Response**:
  ```json
  {
    "patient": {
      "patientId": 1,
      "patientWristId": "W-0001",
      "fullName": "John Doe",
      "dob": "1975-07-04",
      "nurseId": 1,
      "records": [...]
    },
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
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
  - **403 Forbidden**: If user doesn't have Admin role
  - **404 Not Found**: If patient with given ID doesn't exist

#### Get Patient with All Assessments (Admin)
- **URL**: `/api/Patients/admin/patient/{id}/assessments`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Description**: Retrieves patient information with all assessment data (admin access only)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/admin/patient/1/assessments" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AbnVyc2luZy5lZHUiLCJqdGkiOiJjZDZhNWE2OC00NzM5LTQ4YmItYWNmMC1lNjQyMDNiZTZkNDciLCJOdXJzZUlkIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQyNjExOTY1LCJpc3MiOiJOdXJzaW5nRWR1Y2F0aW9uYWxCYWNrZW5kIiwiYXVkIjoiTnVyc2luZ0VkdWNhdGlvbmFsQXBwIn0.7vR4EE9vzc8vC9XOgQ9XlZQZimzp8s9-hQdOSVAX9Hc" \
    -H "Content-Type: application/json"
  ```
- **Success Response**:
  ```json
  {
    "patient": {
      "patientId": 1,
      "patientWristId": "W-0001",
      "fullName": "John Doe",
      "dob": "1975-07-04",
      "nurseId": 1,
      "records": [...]
    },
    "cognitiveData": [
      {
        "recordId": 1,
        "assessment": {
          "cognitiveId": 1,
          "speech": "Clear",
          "loc": "Alert",
          "mmse": "28/30",
          "confusion": "None"
        }
      }
    ],
    "nutritionData": [
      {
        "recordId": 1,
        "assessment": {
          "nutritionId": 1,
          "diet": "Regular",
          "appetite": "Good",
          "swallowing": "Normal",
          "assistance": "Independent"
        }
      }
    ],
    "eliminationData": [...],
    "mobilityData": [...],
    "safetyData": [...],
    "adlData": [...],
    "skinData": [...],
    "behaviourData": [...],
    "progressNoteData": [...]
  }
  ```
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
  - **403 Forbidden**: If user doesn't have Admin role
  - **404 Not Found**: If patient with given ID doesn't exist
    ```json
    {
      "message": "Patient with ID 1 not found"
    }
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error retrieving patient assessments for admin",
      "error": "Error message"
    }
    ```

### Nurse Endpoints

#### Get Assigned Patients (Nurse)
- **URL**: `/api/Patients/nurse/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Any authenticated user
- **Description**: Returns patients assigned to the authenticated nurse or patients with no nurse assignment
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/nurse/ids" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWJjZEBnbWFpbC5jb20iLCJqdGkiOiJiNGFjN2NhZC0wNWE1LTQ3YTctODBkMS1hODc2M2Q3YTBkMzAiLCJOdXJzZUlkIjoiMSIsImV4cCI6MTc0MjYxOTI3MywiaXNzIjoiTnVyc2luZ0VkdWNhdGlvbmFsQmFja2VuZCIsImF1ZCI6Ik51cnNpbmdFZHVjYXRpb25hbEFwcCJ9.5qCT3VhwvjrjWlqI1BI_GeyGLXj4lWl76Jg3ov6Xn3U" \
    -H "Content-Type: application/json"
  ```
- **Success Response**: 
  ```json
  [
    {
      "patientId": 1,
      "patientWristId": "W-0001", 
      "fullName": "John Doe",
      "dob": "1975-07-04",
      "nurseId": 1,
      "gender": "Male",
      "roomNumber": "101",
      "admitDate": "2023-05-15",
      "diagnosis": "Hypertension",
      "allergies": "Penicillin",
      "code": "Full Code"
    },
    {
      "patientId": 3,
      "patientWristId": "W-0003", 
      "fullName": "Robert Johnson",
      "dob": "1965-11-12",
      "nurseId": null,
      "gender": "Male",
      "roomNumber": "104",
      "admitDate": "2023-07-01",
      "diagnosis": "CHF",
      "allergies": "Sulfa",
      "code": "Full Code"
    }
  ]
  ```
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
    ```json
    {
      "message": "Invalid token or missing NurseId claim"
    }
    ```
  - **400 Bad Request**: If NurseId format is invalid
    ```json
    {
      "message": "Invalid NurseId format"
    }
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error retrieving nurse patients",
      "error": "Error message"
    }
    ```
  - **500 Internal Server Error**: If ID mapping issue occurs
    ```json
    {
      "message": "Error retrieving patient IDs - all IDs are 0"
    }
    ```

#### Get Patient with Cognitive Data (Nurse)
- **URL**: `/api/Patients/nurse/patient/{id}/cognitive`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Any authenticated user
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Description**: Retrieves cognitive assessment data for a patient assigned to the nurse
- **Notes**: Only patients assigned to the nurse or with null NurseId can be accessed
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/nurse/patient/1/cognitive" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWJjZEBnbWFpbC5jb20iLCJqdGkiOiJiNGFjN2NhZC0wNWE1LTQ3YTctODBkMS1hODc2M2Q3YTBkMzAiLCJOdXJzZUlkIjoiMSIsImV4cCI6MTc0MjYxOTI3MywiaXNzIjoiTnVyc2luZ0VkdWNhdGlvbmFsQmFja2VuZCIsImF1ZCI6Ik51cnNpbmdFZHVjYXRpb25hbEFwcCJ9.5qCT3VhwvjrjWlqI1BI_GeyGLXj4lWl76Jg3ov6Xn3U" \
    -H "Content-Type: application/json"
  ```
- **Success Response**: Same format as admin endpoint
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
  - **403 Forbidden**: If patient is not assigned to the nurse
  - **404 Not Found**: If patient with given ID doesn't exist

#### Get Patient with All Assessments (Nurse)
- **URL**: `/api/Patients/nurse/patient/{id}/assessments`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Any authenticated user
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Description**: Retrieves all assessment data for a patient assigned to the nurse
- **Notes**: Only patients assigned to the nurse or with null NurseId can be accessed
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/nurse/patient/1/assessments" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWJjZEBnbWFpbC5jb20iLCJqdGkiOiJiNGFjN2NhZC0wNWE1LTQ3YTctODBkMS1hODc2M2Q3YTBkMzAiLCJOdXJzZUlkIjoiMSIsImV4cCI6MTc0MjYxOTI3MywiaXNzIjoiTnVyc2luZ0VkdWNhdGlvbmFsQmFja2VuZCIsImF1ZCI6Ik51cnNpbmdFZHVjYXRpb25hbEFwcCJ9.5qCT3VhwvjrjWlqI1BI_GeyGLXj4lWl76Jg3ov6Xn3U" \
    -H "Content-Type: application/json"
  ```
- **Success Response**: Same format as admin endpoint
- **Error Responses**:
  - **401 Unauthorized**: If user is not authenticated
  - **403 Forbidden**: If patient is not assigned to the nurse
  - **404 Not Found**: If patient with given ID doesn't exist

## Patient Create Endpoint

### Create Patient with Complete Medical Data
- **URL**: `/api/PatientCreate`
- **Method**: `POST`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Creates a new patient record with all associated medical information in a single request
- **Request Headers**:
  | Header          | Value                | Description                           |
  |-----------------|----------------------|---------------------------------------|
  | Content-Type    | application/json     | Format of the request body            |
  | Authorization   | Bearer {jwt_token}   | JWT token for authentication          |

- **Request Body**:
  ```json
  {
    "patient": {
      "fullName": "John Doe",
      "sex": "Male",
      "patientWristId": "P12345",
      "nextOfKin": "Jane Doe (Wife)",
      "height": "5'10\"",
      "weight": 180,
      "dateOfBirth": "1975-05-15",
      "allergies": "Penicillin, Shellfish",
      "isolationPrecautions": "None",
      "diagnosis": "Type 2 Diabetes",
      "admissionDate": "2025-03-20",
      "room": "101",
      "dietRestrictions": "Low sodium, diabetic"
    },
    "behaviourReport": "Patient is cooperative and alert. Oriented to person, place, and time.",
    "adl": {
      "bathDate": "2025-03-24",
      "tubShowerOther": "Shower with assistance",
      "typeOfCare": "Partial assistance",
      "turningSchedule": "Every 2 hours during day, every 3 hours at night",
      "teeth": "Independent with supervision",
      "footCare": "Requires assistance for nail care",
      "hairCare": "Independent with grooming"
    },
    "cognitive": {
      "speech": "Clear and coherent",
      "loc": "Alert and oriented x4",
      "mmse": "28/30",
      "confusion": "No signs of confusion"
    },
    "elimination": {
      "incontinentOfBladder": "No",
      "incontinentOfBowel": "No",
      "dayOrNightProduct": "None required",
      "lastBowelMovement": "2025-03-23",
      "bowelRoutine": "Regular, once daily",
      "bladderRoutine": "Self-toileting every 3-4 hours",
      "catheterInsertionDate": "2025-01-01",
      "catheterInsertion": "No catheter present"
    },
    "mobility": {
      "transfer": "Requires minimal assistance",
      "aids": "Uses walker for ambulation",
      "bedMobility": "Independent with bed rails"
    },
    "nutrition": {
      "diet": "Diabetic, low sodium",
      "assit": "Independent with setup",
      "intake": "Good - consumes 80% of meals",
      "time": "Regular meal times: 8am, 12pm, 6pm",
      "dietarySupplementInfo": "Ensure Plus once daily",
      "weight": 180,
      "date": "2025-03-24",
      "method": "Standing scale with assistance",
      "ivSolutionRate": "No IV present",
      "specialNeeds": "Needs reminder to drink adequate fluids"
    },
    "progressNote": {
      "timestamp": "2025-03-24T09:30:00",
      "note": "Patient reports feeling well this morning. Vitals stable."
    },
    "safety": {
      "hipProtectors": "Not required",
      "sideRails": "Two side rails up at night",
      "fallRiskScale": "Moderate risk - score 14",
      "crashMats": "Not required",
      "bedAlarm": "Not required"
    },
    "skinAndSensoryAid": {
      "glasses": "Wears glasses for reading",
      "hearing": "No hearing impairment noted",
      "skinIntegrityPressureUlcerRisk": "Low risk",
      "skinIntegrityTurningSchedule": "Every 2 hours during day",
      "skinIntegrityBradenScale": "Score 20 - Low risk",
      "skinIntegrityDressings": "None required"
    }
  }
  ```

- **Field Requirements**:
  
  #### Patient Object
  | Field                 | Type     | Required | Description                            |
  |-----------------------|----------|----------|----------------------------------------|
  | fullName              | string   | Yes      | Patient's full name                    |
  | sex                   | string   | Yes      | Patient's sex                          |
  | patientWristId        | string   | Yes      | ID on patient's wristband              |
  | nextOfKin             | string   | Yes      | Emergency contact information          |
  | height                | string   | Yes      | Patient's height                       |
  | weight                | integer  | Yes      | Patient's weight in pounds             |
  | dateOfBirth           | string   | No       | Patient's date of birth (YYYY-MM-DD)   |
  | allergies             | string   | Yes      | Known allergies                        |
  | isolationPrecautions  | string   | Yes      | Required isolation precautions         |
  | diagnosis             | string   | No       | Medical diagnosis                      |
  | admissionDate         | string   | No       | Date of admission (YYYY-MM-DD)         |
  | room                  | string   | No       | Room number                            |
  | dietRestrictions      | string   | No       | Dietary restrictions                   |
  
  #### ADL (Activities of Daily Living) Object
  | Field            | Type     | Required | Description                            |
  |------------------|----------|----------|----------------------------------------|
  | bathDate         | string   | Yes      | Date of bath (YYYY-MM-DD)              |
  | tubShowerOther   | string   | Yes      | Type of bathing used                   |
  | typeOfCare       | string   | Yes      | Level of care required                 |
  | turningSchedule  | string   | Yes      | Schedule for turning patient           |
  | teeth            | string   | Yes      | Dental care details                    |
  | footCare         | string   | Yes      | Foot care details                      |
  | hairCare         | string   | Yes      | Hair care details                      |
  
  #### Cognitive Object
  | Field            | Type     | Required | Description                            |
  |------------------|----------|----------|----------------------------------------|
  | speech           | string   | Yes      | Speech capabilities and issues         |
  | loc              | string   | No       | Level of consciousness                 |
  | mmse             | string   | No       | Mini-Mental State Examination results  |
  | confusion        | string   | No       | Notes on confusion or disorientation   |
  
  #### Elimination Object
  | Field                 | Type     | Required | Description                            |
  |-----------------------|----------|----------|----------------------------------------|
  | incontinentOfBladder  | string   | Yes      | Bladder incontinence details           |
  | incontinentOfBowel    | string   | Yes      | Bowel incontinence details             |
  | dayOrNightProduct     | string   | Yes      | Products used for incontinence         |
  | lastBowelMovement     | string   | Yes      | Date of last bowel movement (YYYY-MM-DD) |
  | bowelRoutine          | string   | Yes      | Bowel elimination routine              |
  | bladderRoutine        | string   | Yes      | Bladder elimination routine            |
  | catheterInsertionDate | string   | Yes      | Date of catheter insertion (YYYY-MM-DD)|
  | catheterInsertion     | string   | Yes      | Catheter insertion details             |
  
  #### Mobility Object
  | Field            | Type     | Required | Description                            |
  |------------------|----------|----------|----------------------------------------|
  | transfer         | string   | Yes      | Patient transfer details               |
  | aids             | string   | Yes      | Mobility aids used                     |
  | bedMobility      | string   | Yes      | Bed mobility details                   |
  
  #### Nutrition Object
  | Field                   | Type     | Required | Description                            |
  |-------------------------|----------|----------|----------------------------------------|
  | diet                    | string   | Yes      | Diet type                              |
  | assit                   | string   | Yes      | Assistance level required              |
  | intake                  | string   | Yes      | Food/fluid intake details              |
  | time                    | string   | Yes      | Feeding schedule                       |
  | dietarySupplementInfo   | string   | Yes      | Dietary supplements                    |
  | weight                  | integer  | Yes      | Weight in pounds                       |
  | date                    | string   | Yes      | Date of assessment (YYYY-MM-DD)        |
  | method                  | string   | Yes      | Method of weight measurement           |
  | ivSolutionRate          | string   | Yes      | IV solution rate if applicable         |
  | specialNeeds            | string   | Yes      | Special nutritional needs              |
  
  #### Progress Note Object
  | Field            | Type     | Required | Description                            |
  |------------------|----------|----------|----------------------------------------|
  | timestamp        | string   | No       | Time of note (YYYY-MM-DDThh:mm:ss)     |
  | note             | string   | Yes      | Detailed progress note                 |
  
  #### Safety Object
  | Field            | Type     | Required | Description                            |
  |------------------|----------|----------|----------------------------------------|
  | hipProtectors    | string   | Yes      | Hip protectors usage                   |
  | sideRails        | string   | Yes      | Side rails usage                       |
  | fallRiskScale    | string   | Yes      | Fall risk assessment                   |
  | crashMats        | string   | Yes      | Crash mats usage                       |
  | bedAlarm         | string   | Yes      | Bed alarm usage                        |
  
  #### Skin and Sensory Aid Object
  | Field                           | Type     | Required | Description                            |
  |---------------------------------|----------|----------|----------------------------------------|
  | glasses                         | string   | Yes      | Vision aid details                     |
  | hearing                         | string   | Yes      | Hearing aid details                    |
  | skinIntegrityPressureUlcerRisk  | string   | Yes      | Pressure ulcer risk assessment         |
  | skinIntegrityTurningSchedule    | string   | Yes      | Turning schedule for skin integrity    |
  | skinIntegrityBradenScale        | string   | Yes      | Braden scale assessment for skin risk  |
  | skinIntegrityDressings          | string   | Yes      | Skin dressings details                 |

- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: JSON object with all created entities including their database IDs
  - **Example**:
    ```json
    {
      "patient": {
        "patientId": 7,
        "nurseId": null,
        "imageFilename": null,
        "bedNumber": null,
        "nextOfKin": "Jane Doe (Wife)",
        "nextOfKinPhone": 0,
        "fullName": "John Doe",
        "sex": "Male",
        "patientWristId": "P12345",
        "dob": "0001-01-01",
        "admissionDate": "2025-03-20",
        "dischargeDate": null,
        "maritalStatus": null,
        "medicalHistory": null,
        "weight": 180,
        "height": "5'10\"",
        "allergies": "Penicillin, Shellfish",
        "isolationPrecautions": "None",
        "roamAlertBracelet": null,
        "nurse": null,
        "records": [
          {
            "recordId": 5,
            "patientId": 7,
            "cognitiveId": 1,
            "nutritionId": 1,
            "eliminationId": 1,
            "mobilityId": 1,
            "safetyId": 1,
            "adlsId": 2,
            "skinId": 1,
            "behaviourId": 4,
            "progressNoteId": 1
          }
        ]
      },
      "behaviour": {
        "behaviourId": 4,
        "report": "Patient is cooperative and alert. Oriented to person, place, and time."
      },
      "adl": {
        "adlsId": 2,
        "bathDate": "2025-03-24",
        "tubShowerOther": "Shower with assistance",
        "typeOfCare": "Partial assistance",
        "turningSchedule": "Every 2 hours during day, every 3 hours at night",
        "teeth": "Independent with supervision",
        "footCare": "Requires assistance for nail care",
        "hairCare": "Independent with grooming"
      },
      "cognitive": {
        "cognitiveId": 1,
        "speech": "Clear and coherent",
        "loc": "Alert and oriented x4",
        "mmse": "28/30",
        "confusion": "No signs of confusion"
      },
      "elimination": {
        "eliminationId": 1,
        "incontinentOfBladder": "No",
        "incontinentOfBowel": "No",
        "dayOrNightProduct": "None required",
        "lastBowelMovement": "2025-03-23",
        "bowelRoutine": "Regular, once daily",
        "bladderRoutine": "Self-toileting every 3-4 hours",
        "catheterInsertionDate": "2025-01-01",
        "catheterInsertion": "No catheter present"
      },
      "mobility": {
        "mobilityId": 1,
        "transfer": "Requires minimal assistance",
        "aids": "Uses walker for ambulation",
        "bedMobility": "Independent with bed rails"
      },
      "nutrition": {
        "nutritionId": 1,
        "diet": "Diabetic, low sodium",
        "assit": "Independent with setup",
        "intake": "Good - consumes 80% of meals",
        "time": "Regular meal times: 8am, 12pm, 6pm",
        "dietarySupplementInfo": "Ensure Plus once daily",
        "weight": 180,
        "date": "2025-03-24",
        "method": "Standing scale with assistance",
        "ivSolutionRate": "No IV present",
        "specialNeeds": "Needs reminder to drink adequate fluids"
      },
      "progressNote": {
        "progressNoteId": 1,
        "timestamp": "2025-03-24T09:30:00",
        "note": "Patient reports feeling well this morning. Vitals stable."
      },
      "safety": {
        "safetyId": 1,
        "hipProtectors": "Not required",
        "sideRails": "Two side rails up at night",
        "fallRiskScale": "Moderate risk - score 14",
        "crashMats": "Not required",
        "bedAlarm": "Not required"
      },
      "skinAndSensoryAid": {
        "skinAndSensoryAidsId": 1,
        "glasses": "Wears glasses for reading",
        "hearing": "No hearing impairment noted",
        "skinIntegrityPressureUlcerRisk": "Low risk",
        "skinIntegrityTurningSchedule": "Every 2 hours during day",
        "skinIntegrityBradenScale": "Score 20 - Low risk",
        "skinIntegrityDressings": "None required"
      },
      "record": {
        "recordId": 5,
        "patientId": 7,
        "cognitiveId": 1,
        "nutritionId": 1,
        "eliminationId": 1,
        "mobilityId": 1,
        "safetyId": 1,
        "adlsId": 2,
        "skinId": 1,
        "behaviourId": 4,
        "progressNoteId": 1
      }
    }
    ```

- **Error Responses**:
  - **400 Bad Request**: If validation fails
    ```json
    { "error": "Missing required patient information" }
    ```
  - **401 Unauthorized**: If authentication fails
    ```json
    { "error": "Authentication failed" }
    ```
  - **403 Forbidden**: If user doesn't have Admin role
    ```json
    { "error": "Insufficient permissions" }
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    { "error": "Internal server error: [error details]" }
    ```

- **Example cURL Request**:
  ```bash
  curl -X POST "http://localhost:5232/api/PatientCreate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AbnVyc2luZy5lZHUiLCJqdGkiOiIzNDljOTIzZi1jNDA1LTRhZTgtODU0Mi0xMDAzZTk1NDJkNjAiLCJOdXJzZUlkIjoiMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzQyNTk5MTY4LCJpc3MiOiJOdXJzaW5nRWR1Y2F0aW9uYWxCYWNrZW5kIiwiYXVkIjoiTnVyc2luZ0VkdWNhdGlvbmFsQXBwIn0.Hif7LP51g9Y85gjkRGsLwTgXad-W4Hs_TJbks8qd-ks" \
  -d '{
    "patient": {
      "fullName": "John Doe",
      "sex": "Male",
      "patientWristId": "P12345",
      "nextOfKin": "Jane Doe (Wife)",
      "height": "5'\''10\"",
      "weight": 180,
      "allergies": "Penicillin, Shellfish",
      "isolationPrecautions": "None",
      "diagnosis": "Type 2 Diabetes",
      "admissionDate": "2025-03-20"
    },
    "behaviourReport": "Patient is cooperative and alert."
    // Additional fields as required
  }'
  ```

## API Security

All endpoints except for registration and login require JWT token authentication. The token must be included in the Authorization header as a Bearer token.

### Role-Based Access Control
- **Admin-only endpoints**: Paths containing `/admin/` or endpoints like `/api/PatientCreate` require the "Admin" role
- **Nurse endpoints**: Paths containing `/nurse/` can be accessed by any authenticated user, but they will only show patients assigned to that nurse or patients with no nurse assignment

### JWT Token Claims
- The token includes the nurse's ID in the "NurseId" claim
- Admin users have the "Admin" role claim
- The token expiration is set by the server configuration
