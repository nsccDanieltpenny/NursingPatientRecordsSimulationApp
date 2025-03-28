# Nursing Educational Backend API Documentation

## Authentication Endpoints

### Register
- **URL**: `/api/Auth/register`
- **Method**: `POST`
- **Auth Required**: No
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

### Login
- **URL**: `/api/Auth/login`
- **Method**: `POST`
- **Auth Required**: No
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

### Logout
- **URL**: `/api/Auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes
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

## Patient Endpoints

### Admin Endpoints

#### Get All Patients (Admin)
- **URL**: `/api/Patients/admin/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
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
  *Note: The endpoint now returns full patient records instead of just IDs and names.*

#### Get Patient with Cognitive Data (Admin)
- **URL**: `/api/Patients/admin/patient/{id}/cognitive`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
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

#### Get Patient with All Assessments (Admin)
- **URL**: `/api/Patients/admin/patient/{id}/assessments`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
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

### Nurse Endpoints

#### Get Assigned Patients (Nurse)
- **URL**: `/api/Patients/nurse/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Any authenticated user
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
  *Note: The endpoint now returns full patient records instead of just IDs and names. It includes patients assigned to the nurse or with null NurseId.*

#### Get Patient with Cognitive Data (Nurse)
- **URL**: `/api/Patients/nurse/patient/{id}/cognitive`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Any authenticated user
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/nurse/patient/1/cognitive" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWJjZEBnbWFpbC5jb20iLCJqdGkiOiJiNGFjN2NhZC0wNWE1LTQ3YTctODBkMS1hODc2M2Q3YTBkMzAiLCJOdXJzZUlkIjoiMSIsImV4cCI6MTc0MjYxOTI3MywiaXNzIjoiTnVyc2luZ0VkdWNhdGlvbmFsQmFja2VuZCIsImF1ZCI6Ik51cnNpbmdFZHVjYXRpb25hbEFwcCJ9.5qCT3VhwvjrjWlqI1BI_GeyGLXj4lWl76Jg3ov6Xn3U" \
    -H "Content-Type: application/json"
  ```
- **Notes**: Only patients assigned to the nurse or with null NurseId can be accessed
- **Success Response**: Same as admin endpoint

#### Get Patient with All Assessments (Nurse)
- **URL**: `/api/Patients/nurse/patient/{id}/assessments`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Any authenticated user
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/nurse/patient/1/assessments" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWJj