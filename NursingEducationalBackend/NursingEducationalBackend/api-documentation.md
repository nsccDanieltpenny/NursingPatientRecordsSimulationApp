# Nursing Educational Backend API Documentation

## Overview

This API documentation covers the endpoints for the Nursing Educational Backend system. The API allows for authentication, user management, patient management, class management, and medical record creation/retrieval. All secure endpoints require a valid JWT token obtained through the login process.

This documentation is updated as of May 8, 2025.

## Base URLs

- Development: `http://localhost:5232`

## Authentication & Authorization

All endpoints except for registration and login require JWT token authentication. The token must be included in the Authorization header as a Bearer token.

```
Authorization: Bearer [your_token]
```

### Role-Based Access Control
- **Admin-only endpoints**: Paths containing `/admin/` or `/api/Admin/` and Class API endpoints require the "Admin" role
- **Nurse endpoints**: Paths containing `/nurse/` can be accessed by any authenticated user, but they will only show patients assigned to that nurse or patients with no nurse assignment

### JWT Token Information

The JWT token returned by the login endpoint contains the following claims:

- **Name**: The user's email address
- **Jti**: A unique token identifier
- **NurseId**: The nurse's ID in the system
- **Campus**: The campus the nurse is associated with 
- **Roles**: (If assigned) User roles such as "Admin"
- **Expiration**: Token expiration time (configured in minutes via JwtSettings:DurationInMinutes)
- **Issuer**: The issuing authority (configured via JwtSettings:Issuer)
- **Audience**: The intended audience (configured via JwtSettings:Audience)

---

## Auth API

### Register

Creates a new user account.

- **URL**: `/api/Auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "fullName": "Student Name",
    "studentNumber": "S12345",
    "campus": "Main Campus"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "student@example.com",
      "password": "Password123!",
      "confirmPassword": "Password123!",
      "fullName": "Student Name",
      "studentNumber": "S12345",
      "campus": "Main Campus"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "User registered successfully!"
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Email already exists!"
  }
  ```
- **Code**: 400 Bad Request
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

Authenticates a user and returns a JWT token.

- **URL**: `/api/Auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "Password123!"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "student@example.com",
      "password": "Password123!"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "token": "eyJhbGci...[token]",
    "nurseId": 1,
    "fullName": "Student Name",
    "email": "student@example.com",
    "roles": ["Student"],
    "campus": "Main Campus"
  }
  ```

#### Error Response

- **Code**: 401 Unauthorized
  ```json
  {
    "success": false,
    "message": "Invalid email or password."
  }
  ```
- **Code**: 401 Unauthorized
  ```json
  {
    "success": false,
    "message": "Nurse record not found."
  }
  ```

### Logout

Logs out the current user.

- **URL**: `/api/Auth/logout`
- **Method**: `POST`
- **Auth required**: Yes
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Auth/logout" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## Admin API

Admin endpoints for user management and patient data administration. These endpoints require Admin role.

### 1. Delete User

Removes a user and their associated nurse record from the system.

- **URL**: `/api/Admin/users/{email}`
- **Method**: `DELETE`
- **URL Parameters**:
  - `email`: The email address of the user to delete
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X DELETE \
    "http://localhost:5232/api/Admin/users/student@example.com" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully."
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Invalid email format."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Cannot delete the last admin user."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Cannot delete user as they have associated patients. Reassign patients first."
  }
  ```

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "User not found."
  }
  ```

### 2. Reset User Password

Resets the password for a specified user.

- **URL**: `/api/Admin/users/{email}/reset-password`
- **Method**: `POST`
- **URL Parameters**:
  - `email`: The email address of the user
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "newPassword": "NewSecurePassword123!"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Admin/users/student@example.com/reset-password" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "newPassword": "NewSecurePassword123!"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully."
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Invalid email format."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Password must meet complexity requirements: at least 8 characters, including uppercase, lowercase, number, and special character."
  }
  ```

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "User not found."
  }
  ```

### 3. Reset Admin's Own Password

Allows an admin to change their own password.

- **URL**: `/api/Admin/reset-my-password`
- **Method**: `POST`
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "currentPassword": "CurrentSecurePassword123!",
    "newPassword": "NewSecurePassword456!"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Admin/reset-my-password" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "currentPassword": "CurrentSecurePassword123!",
      "newPassword": "NewSecurePassword456!"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully."
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Password must meet complexity requirements: at least 8 characters, including uppercase, lowercase, number, and special character."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Current password is incorrect."
  }
  ```

### 4. Create Admin Account

Creates a new user with Admin role.

- **URL**: `/api/Admin/create-admin`
- **Method**: `POST`
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "email": "newadmin@example.com",
    "password": "SecurePassword123!",
    "fullName": "New Admin User",
    "studentNumber": "A12345",
    "campus": "Main Campus"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Admin/create-admin" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "newadmin@example.com",
      "password": "SecurePassword123!",
      "fullName": "New Admin User",
      "studentNumber": "A12345",
      "campus": "Main Campus"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Admin account created successfully!",
    "nurseId": 5
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Invalid email format."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Email already exists!"
  }
  ```

