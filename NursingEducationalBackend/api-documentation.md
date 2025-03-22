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
- **Success Response**:
  ```json
  {
    "success": true,
    "token": "[JWT TOKEN]",
    "nurseId": 1,
    "fullName": "User Name",
    "email": "user@example.com",
    "roles": []
  }
  ```

### Logout
- **URL**: `/api/Auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## Patient Endpoints

### Admin Endpoints

#### Get All Patient IDs (Admin)
- **URL**: `/api/Patients/admin/ids`
- **Method**: `GET`
- **Auth Required**: Yes (Admin Role)
- **Success Response**: 
  ```json
  [1, 2, 3]
  ```

#### Get Patient with Cognitive Data (Admin)
- **URL**: `/api/Patients/admin/patient/{id}/cognitive`
- **Method**: `GET`
- **Auth Required**: Yes (Admin Role)
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Success Response**:
  ```json
  {
    "patient": {
      "patientId": 1,
      "patientWristId": "W-0001",
      "fullName": "Patient Name",
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

### Nurse Endpoints

#### Get Assigned Patient IDs (Nurse)
- **URL**: `/api/Patients/nurse/ids`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: 
  ```json
  [1, 3]
  ```

#### Get Patient with Cognitive Data (Nurse)
- **URL**: `/api/Patients/nurse/patient/{id}/cognitive`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `id=[integer]` where `id` is the PatientId
- **Notes**: Only patients assigned to the nurse or with null NurseId can be accessed
- **Success Response**: Same as admin endpoint

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Invalid token or missing NurseId claim"
}
```

### 403 Forbidden
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.4",
  "title": "Forbidden",
  "status": 403
}
```

### 404 Not Found
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  "title": "Not Found",
  "status": 404
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer [your_token]
```

## Roles

- **Admin**: Can access all patients and all endpoints
- **Nurse**: Can only access assigned patients or patients with null NurseId
