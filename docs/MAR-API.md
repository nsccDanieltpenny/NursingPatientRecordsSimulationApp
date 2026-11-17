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

Roles: Admin, Instructor. November 5: Scheduled orders only.

```json
{
  "drugId": 7,
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

Returns `201` with the order (same shape as an entry in `orders`, without `slots`).
`400` if: `drugId` does not exist, `dose` is not above 0, `dueTimes` is empty or not `HH:MM`, `doseUnit` or `route` is missing.
`dueTimes` is stored as text, for example `"08:00,20:00"`.

## 4. `POST /api/patients/{id}/medication-orders/{orderId}/administrations`

Roles: Nurse, Instructor. Charts one dose against one slot.

Given:

```json
{
  "dueAt": "2026-11-05T12:00:00Z",
  "status": "Given",
  "doseGiven": 25,
  "givenAt": "2026-11-05T12:06:00Z",
  "notGivenReason": null,
  "comment": "HR 72, BP 118/76.",
  "rotationId": 3
}
```

Not given: `"status": "NotGiven"`, `"doseGiven": null` and a `notGivenReason`.

Returns `201` with the dose (same shape as `slots[].dose`).
`400` (blocks) if:

- `NotGiven` has no `notGivenReason`
- `givenAt` is later than now
- that `dueAt` is already charted on this order (also a unique index on `(MedicationOrderId, DueAt)`)
- `dueAt` is not one of the order's due times

`notGivenReason` options: `Patient refused`, `Held: vital signs outside order parameters`, `NPO`, `Medication unavailable`, `Patient off unit`, `Other`.

Warnings (dose differs from the order, PRN too soon) come in the November 19 iteration and do not change these fields.

## Frontend: using the sample before the backend is ready

`getMar(patientId, date)` in `frontend/src/utils/api.js` returns the sample when `VITE_USE_MOCK_MAR=true` is set in your own `frontend/.env` (restart `npm run dev` after changing it). Remove the line, or set it to `false`, to use the real route.