### 5. Update Patient Information

Updates a patient's information, except for the PatientId.

- **URL**: `/api/Admin/patients/{patientId}`
- **Method**: `PUT`
- **URL Parameters**:
  - `patientId`: The ID of the patient to update
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "nurseId": 5,
    "imageFilename": "patient123.jpg",
    "bedNumber": 42,
    "nextOfKin": "Jane Doe",
    "nextOfKinPhone": "555-123-4567",
    "fullName": "John Doe",
    "sex": "Male",
    "patientWristId": "WID123456",
    "dob": "1980-01-15",
    "admissionDate": "2023-05-10",
    "dischargeDate": null,
    "maritalStatus": "Married",
    "medicalHistory": "Hypertension, Diabetes",
    "weight": 75,
    "height": "180cm",
    "allergies": "Penicillin",
    "isolationPrecautions": "None",
    "unit": "Cardiology",
    "roamAlertBracelet": "No"
  }
  ```
- **Example Request**:
  ```bash
  curl -X PUT \
    "http://localhost:5232/api/Admin/patients/1" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "nurseId": 5,
      "imageFilename": "patient123.jpg",
      "bedNumber": 42,
      "nextOfKin": "Jane Doe",
      "nextOfKinPhone": "555-123-4567",
      "fullName": "John Doe",
      "sex": "Male",
      "patientWristId": "WID123456",
      "dob": "1980-01-15",
      "admissionDate": "2023-05-10",
      "dischargeDate": null,
      "maritalStatus": "Married",
      "medicalHistory": "Hypertension, Diabetes",
      "weight": 75,
      "height": "180cm",
      "allergies": "Penicillin",
      "isolationPrecautions": "None",
      "unit": "Cardiology",
      "roamAlertBracelet": "No"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Patient updated successfully.",
    "patient": {
      "patientId": 1,
      "nurseId": 5,
      "imageFilename": "patient123.jpg",
      "bedNumber": 42,
      "nextOfKin": "Jane Doe",
      "nextOfKinPhone": "555-123-4567",
      "fullName": "John Doe",
      "sex": "Male",
      "patientWristId": "WID123456",
      "dob": "1980-01-15",
      "admissionDate": "2023-05-10",
      "dischargeDate": null,
      "maritalStatus": "Married",
      "medicalHistory": "Hypertension, Diabetes",
      "weight": 75,
      "height": "180cm",
      "allergies": "Penicillin",
      "isolationPrecautions": "None",
      "unit": "Cardiology",
      "roamAlertBracelet": "No"
    }
  }
  ```

---

## Class API

The Class API endpoints allow administrators to manage classes and student assignments. These endpoints require Admin role.

### 1. Get All Classes

Retrieves a list of all classes with their details and student counts.

- **URL**: `/api/Class`
- **Method**: `GET`
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Class" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  [
    {
      "classId": 1,
      "name": "Nursing 101",
      "description": "Introduction to Nursing",
      "startDate": "2023-09-01",
      "endDate": "2023-12-15",
      "instructorId": 5,
      "instructorName": "Dr. Smith",
      "campus": "Main Campus",
      "studentCount": 25
    },
    {
      "classId": 2,
      "name": "Clinical Practice",
      "description": "Hands-on clinical training",
      "startDate": "2023-09-15",
      "endDate": "2023-12-20",
      "instructorId": 8,
      "instructorName": "Dr. Johnson",
      "campus": "Medical Campus",
      "studentCount": 15
    }
  ]
  ```

### 2. Get Class by ID

Retrieves details of a specific class.

- **URL**: `/api/Class/{classId}`
- **Method**: `GET`
- **URL Parameters**:
  - `classId`: The ID of the class to retrieve
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Class/1" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "classId": 1,
    "name": "Nursing 101",
    "description": "Introduction to Nursing",
    "startDate": "2023-09-01",
    "endDate": "2023-12-15",
    "instructorId": 5,
    "instructorName": "Dr. Smith",
    "campus": "Main Campus",
    "studentCount": 25
  }
  ```

#### Error Response

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Class not found."
  }
  ```

### 3. Create Class

Creates a new class.

