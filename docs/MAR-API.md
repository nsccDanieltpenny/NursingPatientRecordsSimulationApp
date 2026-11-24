# MAR API (Iteration: November 5)

Draft contract for the Medication Administration Record routes needed for the November 5 iteration.
Field names follow the MAR ERD. Owner: backend (Ryle, Shelby). Change this file when the contract changes.

## Conventions

- JSON is camelCase.
- Every route needs sign-in (same MSAL token as the rest of the API).
- Timestamps are UTC, ISO 8601 with `Z` (for example `2026-11-05T12:00:00Z`). The frontend shows them in Atlantic time, 24-hour `HH:MM`.
- `dueTime` (for example `"08:00"`) is the Atlantic clock time the instructor entered.
- Dates (`date`) are Atlantic dates, `YYYY-MM-DD`.
- Validation errors return `400` with `{ "errors": ["message", ...] }`. Missing or other-campus patients return `404`; wrong role returns `403`.

## 1. `GET /api/patients/{id}/mar?date=YYYY-MM-DD`

Roles: all. Default `date`: today (Atlantic).

Returns every active order on that day, with one slot per due time. A slot has a `dose` once it is charted, otherwise `dose: null`.
Sample response: `frontend/src/mock/mar-sample.json`.

Status rules for the shift schedule:

| Condition | Pill |
|---|---|
| `dose.status` is `Given` | Given @ `givenAt` (green) |
| `dose.status` is `NotGiven` | Not given @ `givenAt` (grey) |
| `dose` is null and `dueAt` is before now | Overdue @ `dueTime` (red) |
| otherwise | Due @ `dueTime` (amber) |

### PRN orders and patient response (Nov 26 iteration)

Every order now has the same fields, so the frontend doesn't need to check if a field exists:

- `orderType`: `"Scheduled"` or `"PRN"`.
- `prnReasons`: what the PRN can be given for (for example `["Pain", "Fever"]`). Empty for scheduled orders.
- `minIntervalMinutes`: the shortest time allowed between PRN doses (240 for q4h). Null for scheduled orders.
- `dose` / `doseMax`: if `doseMax` is set, the order is a range (for example 4 to 8 mg).
- `slots`: scheduled doses only. Always `[]` for PRN orders.
- `prnDoses`: every PRN dose charted that day, oldest first. Always `[]` for scheduled orders.
- `lastGivenAt` / `nextAllowedAt`: worked out by the backend for PRN orders from the last `Given` dose plus `minIntervalMinutes`. Null if no dose yet, and always null for scheduled orders. Use `nextAllowedAt` for the "too soon" warning.

Every dose (in `slots[].dose` and `prnDoses[]`) now also has:

- `prnReason`: which of the order's `prnReasons` it was given for. Null for scheduled doses.
- `warningsOverridden`: the warnings the student saw and charted anyway (for example `["PRN too soon"]`). `[]` if none.
- `response`: the patient's response to the med, or null if not recorded yet:

```json
{
  "effective": "Effective",
  "painScore": 2,
  "comment": "Resting comfortably.",
  "respondedAt": "2026-11-05T14:30:00Z",
  "respondedBy": { "nurseId": 5, "fullName": "Oakes, Shelby" }
}
```

`effective` is `Effective`, `PartiallyEffective` or `NotEffective`. `painScore` (0 to 10) is optional. These map to the `Response*` columns on `MedicationAdministration`.

## 2. `GET /api/drugs?search=tyl`

Roles: all. Matches generic name or any brand name, up to 10 results.

```json
[
  { "drugId": 1, "genericName": "acetaminophen", "brandNames": ["Tylenol"], "matchedBrand": "Tylenol" }
]
```

`matchedBrand` is null when the generic name matched.

## 3. `POST /api/patients/{id}/medication-orders`

Roles: Admin, Instructor. Scheduled or PRN.

Scheduled:

```json
{
  "drugId": 10,
  "orderType": "Scheduled",
  "dose": 25,
  "doseMax": null,
  "doseUnit": "mg",
  "form": "Tablet",
  "route": "PO",
  "frequency": "BID",
  "dueTimes": ["08:00", "20:00"],
  "instructorNote": "Hold if HR under 55 or SBP under 100.",
  "startAt": "2026-11-05T12:00:00Z"
}
```

PRN (no `dueTimes`):

```json
{
  "drugId": 1,
  "orderType": "PRN",
  "dose": 650,
  "doseMax": null,
  "doseUnit": "mg",
  "form": "Tablet",
  "route": "PO",
  "frequency": "q4h PRN",
  "prnReasons": ["Pain", "Fever"],
  "minIntervalMinutes": 240,
  "maxDosesPer24Hours": 4,
  "instructorNote": "Max 4 g in 24 hours from all sources.",
  "startAt": "2026-11-05T12:00:00Z"
}
```

