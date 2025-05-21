# PatientCreate API Documentation

## Overview

The PatientCreate API endpoint allows for the creation of a new patient record along with all associated medical information in a single request. This endpoint follows RESTful principles and stores patient data in the nursing educational system database.

## Endpoint Details

- **URL**: `/api/PatientCreate`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Bearer Token)
- **Permissions Required**: Admin role

## Request Headers

| Header          | Value                        | Description                           |
|-----------------|------------------------------|---------------------------------------|
| Content-Type    | application/json             | Format of the request body            |
| Authorization   | Bearer {jwt_token}           | JWT token for authentication          |

## Request Body

The request body is a JSON object containing patient information and all associated medical data.

```json
{
  "patient": {
    // Patient information
  },
  "behaviourReport": "String description of behaviour",
  "adl": {
    // Activities of Daily Living details
  },
  "cognitive": {
    // Cognitive assessment details
  },
  "elimination": {
    // Elimination details
  },
  "mobility": {
    // Mobility details
  },
  "nutrition": {
    // Nutrition details
  },
  "progressNote": {
    // Progress notes details
  },
  "safety": {
    // Safety details
  },
  "skinAndSensoryAid": {
    // Skin and sensory aid details
  }
}
```

### Patient Object

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

### Behaviour Report

A string describing the patient's behavior and mental state.

### ADL (Activities of Daily Living) Object

| Field            | Type     | Required | Description                            |
|------------------|----------|----------|----------------------------------------|
| bathDate         | string   | Yes      | Date of bath (YYYY-MM-DD)              |
| tubShowerOther   | string   | Yes      | Type of bathing used                   |
| typeOfCare       | string   | Yes      | Level of care required                 |
| turningSchedule  | string   | Yes      | Schedule for turning patient           |
| teeth            | string   | Yes      | Dental care details                    |
| footCare         | string   | Yes      | Foot care details                      |
| hairCare         | string   | Yes      | Hair care details                      |

### Cognitive Object

| Field            | Type     | Required | Description                            |
|------------------|----------|----------|----------------------------------------|
| speech           | string   | Yes      | Speech capabilities and issues         |
| loc              | string   | No       | Level of consciousness                 |
| mmse             | string   | No       | Mini-Mental State Examination results  |
| confusion        | string   | No       | Notes on confusion or disorientation   |

### Elimination Object

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

### Mobility Object

| Field            | Type     | Required | Description                            |
|------------------|----------|----------|----------------------------------------|
| transfer         | string   | Yes      | Patient transfer details               |
| aids             | string   | Yes      | Mobility aids used                     |
| bedMobility      | string   | Yes      | Bed mobility details                   |

### Nutrition Object

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

### Progress Note Object

| Field            | Type     | Required | Description                            |
|------------------|----------|----------|----------------------------------------|
| timestamp        | string   | No       | Time of note (YYYY-MM-DDThh:mm:ss)     |
| note             | string   | Yes      | Detailed progress note                 |

### Safety Object

| Field            | Type     | Required | Description                            |
|------------------|----------|----------|----------------------------------------|
| hipProtectors    | string   | Yes      | Hip protectors usage                   |
| sideRails        | string   | Yes      | Side rails usage                       |
| fallRiskScale    | string   | Yes      | Fall risk assessment                   |
| crashMats        | string   | Yes      | Crash mats usage                       |
| bedAlarm         | string   | Yes      | Bed alarm usage                        |

### Skin and Sensory Aid Object

| Field                           | Type     | Required | Description                            |
|---------------------------------|----------|----------|----------------------------------------|
| glasses                         | string   | Yes      | Vision aid details                     |
| hearing                         | string   | Yes      | Hearing aid details                    |
| skinIntegrityPressureUlcerRisk  | string   | Yes      | Pressure ulcer risk assessment         |
| skinIntegrityTurningSchedule    | string   | Yes      | Turning schedule for skin integrity    |
| skinIntegrityBradenScale        | string   | Yes      | Braden scale assessment for skin risk  |
| skinIntegrityDressings          | string   | Yes      | Skin dressings details                 |

## Response

### Success Response

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
    "report": "Patient is cooperative and alert. Oriented to person, place, and time. Follows instructions well and communicates needs clearly. Occasionally anxious about blood glucose tests."
  },
  "adl": {
    "adlsId": 2,
    "bathDate": "2025-03-24",
    "tubShowerOther": "Shower with assistance",
    "typeOfCare": "Partial assistance",
    "turningSchedule": "Every 2 hours during day, every 3 hours at night",
    "teeth": "Independent with supervision",
    "footCare": "Requires assistance for nail care, daily inspection for diabetic complications",
    "hairCare": "Independent with grooming, assistance with washing"
  },
  "cognitive": {
    "cognitiveId": 1,
    "speech": "Clear and coherent",
    "loc": "Alert and oriented x4 (person, place, time, situation)",
    "mmse": "28/30 - Mild cognitive impairment",
    "confusion": "No signs of confusion"
  },
  "elimination": {
    "eliminationId": 1,
    "incontinentOfBladder": "No",
    "incontinentOfBowel": "No",
    "dayOrNightProduct": "None required",
    "lastBowelMovement": "2025-03-23",
    "bowelRoutine": "Regular, once daily in morning",
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
    "note": "Patient reports feeling well this morning. Vitals stable: BP 130/80, HR 72, RR 18, Temp 98.6F. Blood glucose 142 before breakfast. Medication administered as ordered. Patient ambulated in hallway with walker for 10 minutes with minimal assistance. Plan to continue monitoring blood glucose and encourage fluid intake."
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
    "skinIntegrityPressureUlcerRisk": "Low risk - No pressure ulcers present",
    "skinIntegrityTurningSchedule": "Every 2 hours during day, every 3 hours at night",
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

### Error Responses

- **Code**: 400 Bad Request
  - **Content**: `{ "error": "Missing required patient information" }` or other validation error
- **Code**: 401 Unauthorized
  - **Content**: `{ "error": "Authentication failed" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "error": "Insufficient permissions" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Internal server error: [error details]" }`

## Example Usage

### cURL Example

```bash
curl -X POST "http://10.211.55.7:5232/api/PatientCreate" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AbnVyc2luZy5lZHUiLCJqdGkiOiIzNDljOTIzZi1jNDA1LTRhZTgtODU0Mi0xMDAzZTk1NDJkNjAiLCJOdXJzZUl