- **URL**: `/api/Class`
- **Method**: `POST`
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "name": "Advanced Patient Care",
    "description": "Advanced techniques in patient care",
    "startDate": "2023-10-01",
    "endDate": "2024-03-15",
    "instructorId": 10,
    "campus": "Medical Campus"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Class" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Advanced Patient Care",
      "description": "Advanced techniques in patient care",
      "startDate": "2023-10-01",
      "endDate": "2024-03-15",
      "instructorId": 10,
      "campus": "Medical Campus"
    }'
  ```

#### Success Response

- **Code**: 201 Created
- **Content**:
  ```json
  {
    "classId": 3,
    "name": "Advanced Patient Care",
    "description": "Advanced techniques in patient care",
    "startDate": "2023-10-01",
    "endDate": "2024-03-15",
    "instructorId": 10,
    "instructorName": "Dr. Williams",
    "campus": "Medical Campus",
    "studentCount": 0
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Specified instructor does not exist."
  }
  ```

### 4. Update Class

Updates an existing class.

- **URL**: `/api/Class/{classId}`
- **Method**: `PUT`
- **URL Parameters**:
  - `classId`: The ID of the class to update
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "name": "Advanced Patient Care - Updated",
    "description": "Updated description",
    "startDate": "2023-10-15",
    "endDate": "2024-04-01",
    "instructorId": 12,
    "campus": "Medical Campus"
  }
  ```
- **Example Request**:
  ```bash
  curl -X PUT \
    "http://localhost:5232/api/Class/3" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Advanced Patient Care - Updated",
      "description": "Updated description",
      "startDate": "2023-10-15",
      "endDate": "2024-04-01",
      "instructorId": 12,
      "campus": "Medical Campus"
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Class updated successfully."
  }
  ```

#### Error Responses

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Class not found."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "End date cannot be earlier than start date."
  }
  ```

### 5. Delete Class

Deletes a class and removes all student assignments to that class.

- **URL**: `/api/Class/{classId}`
- **Method**: `DELETE`
- **URL Parameters**:
  - `classId`: The ID of the class to delete
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X DELETE \
    "http://localhost:5232/api/Class/3" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Class deleted successfully."
  }
  ```

#### Error Response

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Class not found."
  }
  ```

### 6. Get Students in Class

Retrieves a list of all students in a specific class.

- **URL**: `/api/Class/{classId}/students`
- **Method**: `GET`
- **URL Parameters**:
  - `classId`: The ID of the class
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Class/1/students" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  [
    {
      "nurseId": 15,
      "fullName": "John Student",
      "studentNumber": "S12345",
      "email": "john@example.com",
      "campus": "Main Campus"
    },
    {
      "nurseId": 16,
      "fullName": "Jane Student",
      "studentNumber": "S12346",
      "email": "jane@example.com",
      "campus": "Main Campus"
    }
  ]
  ```

#### Error Response

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Class not found."
  }
  ```

### 7. Assign Student to Class

Assigns a student to a class. If the student is already in a different class, they will be reassigned.

- **URL**: `/api/Class/{classId}/students`
- **Method**: `POST`
- **URL Parameters**:
  - `classId`: The ID of the class
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "nurseId": 18
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Class/1/students" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "nurseId": 18
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Student assigned to class successfully."
  }
  ```

#### Error Responses

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Class not found."
  }
  ```

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Student not found."
  }
  ```

- **Code**: 400 Bad Request
  ```json
  {
    "success": false,
    "message": "Student is already assigned to this class."
  }
  ```

### 8. Assign Multiple Students to Class

Adds multiple students to a class in a single operation.

- **URL**: `/api/Class/{classId}/students/bulk`
- **Method**: `POST`
- **URL Parameters**:
  - `classId`: The ID of the class
- **Auth required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "nurseIds": [20, 21, 22, 23]
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Class/1/students/bulk" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
    -H "Content-Type: application/json" \
    -d '{
      "nurseIds": [20, 21, 22, 23]
    }'
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Bulk assignment complete: 2 students added, 1 students reassigned, 1 already in class, 0 not found."
  }
  ```

#### Error Response

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Class not found."
  }
  ```

### 9. Remove Student from Class

Removes a student from a class.

- **URL**: `/api/Class/{classId}/students/{nurseId}`
- **Method**: `DELETE`
- **URL Parameters**:
  - `classId`: The ID of the class
  - `nurseId`: The ID of the student to remove
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X DELETE \
    "http://localhost:5232/api/Class/1/students/15" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "success": true,
    "message": "Student removed from class successfully."
  }
  ```

#### Error Response

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Student is not in this class."
  }
  ```

### 10. Get Student's Class

Retrieves the class that a student is assigned to.

- **URL**: `/api/Class/students/{nurseId}`
- **Method**: `GET`
- **URL Parameters**:
  - `nurseId`: The ID of the student
