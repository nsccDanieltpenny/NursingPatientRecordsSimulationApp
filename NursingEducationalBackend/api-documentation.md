# CARE - Nursing Educational Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Authentication & Authorization](#authentication--authorization-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Classes Endpoints](#classes-endpoints)
- [Debug Endpoints](#debug-endpoints)
- [Instructor Endpoints](#instructor-endpoints)
- [Nurse Endpoints](#nurse-endpoints)
- [Patients Endpoints](#patients-endpoints)
- [Records Endpoints](#records-endpoints)
- [Rotations Endpoints](#rotations-endpoints)

---

## Overview

The CARE (Nursing Educational Backend) API is a RESTful service built with ASP.NET Core 9.0 that manages patient records, nursing assessments, class management, and user authentication for nursing education. The API uses Microsoft Entra ID (Azure AD) for authentication and SQL Server for data storage.

## Base URL

**Local Development**: `http://localhost:5232`  
**Production**: (Your deployed URL)

## Authentication

The API uses **Microsoft Entra ID (Azure AD)** for JWT bearer token authentication. All endpoints except public auth endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer {your-jwt-token}
```

### Role-Based Access Control

The API implements three user roles with different permission levels:

- **Admin**: Full system access, can manage all resources, approve instructors, and perform cleanup operations
- **Instructor**: Can manage classes, view student records
- **Nurse**: Can view patients, submit assessments

---

## Authentication & Authorization Endpoints

### Get User Profile
Get the authenticated user's profile information.

- **URL**: `/api/Auth/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns profile information for the authenticated user based on their Microsoft Entra ID token

**Example Request**:
```bash
curl -X GET "http://localhost:5232/api/Auth/profile" \
  -H "Authorization: Bearer {entra-id-token}"
```

**Success Response** (200 OK):
```json
{
  "nurseId": 1,
  "email": "student@college.edu",
  "fullName": "John Doe",
  "classId": 5,
  "className": "Nursing 101 - Spring 2026",
  "isInstructor": false,
  "isValid": true,
  "roles": ["Nurse"]
}
```

**Error Responses**:
- **400 Bad Request**: Unable to identify user from token
  ```json
  { "message": "Unable to identify user from token" }
  ```
- **404 Not Found**: User needs to enroll
  ```json
  { "message": "User not found" }
  ```

---

### Provision New User
Register a new user in the system (student, instructor, or admin).

- **URL**: `/api/Auth/provision`
- **Method**: `POST`
- **Auth Required**: Yes (Microsoft Entra ID token)
- **Description**: Provisions a new user account. Uses class code to determine user type

**Request Body**:
```json
{
  "classCode": "ABCDEF",
  "fullName": "John Doe",
  "studentNumber": "W1234567"
}
```

**Special Class Codes**:
- Regular class code (6 letters): Creates a student/nurse account
- Instructor request code (from environment): Creates instructor request (requires admin approval)
- Admin code (from environment, 16+ chars): Creates admin account

**Success Response - Student** (200 OK):
```json
{
  "success": true,
  "message": "User provisioned successfully",
  "nurseId": 15,
  "email": "student@college.edu",
  "fullName": "John Doe",
  "classId": 5,
  "className": "Nursing 101",
  "isInstructor": false,
  "isValid": true,
  "roles": []
}
```

**Success Response - Instructor Request** (200 OK):
```json
{
  "success": true,
  "message": "Instructor request submitted. Please wait for administrator approval.",
  "needsApproval": true,
  "nurseId": 20,
  "email": "instructor@college.edu",
  "fullName": "Jane Smith",
  "isInstructor": true,
  "isValid": false,
  "roles": []
}
```

**Error Responses**:
- **400 Bad Request**: User already exists or invalid data
  ```json
  { "message": "User already exists" }
  ```

---

### Get Instructor Request Code (Admin Only)
Retrieve the instructor request code for provisioning.

- **URL**: `/api/Auth/instructor-code`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin

**Success Response** (200 OK):
```json
{
  "code": "INSTRUCTOR2026"
}
```

---

## Admin Endpoints

All admin endpoints require the `Admin` role.

### Preview Records Cleanup
Preview which records would be deleted based on filter criteria.

- **URL**: `/api/Admin/records/cleanup-preview`
- **Method**: `POST`
- **Auth Required**: Yes
- **Required Role**: Admin

**Request Body**:
```json
{
  "classId": 5,
  "studentId": null,
  "rotationId": null,
  "beforeDate": "2026-01-01"
}
```

**Success Response** (200 OK):
```json
{
  "recordsDeleted": 45,
  "assessmentsDeleted": 180,
  "studentsDeleted": 0,
  "executedAt": "2026-02-18T10:30:00Z",
  "executedBy": "admin@college.edu"
}
```

---

### Delete Records
Delete records based on filter criteria.

- **URL**: `/api/Admin/records/cleanup`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Permanently deletes records and associated assessments

**Request Body**: Same as preview endpoint

**Success Response** (200 OK):
```json
{
  "recordsDeleted": 45,
  "assessmentsDeleted": 180,
  "studentsDeleted": 0,
  "executedAt": "2026-02-18T10:30:00Z",
  "executedBy": "admin@college.edu"
}
```

---

### Preview Nurses Cleanup
Preview which student accounts would be deleted.

- **URL**: `/api/Admin/nurses/cleanup-preview`
- **Method**: `POST`
- **Auth Required**: Yes
- **Required Role**: Admin

**Request Body**:
```json
{
  "classId": 5,
  "studentId": null
}
```

**Success Response** (200 OK):
```json
{
  "recordsDeleted": 0,
  "assessmentsDeleted": 0,
  "studentsDeleted": 12,
  "executedAt": "2026-02-18T10:30:00Z",
  "executedBy": "admin@college.edu"
}
```

---

### Delete Nurses/Students
Delete student accounts and their identity records.

- **URL**: `/api/Admin/nurses/cleanup`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Deletes student nurse accounts (not instructors) and their ASP.NET Identity users

**Request Body**: Same as preview endpoint

**Success Response** (200 OK):
```json
{
  "recordsDeleted": 0,
  "assessmentsDeleted": 0,
  "studentsDeleted": 12,
  "executedAt": "2026-02-18T10:30:00Z",
  "executedBy": "admin@college.edu"
}
```

---

## Classes Endpoints

### Get All Classes
Retrieve all classes (Admin sees all, Instructor sees only their classes).

- **URL**: `/api/Classes`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin or Instructor

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Nursing 101 - Spring 2026",
    "description": "Introduction to Nursing Care",
    "joinCode": "ABCDEF",
    "instructorId": 5,
    "startDate": "2026-01-15",
    "endDate": "2026-05-15",
    "studentCount": 25
  }
]
```

---

### Get Class by ID
Retrieve a specific class by ID.

- **URL**: `/api/Classes/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin or Instructor
- **URL Parameters**: `id` (integer) - Class ID

**Success Response** (200 OK):
```json
{
  "classId": 1,
  "name": "Nursing 101 - Spring 2026",
  "description": "Introduction to Nursing Care",
  "joinCode": "ABCDEF",
  "instructorId": 5,
  "startDate": "2026-01-15",
  "endDate": "2026-05-15"
}
```

---

### Get Class Students
Retrieve all students enrolled in a class.

- **URL**: `/api/Classes/{id}/students`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin or Instructor
- **URL Parameters**: `id` (integer) - Class ID

**Success Response** (200 OK):
```json
[
  {
    "nurseId": 10,
    "fullName": "John Doe",
    "studentNumber": "W1234567",
    "email": "john.doe@college.edu",
    "classId": 1
  }
]
```

---

### Verify Join Code
Verify if a class join code is valid.

- **URL**: `/api/Classes/verify/{id}`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `id` (string) - Join code to verify

**Success Response** (200 OK): Empty response  
**Error Response** (404 Not Found): Join code doesn't exist

---

### Create Class
Create a new class.

- **URL**: `/api/Classes`
- **Method**: `POST`
- **Auth Required**: Yes
- **Required Role**: Admin or Instructor
- **Description**: Creates a new class and auto-generates a unique 6-character join code

**Request Body**:
```json
{
  "name": "Nursing 201 - Fall 2026",
  "description": "Advanced Nursing Care",
  "startDate": "2026-09-01",
  "endDate": "2026-12-15"
}
```

**Success Response** (201 Created):
```json
{
  "id": 2,
  "name": "Nursing 201 - Fall 2026",
  "description": "Advanced Nursing Care",
  "joinCode": "XYZHKL",
  "instructorId": 5,
  "startDate": "2026-09-01",
  "endDate": "2026-12-15",
  "studentCount": 0
}
```

---

### Update Class
Update an existing class.

- **URL**: `/api/Classes/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin or Instructor
- **URL Parameters**: `id` (integer) - Class ID

**Request Body**: Same as create class

**Success Response** (204 No Content)

---

### Delete Class
Delete a class.

- **URL**: `/api/Classes/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id` (integer) - Class ID

**Success Response** (204 No Content)

---

## Debug Endpoints

### List All Database Tables
Get database schema information for debugging.

- **URL**: `/api/Debug/debug/tables`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin
- **Description**: Returns database provider, available tables, and connection info (SQLite specific)

**Success Response** (200 OK):
```json
{
  "databaseProvider": "Microsoft.EntityFrameworkCore.SqlServer",
  "availableTables": [
    "AspNetRoles",
    "AspNetUsers",
    "Patients",
    "Nurses",
    "Classes",
    "Records"
  ],
  "connectionInfo": "Server=localhost;Database=***;...",
  "dbContextType": "NursingEducationalBackend.Models.NursingDbContext",
  "models": {
    "patientsDbSet": "Registered",
    "patientEntityType": "Patients"
  }
}
```

---

## Instructor Endpoints

### Get All Instructors
Retrieve list of all instructors.

- **URL**: `/api/Instructor`
- **Method**: `GET`
- **Auth Required**: No

**Success Response** (200 OK):
```json
[
  {
    "nurseId": 5,
    "fullName": "Jane Smith",
    "studentNumber": "W9876543",
    "email": "jane.smith@college.edu",
    "isInstructor": true,
    "isValid": true,
    "classId": null
  }
]
```

---

### Get Instructor by ID
Retrieve a specific instructor by ID.

- **URL**: `/api/Instructor/{id}`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `id` (integer) - Instructor ID

**Success Response** (200 OK): Returns instructor object

---

### Get Instructor by W-Number
Retrieve an instructor by their student number.

- **URL**: `/api/Instructor/wnumber/{wnumber}`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `wnumber` (string) - W-Number (e.g., "W1234567")

**Success Response** (200 OK): Returns instructor object  
**Error Response** (404 Not Found): Instructor not found

---

### Validate Instructor
Approve an instructor request.

- **URL**: `/api/Instructor/validate/{wnumber}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `wnumber` (string) - W-Number
- **Description**: Approves instructor request and assigns Instructor role

**Success Response** (200 OK):
```json
{
  "nurseId": 20,
  "fullName": "Jane Smith",
  "studentNumber": "W9876543",
  "email": "jane.smith@college.edu",
  "isInstructor": true,
  "isValid": true
}
```

---

### Invalidate Instructor
Revoke instructor status.

- **URL**: `/api/Instructor/invalidate/{wnumber}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `wnumber` (string) - W-Number

**Success Response** (200 OK): Empty response

---

## Nurse Endpoints

### Get Nurse's Assigned Patients
Get patients assigned to the authenticated nurse.

- **URL**: `/api/Nurse/nurse/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns patients assigned to the nurse or patients with no nurse assignment

**Success Response** (200 OK):
```json
[
  {
    "patientId": 1,
    "fullName": "John Patient",
    "patientWristId": "W-0001",
    "sex": "Male",
    "dob": "1945-03-15",
    "room": "101",
    "diagnosis": "CHF",
    "allergies": "Penicillin",
    "nurseId": 10
  }
]
```

---

### Get Unassigned Nurses
Get nurses not assigned to any class.

- **URL**: `/api/Nurse/unassigned`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200 OK):
```json
[
  {
    "nurseId": 15,
    "fullName": "John Doe",
    "studentNumber": "W1234567",
    "email": "john.doe@college.edu",
    "classId": null,
    "patientId": null,
    "patients": []
  }
]
```

---

### Update Nurse
Update nurse information.

- **URL**: `/api/Nurse/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: `id` (integer) - Nurse ID

**Request Body**:
```json
{
  "nurseId": 15,
  "fullName": "John Doe Jr.",
  "studentNumber": "W1234567",
  "email": "john.doe@college.edu",
  "classId": 5,
  "patientId": 1,
  "patients": []
}
```

**Success Response** (204 No Content)

---

## Patients Endpoints

### Get All Patients
Retrieve all patients in the system.

- **URL**: `/api/Patients`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response** (200 OK):
```json
[
  {
    "patientId": 1,
    "fullName": "John Patient",
    "patientWristId": "W-0001",
    "sex": "Male",
    "dob": "1945-03-15",
    "admissionDate": "2026-02-01",
    "room": "101",
    "diagnosis": "CHF",
    "allergies": "Penicillin",
    "isolationPrecautions": "None",
    "nurseId": 10
  }
]
```

---

### Get Patient by ID
Retrieve a specific patient.

- **URL**: `/api/Patients/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `id` (integer) - Patient ID

**Success Response** (200 OK): Returns patient object

---

### Create Patient
Create a new patient record.

- **URL**: `/api/Patients/create`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "fullName": "Jane Patient",
  "sex": "Female",
  "patientWristId": "W-0050",
  "nextOfKin": "John Patient (Husband)",
  "height": "5'6\"",
  "weight": 150,
  "dateOfBirth": "1950-08-20",
  "allergies": "None",
  "isolationPrecautions": "Standard",
  "diagnosis": "Diabetes Type 2",
  "admissionDate": "2026-02-18",
  "room": "205"
}
```

**Success Response** (200 OK): Empty response  
**Error Response** (400 Bad Request): "Unable to create patient"

---

### Get Admin Patient IDs
Get all patient IDs (Admin only).

- **URL**: `/api/Patients/admin/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin

**Success Response** (200 OK): Returns array of all patients

---

### Assign Nurse to Patient
Assign a nurse to a patient.

- **URL**: `/api/Patients/{id}/assign-nurse/{nurseId}`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**: 
  - `id` (integer) - Patient ID
  - `nurseId` (integer) - Nurse ID

**Success Response** (200 OK):
```json
{
  "nurseId": 10
}
```

---

### Submit Patient Assessment Data
Submit patient assessment data for a rotation.

- **URL**: `/api/Patients/{id}/submit-data`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**: `id` (integer) - Patient ID
- **Description**: Creates a record and submits multiple assessment types based on rotation requirements

**Request Body**:
```json
{
  "rotationId": 1,
  "assessmentData": {
    "patient-cognitive-1": {
      "speech": "Clear",
      "loc": "Alert x 4",
      "mmse": "28/30",
      "confusion": "None"
    },
    "patient-nutrition-1": {
      "diet": "Regular",
      "assit": "Independent",
      "intake": "100%",
      "time": "8:00 AM",
      "weight": 150
    },
    "patient-progressnote-1": {
      "note": "Patient resting comfortably",
      "timestamp": "2026-02-18T09:00:00"
    }
  }
}
```

**Valid Assessment Types**:
- `cognitive` - Cognitive assessment
- `nutrition` - Nutrition assessment
- `elimination` - Elimination assessment
- `mobilityandsafety` - Mobility and safety assessment
- `adl` - Activities of daily living
- `behaviour` - Behavior assessment
- `skin` - Skin and sensory aid assessment
- `progressnote` - Progress note
- `acuteprogress` - Acute progress
- `labsdiagnosticsblood` - Labs, diagnostics, and blood work
- `dischargechecklist` - Discharge checklist
- `consult` - Consult and current illness
- `news2` - NEWS2 score
- `profile` - Patient profile update

**Success Response** (200 OK):
```json
{
  "recordId": 50,
  "message": "Data submitted successfully."
}
```

---

### Get Assessment History Data
Retrieve specific assessment data by type and table ID.

- **URL**: `/api/Patients/history/assessment/{assessmentType}/{tableId}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `assessmentType` (integer) - Assessment type ID (1-13)
  - `tableId` (integer) - Record ID in the assessment table

**Assessment Type IDs**:
- 1 = ADL
- 2 = Behaviour
- 3 = Cognitive
- 4 = Elimination
- 5 = MobilityAndSafety
- 6 = Nutrition
- 7 = ProgressNote
- 8 = SkinAndSensoryAid
- 9 = AcuteProgress
- 10 = LabsDiagnosticsAndBlood
- 11 = DischargeChecklist
- 12 = ConsultCurrentIllness
- 13 = NEWS2

**Success Response** (200 OK): Returns the specific assessment record

---

### Get Patient History
Retrieve complete submission history for a patient.

- **URL**: `/api/Patients/{id}/history`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `id` (integer) - Patient ID

**Success Response** (200 OK):
```json
{
  "patientId": 1,
  "patientName": "John Patient",
  "history": [
    {
      "recordId": 50,
      "submittedDate": "2026-02-18T09:00:00",
      "nurseId": 10,
      "submittedNurse": "Jane Nurse",
      "patientId": 1,
      "patientName": "John Patient",
      "rotationId": 1,
      "rotationName": "Long-Term Care",
      "assessmentSubmissions": [
        {
          "submissionId": 100,
          "assessmentTypeId": 3,
          "assessmentTypeName": "Cognitive",
          "tableRecordId": 25
        }
      ]
    }
  ]
}
```

---

### Get Patient Labs
Retrieve lab, diagnostics, and blood work for a patient.

- **URL**: `/api/Patients/{id}/labs`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Patient ID

**Success Response** (200 OK):
```json
[
  {
    "labsDiagnosticsAndBloodId": 1,
    "patientId": 1,
    "type": "CBC",
    "value": "WBC 8.5, RBC 4.2, Hgb 13.5",
    "orderedDate": "2026-02-17",
    "completedDate": "2026-02-18"
  }
]
```

---

### Create/Update Patient Labs
Create or update lab records for a patient.

- **URL**: `/api/Patients/{id}/labs`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Patient ID

**Request Body**:
```json
{
  "rotationId": 1,
  "labs": [
    {
      "labsDiagnosticsAndBloodId": 0,
      "type": "Urinalysis",
      "value": "Clear, pH 6.5",
      "orderedDate": "2026-02-18",
      "completedDate": "2026-02-18"
    }
  ]
}
```

**Success Response** (200 OK):
```json
{
  "recordId": 51,
  "message": "Labs updated successfully."
}
```

---

### Get Discharge Checklist
Retrieve discharge checklist for a patient.

- **URL**: `/api/Patients/{id}/dischargechecklist`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Patient ID

**Success Response** (200 OK):
```json
{
  "patientId": 1,
  "targetDischargeDate": "2026-03-01",
  "highRiskDischarge": false,
  "createHomeChartInitiatedDate": "2026-02-15",
  "createHomeChartCompletedDate": "2026-02-16",
  "createHomeChartComments": "Completed",
  "createHomeChartNotApplicable": false
  // ... (many more checklist fields)
}
```

---

### Create/Update Discharge Checklist
Create or update discharge checklist for a patient.

- **URL**: `/api/Patients/{id}/dischargechecklist`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Patient ID

**Request Body**: Same structure as GET response, plus:
```json
{
  "rotationId": 1,
  // ... all checklist fields
}
```

**Success Response** (200 OK):
```json
{
  "recordId": 52,
  "message": "Discharge checklist updated successfully."
}
```

---

### Get Patient Consults
Retrieve consult records for a patient.

- **URL**: `/api/Patients/{id}/consults`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Patient ID

**Success Response** (200 OK):
```json
[
  {
    "consultId": 1,
    "patientId": 1,
    "consultType": "Cardiology",
    "consultName": "Dr. Smith",
    "dateSent": "2026-02-15",
    "dateReplied": "2026-02-16"
  }
]
```

---

### Create/Update Patient Consults
Create or update consult records and current illness.

- **URL**: `/api/Patients/{id}/consults`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Patient ID

**Request Body**:
```json
{
  "rotationId": 1,
  "currentIllness": "Acute exacerbation of CHF",
  "consults": [
    {
      "consultId": 0,
      "consultType": "Cardiology",
      "consultName": "Dr. Johnson",
      "dateSent": "2026-02-18",
      "dateReplied": null
    }
  ]
}
```

**Success Response** (200 OK):
```json
{
  "recordId": 53,
  "message": "Consults updated successfully."
}
```

---

## Records Endpoints

### Get Records
Retrieve records with optional filtering.

- **URL**: `/api/Records`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **Query Parameters** (optional):
  - `date` (DateOnly) - Filter by submission date
  - `classId` (integer) - Filter by class

**Example Request**:
```bash
curl -X GET "http://localhost:5232/api/Records?date=2026-02-18&classId=5" \
  -H "Authorization: Bearer {token}"
```

**Success Response** (200 OK):
```json
[
  {
    "recordId": 50,
    "submittedDate": "2026-02-18T09:00:00",
    "nurseId": 10,
    "submittedNurse": "Jane Nurse",
    "patientId": 1,
    "patientName": "John Patient",
    "rotationId": 1,
    "rotationName": "Long-Term Care",
    "assessmentSubmissions": [
      {
        "submissionId": 100,
        "assessmentTypeId": 3,
        "assessmentTypeName": "Cognitive",
        "tableRecordId": 25
      }
    ]
  }
]
```

---

## Rotations Endpoints

### Get All Rotations
Retrieve all clinical rotations and their required assessments.

- **URL**: `/api/Rotations`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse

**Success Response** (200 OK):
```json
[
  {
    "rotationId": 1,
    "name": "Long-Term Care",
    "assessmentNames": [
      "Cognitive",
      "Nutrition",
      "Elimination",
      "Mobility and Safety",
      "ADL"
    ]
  }
]
```

---

### Get Rotation by ID
Retrieve a specific rotation.

- **URL**: `/api/Rotations/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Rotation ID

**Success Response** (200 OK): Returns rotation object

---

### Create Rotation
Create a new rotation.

- **URL**: `/api/Rotations`
- **Method**: `POST`
- **Auth Required**: Yes
- **Required Role**: Admin

**Request Body**:
```json
{
  "name": "Acute Care"
}
```

**Success Response** (201 Created):
```json
{
  "rotationId": 3,
  "name": "Acute Care"
}
```

---

### Update Rotation
Update an existing rotation or create if doesn't exist.

- **URL**: `/api/Rotations/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id` (integer) - Rotation ID

**Request Body**:
```json
{
  "name": "Acute Care - Updated"
}
```

**Success Response** (200 OK): Returns updated rotation  
**Success Response** (201 Created): Returns created rotation

---

### Delete Rotation
Delete a rotation.

- **URL**: `/api/Rotations/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Required Role**: Admin
- **URL Parameters**: `id` (integer) - Rotation ID

**Success Response** (200 OK): Empty response

---

### Get Assessments for Rotation
Get all assessment types required for a rotation.

- **URL**: `/api/Rotations/{id}/assessments`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Role**: Admin, Instructor, or Nurse
- **URL Parameters**: `id` (integer) - Rotation ID

**Success Response** (200 OK):
```json
[
  {
    "assessmentTypeId": 3,
    "name": "Cognitive",
    "routeKey": "Cognitive"
  },
  {
    "assessmentTypeId": 6,
    "name": "Nutrition",
    "routeKey": "Nutrition"
  }
]
```

---

## Common Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred",
  "error": "Detailed error message"
}
```

---

## Notes

1. **Authentication**: All endpoints except auth endpoints require Microsoft Entra ID JWT token
2. **Authorization**: Role-based access control enforced at endpoint level
3. **CORS**: Configured via `AllowedOrigins` environment variable (default: `http://localhost:5173`)
4. **Database**: Uses SQL Server with Entity Framework Core
5. **Migrations**: Automatically run on application startup
6. **Sensitive Data**: Connection strings and credentials should be stored in `appsettings.Development.json` (local) or Azure App Settings (production)

---

## Assessment Type Reference

| ID | Name | RouteKey |
|----|------|----------|
| 1 | ADL | ADL |
| 2 | Behaviour | Behaviour |
| 3 | Cognitive | Cognitive |
| 4 | Elimination | Elimination |
| 5 | Mobility and Safety | MobilityAndSafety |
| 6 | Nutrition | Nutrition |
| 7 | Progress Note | ProgressNote |
| 8 | Skin and Sensory Aid | SkinSensoryAid |
| 9 | Acute Progress | AcuteProgress |
| 10 | Labs, Diagnostics, and Blood | LabsDiagnosticsBlood |
| 11 | Discharge Checklist | DischargeChecklist |
| 12 | Consult/Current Illness | Consult |
| 13 | NEWS2 | NEWS2 |