Returns `201` with the order (same shape as an entry in `orders`, with empty `slots` and `prnDoses`).

`400` with every problem in `errors` if:

- `drugId` does not exist
- `dose` is not above 0, or `doseMax` is set and not above `dose`
- `doseUnit`, `form`, `route`, `frequency` or `startAt` is missing
- `orderType` is not `Scheduled` or `PRN`
- Scheduled: `dueTimes` is empty or a time is not 24-hour `HH:MM`, or `prnReasons` is set
- PRN: `dueTimes` is set, `prnReasons` is empty or has a comma, `minIntervalMinutes` is not above 0, or `maxDosesPer24Hours` is below 1

`dueTimes` and `prnReasons` are stored as comma-separated text, for example `"08:00,20:00"`.

## 4. `POST /api/patients/{id}/medication-orders/{orderId}/administrations`

Roles: Admin, Instructor, Nurse. Charts one dose.

Scheduled, Given (`dueAt` says which slot):

```json
{
  "dueAt": "2026-11-05T12:00:00Z",
  "status": "Given",
  "doseGiven": 25,
  "givenAt": "2026-11-05T12:06:00Z",
  "notGivenReason": null,
  "comment": "HR 72, BP 118/76.",
  "rotationId": 3,
  "warningsOverridden": []
}
```

Scheduled, not given: `"status": "NotGiven"`, `"doseGiven": null` and a `notGivenReason`.

PRN (no `dueAt`, always `Given`):

```json
{
  "status": "Given",
  "doseGiven": 650,
  "givenAt": "2026-11-05T13:30:00Z",
  "prnReason": "Pain",
  "comment": "Pain 6/10 in lower back.",
  "rotationId": 3,
  "warningsOverridden": []
}
```

Returns `201` with the dose (same shape as `slots[].dose` / `prnDoses[]`).

### Blocks: `400` with every problem in `errors`

These are mistakes the student can't chart past.

- `status` is not `Given` or `NotGiven`
- `rotationId` does not exist
- `givenAt` is missing, in the future, before the order started, or after it was discontinued
- `Given` without a `doseGiven` above 0, or `NotGiven` without a `notGivenReason`
- Scheduled: `dueAt` is missing or not one of the order's due times, the slot is already charted (double charting), or `prnReason` is set
- PRN: `dueAt` is set, `status` is not `Given`, `prnReason` is missing or not one of the order's `prnReasons`, or the dose would go over `maxDosesPer24Hours` (counts Given doses in the 24 hours before `givenAt`)

`notGivenReason` options: `Patient refused`, `Held: vital signs outside order parameters`, `NPO`, `Medication unavailable`, `Patient off unit`, `Other`.

### Warnings: `409` with `warnings`

These might be on purpose, so the student can confirm and chart anyway.

| Warning | When |
|---|---|
| `Dose differs from order` | `doseGiven` is outside `dose` to `doseMax` (or not equal to `dose` when there's no range) |
| `Given outside the 1 hour window` | Scheduled: `givenAt` is more than 60 minutes before or after `dueAt` |
| `PRN too soon` | PRN: another Given dose is less than `minIntervalMinutes` away |

```json
{ "warnings": ["PRN too soon"] }
```

To chart anyway, show the warnings to the student, then send the same request again with them in `warningsOverridden`. They are saved on the dose, so instructors can see what was overridden.

## Frontend: using the sample before the backend is ready

`getMar(patientId, date)` in `frontend/src/utils/api.js` returns the sample when `VITE_USE_MOCK_MAR=true` is set in your own `frontend/.env` (restart `npm run dev` after changing it). Remove the line, or set it to `false`, to use the real route.


## 5. `PUT /api/patients/{id}/medication-orders/{orderId}/administrations/{administrationId}/response`

Roles: Nurse, Instructor, Admin. Records (or updates) the patient's response to a Given dose.

```json
{
  "effective": "PartiallyEffective",
  "painScore": 4,
  "comment": "Pain down from 7 to 4.",
  "respondedAt": "2026-11-05T14:30:00Z"
}
```

- `effective` (required): `Effective`, `PartiallyEffective` or `NotEffective`.
- `painScore` (optional): 0 to 10.
- `respondedAt` (optional): defaults to now.
- Who recorded it comes from the sign-in, not the body.

Returns `200` with the dose (same shape as `slots[].dose` / `prnDoses[]`), now with `response` filled in. Saving again updates the response.

`400` if: the dose isn't `Given`, `effective` is missing or not one of the three values, `painScore` isn't 0 to 10, or `respondedAt` is in the future or before `givenAt`.
`404` if the patient, order or dose doesn't exist (or isn't on your campus).

`GET` on the same URL returns just the `response` object, or `404` if none is recorded yet.