- **Auth required**: Yes (Admin role)
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Class/students/15" \
    -H "Authorization: Bearer eyJhbGci...[token]"
  ```

#### Success Response

- **Code**: 200 OK
- **Content**:
  ```json
  {
    "classId": 1,
    "name": "Nursing 101",
    "description": "Introduction to Nursing",
    "startDate": "2023-09-01",
    "endDate": "2023-12-15",
    "instructorId": 5,
    "instructorName": "Dr. Smith",
    "campus": "Main Campus",
    "studentCount": 25
  }
  ```

#### Error Responses

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Student not found."
  }
  ```

- **Code**: 404 Not Found
  ```json
  {
    "success": false,
    "message": "Student is not assigned to any class."
  }
  ```

---

## Patient API

### Basic Patient Endpoints

#### Get All Patients
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

#### Get Patient By ID
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
  ```

#### Create Patient (PatientsController)
- **URL**: `/api/Patients`
- **Method**: `POST`
- **Auth Required**: No (Currently commented out in code)
- **Description**: Creates a new patient record
- **Request Body**: JSON object with Patient properties
- **Example Request**:
  ```bash
  curl -X POST \
    "http://localhost:5232/api/Patients" \
    -H "Content-Type: application/json" \
    -d '{
      "fullName": "Jane Smith",
      "patientWristId": "W-0002",
      "gender": "Female",
      "dob": "1980-03-22",
      "unit": "A",
      "bedNumber": 5,
      "allergies": "None"
    }'
  ```
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: The created patient object
- **Error Responses**:
  - **400 Bad Request**: If validation fails or if Unit/Bed combination already exists
    ```json
    {
      "message": "A patient is already assigned to Unit A, Bed 5. This combination must be unique."
    }
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error creating patient",
      "error": "Error message"
    }
    ```

#### Update Patient
- **URL**: `/api/Patients/{id}`
- **Method**: `PUT`
- **Auth Required**: No (Currently commented out in code)
- **Description**: Updates an existing patient record
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Request Body**: JSON object with updated Patient properties
- **Example Request**:
  ```bash
  curl -X PUT \
    "http://localhost:5232/api/Patients/1" \
    -H "Content-Type: application/json" \
    -d '{
      "patientId": 1,
      "fullName": "John Doe Updated",
      "patientWristId": "W-0001",
      "gender": "Male",
      "dob": "1975-07-04",
      "unit": "B",
      "bedNumber": 3,
      "allergies": "Penicillin, Sulfa"
    }'
  ```
- **Success Response**: 
  - **Code**: 204 No Content
- **Error Responses**:
  - **400 Bad Request**: If validation fails or if Unit/Bed combination already exists
    ```json
    {
      "message": "A patient is already assigned to Unit B, Bed 3. This combination must be unique."
    }
    ```
  - **404 Not Found**: If patient with given ID doesn't exist
    ```json
    {
      "message": "Patient with ID 1 not found"
    }
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error updating patient",
      "error": "Error message"
    }
    ```

### Patient Write Endpoints (PatientsWriteController)

#### Create Patient
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
      "unit": "A",
      "bedNumber": 5
    }'
  ```
- **Success Response**: 
  - **Code**: 200 OK
- **Error Responses**:
  - **400 Bad Request**: If validation fails or if Unit/Bed combination already exists
    ```json
    "A patient is already assigned to Unit A, Bed 5. This combination must be unique."
    ```
    Or
    ```json
    "Unable to create patient: Invalid model state"
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    "Unable to create patient: [error message]"
    ```

#### Assign Nurse to Patient
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

#### Submit Patient Data
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
  - skinsensoryaid
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
  - **Content**: `"Data submitted successfully"`
- **Error Responses**:
  - **400 Bad Request**: If validation fails
    ```json
    "Error submitting data: [error message]"
    ```
  - **404 Not Found**: If patient not found
    ```json
    "Patient not found"
    ```

### Nurse and Admin Patient Endpoints

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
    -H "Authorization: Bearer eyJhbGci...[token]" \
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

#### Get Patient Assessment By Type (Nurse)
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
    -H "Authorization: Bearer eyJhbGci...[token]"
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
    ```
  - **500 Internal Server Error**: If server error occurs
    ```json
    {
      "message": "Error retrieving data",
      "error": "Error message"
    }
    ```

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
    -H "Authorization: Bearer eyJhbGci...[token]" \
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

### Debug Endpoints

#### Debug: List All Database Tables (Admin)
- **URL**: `/api/Patients/debug/tables`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Returns database information for debugging purposes
- **Example Request**:
  ```bash
  curl -X GET \
    "http://localhost:5232/api/Patients/debug/tables" \
    -H "Authorization: Bearer eyJhbGci...[token]" \
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
      "Records",
      "Classes"
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
    ```