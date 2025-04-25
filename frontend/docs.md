# CARE Frontend Docs

## Contents
  - [Components](#components)
      - [Assessments Card](#assessments-card)
      - [Medical Info Card](#medical-info-card)
      - [Patient Info Card](#patient-info-card)
      - [Assessment Sidebar](#assessment-sidebar)
      - [Nav](#nav)
      - [Navigation Buttons](#navigation-buttons)
      - [Patient Card](#patient-card)
      - [Shift Selection](#shift-selection)
      - [Spinner / Lazy Loading](#spinner-lazyloading)
  - [Routes](#routes)
      - [Home](#home)
      - [Login](#login)
      - [Logout](#logout)
      - [Register](#register)
      - [Assessment Pages](#assessment-pages)
      - [Create Patient](#create-patient)
      - [Patients](#patients)

## Components

### Assessments Card
---
The `AssessmentsCard` component provides a navigable list of patient assessments. Each assessment is displayed with an icon and a label. Clicking on an item navigates to the corresponding assessment page.

#### Props
- **None**: The component uses `useParams` to retrieve the patient ID and `assessmentRoutes` for route configuration.

#### Behavior
1. **Assessment Mapping**:
   - The component defines a list of assessments, each with a display name and a route key. These are used to render the list and determine navigation routes.


### Medical Info Card
---
The `MedicalInfoCard` component is used to display a patient's medical information. It retrieves and stores patient data in `localStorage` for persistence.

#### Props
- **`patientData`** (object): The patient data object containing medical information. 
  - `id` (string or number): Unique identifier for the patient.
  - `admissionDate` (string): The date the patient was admitted.
  - `roamAlertBracelet` (boolean): Indicates if the patient has a roam alert bracelet.
  - `allergies` (string): Known allergies of the patient.
  - `isolationPrecautions` (string): Isolation precautions required for the patient.
  - `medicalHistory` (string): The patient's medical history.

#### Behavior
1. **Data Loading**: 
   - On component mount, if `patientData.id` is provided, the component attempts to load saved medical information from `localStorage` using the key `medicalInfo-{id}`.
   - If data is found, it updates the `medicalInfo` state.

2. **Data Persistence**:
   - When the `medicalInfo` state changes and contains a valid `id`, the updated data is saved to `localStorage` using the same key.

#### Example Usage
```jsx
import MedicalInfoCard from './profile-components/MedicalInfoCard';

<MedicalInfoCard patientData={patient} />;
```

### Patient Info Card
---
The `PatientInfoCard` component displays and allows editing of a patient's personal information, with changes saved to `localStorage`.

#### Props
- **`patientData`** (object): The initial patient data object. Expected fields include:
  - `fullName` (string): The patient's full name.
  - `dob` (string): Date of birth.
  - `sex` (string): Gender.
  - `maritalStatus` (string): Marital status.
  - `height` (number): Height in centimeters.
  - `weight` (number): Weight in kilograms.
  - `nextOfKin` (string): Name of the next of kin.
  - `nextOfKinPhone` (string): Contact phone number of the next of kin.
  - `imageFilename` (string): Filename of the patient's photo.

- **`onPatientUpdate`** (function): Callback function triggered when patient data is updated.

#### Behavior
1. **Data Loading**:
   - On component mount, the patient's profile data is loaded from `localStorage` using the key `patient-profile-{id}` (where `id` is the patient ID from the URL).

2. **Editable Fields**:
   - Each field is editable using the `EditableField` subcomponent, which toggles between display and edit modes.
   - Changes are saved locally in the component state and can be persisted to `localStorage` by clicking the "Save Changes" button.

3. **Save Changes**:
   - The "Save Changes" button is enabled only when there are unsaved changes.
   - Saves the updated data to `localStorage` and provides feedback to the user.

#### Example Usage
```jsx
<PatientInfoCard patientData={patient} onPatientUpdate={(updatedData) => console.log(updatedData)} />;
```


### Assessment Sidebar
---
The `AssessmentSidebar` component provides a navigable sidebar for assessment pages.

#### Props
- **None**: The component uses `useParams` to retrieve the patient ID and `useLocation` to determine the current route.

#### Behavior
1. **Assessment Mapping**:
   - The component defines a list of assessments and maps each to a specific URL based on the patient ID retrieved from the route parameters.

2. **Active State**:
   - The sidebar highlights the currently active assessment based on the current route.


### Nav
---
The `Nav` component provides top navigation for the application.

#### Props
- **None**: The component relies on the `useUser` hook from the `UserContext` to access the current user's information and the `logout` function.

#### Behavior
1. **Authentication**:
   - Displays navigation links only for authenticated users



### Navigation Buttons
---
The `NavigationButtons` component provides "Back" and "Next" buttons for navigating between pages.

#### Props
- **`prevPage`** (string): The route to navigate to when the "Back" button is clicked. If not provided, the "Back" button is disabled.
- **`nextPage`** (string): The route to navigate to when the "Next" button is clicked. If not provided, the "Next" button is disabled.

#### Behavior
1. **Buttons**:
   - Navigates to the `prevPage` or `nextPage` route when clicked.
   - Disabled if page is not provided.

#### Example Usage
```jsx
<NavigationButtons prevPage="/previous-page" nextPage="/next-page" />;
```

### Patient Card
---
The `PatientCard` component renders a card displaying the bed number and name of a patient, with onClick functionality.

#### Props
- **`bedNumber`** (string or number): The bed number assigned to the patient.
- **`name`** (string): The name of the patient.
- **`onClick`** (function): A callback function triggered when the card is clicked.

#### Example Usage
```jsx
<PatientCard 
  bedNumber="12" 
  name="John Doe" 
  onClick={() => console.log('Patient card clicked')} 
/>;
```

### Shift Selection
---
The `ShiftSelection` component provides a modal interface for selecting a work shift. It allows users to choose between "Morning," "Afternoon," and "Evening" shifts, with the selected shift being saved in `sessionStorage`.

#### Props
- **`onSelectShift`** (function): A callback function triggered when a shift is selected. The selected shift is passed as an argument to this function.

#### Behavior
1. **Shift Selection**:
   - When a shift button is clicked, the selected shift is saved in `sessionStorage` under the key `selectedShift`.
   - The `onSelectShift` callback is invoked with the selected shift.

#### Example Usage
```jsx
import ShiftSelection from './ShiftSelection';

const handleShiftSelect = (shift) => {
  console.log('Selected Shift:', shift);
};

<ShiftSelection onSelectShift={handleShiftSelect} />;
```

### Spinner (LazyLoading)
---
The `Spinner` component, also referred to as `LazyLoading`, provides a full-screen loading indicator with a customizable message.

#### Props
- **`text`** (string, optional): A custom message to display below the spinner. Defaults to `"Loading..."` if not provided.


## Routes


### Home
---
The `Home` route serves as the main landing page for the CARE App. It displays a grid of `PatientCard` components, representing patients in a visually organized layout.

#### Props
- **None**: The component does not accept any props but relies on the `PatientCard` component for rendering individual patient cards.


### Login
---
The `Login` route provides a user authentication interface, allowing users to log in to the application. It validates user credentials and redirects authenticated users to the home page.

#### Props
- **None**: The component relies on the `useUser` hook to manage user authentication and state.

#### Behavior
1. **Form Submission**:
   - Collects user credentials (`email` and `password`) and sends a POST request to the backend API.
   - On successful login:
     - Calls the `login` function from the `UserContext` to update the user state.
     - Redirects the user to the home page (`/`).
   - On failure:
     - Displays an error message for invalid credentials.
     - Redirects to the registration page if the user is not found.

2. **Loading State**:
   - Displays a `Spinner` component while the login process is in progress.

3. **Redirect for Authenticated Users**:
   - If the user is already logged in, redirects to the home page (`/`)..


### Register
---
The `Register` route provides a student registration interface, allowing authorized users (e.g., faculty) to add nurses (students) to a class list. It collects user details and submits them to the backend API for account creation.

#### Behavior
1. **Form Submission**:
   - Collects user details (`Full Name`, `Email`, `Password`, `Confirm Password`, `Student Number`) and sends a POST request to the backend API.
   - On successful registration:
     - Displays a success message.
     - Redirects the user to the login page (`/login`).
   - On failure:
     - Displays an error message for invalid input or server errors.

2. **Validation**:
   - Ensures required fields are filled.
   - Validates that passwords are at least 6 characters long and match the confirmation field.

#### Props
- **None**: The component does not accept any props but uses `react-hook-form` for form handling and validation.


### Logout
---
The `Logout` route provides a confirmation interface for logging out of the application. It allows users to confirm their intent to log out and triggers the logout process.

#### Props
- **None**: The component relies on the `useUser` hook to access the current user's information and the `logout` function.

#### Behavior
1. **Logout Process**:
   - Calls the `logout` function to clear the user's session and authentication state.
   - Redirects the user to the login page or another appropriate route after logging out.


### Assessment Pages
---
The assessment pages provide interfaces for managing various aspects of a patient's care. Each page allows users to view, edit, and save specific assessment data for a patient. All pages include a sidebar for navigation between assessments and buttons for saving data or returning to the patient's profile.

#### Common Features
1. **Data Loading**:
   - On component mount, attempts to load data from `localStorage` using a unique key (`patient-{assessment}-{id}`).
   - If no data is found, fetches the data from the backend API.

2. **Data Saving**:
   - Saves the assessment data to `localStorage` when the "Save" button is clicked.
   - Displays a success message upon successful save or an error message if saving fails.

3. **Navigation**:
   - Includes a "Go Back to Profile" button to navigate back to the patient's profile page.
   - Uses the `AssessmentSidebar` component for navigating between assessment pages.

#### Pages
1. **Activities of Daily Living (ADL)**:
   - Tracks data such as bath date, bathing method, type of care, turning schedule, and teeth care.
   - Includes yes/no questions for specific ADL-related tasks (e.g., foot care, hair care).

2. **Behaviour**:
   - Provides a text area for entering detailed behaviour notes.

3. **Cognitive**:
   - Tracks data such as confusion levels, speech, LOC (Level of Consciousness), and MMSE (Mini-Mental State Examination).

4. **Elimination**:
   - Tracks data such as bladder and bowel incontinence, catheter insertion, and routines for bowel and bladder care.

5. **Mobility**:
   - Tracks data such as transfer methods, mobility aids, and bed mobility.

6. **Nutrition**:
   - Tracks dietary preferences, intake, dietary supplements, weight, and IV solution details.

7. **Progress Notes**:
   - Provides a text area for entering detailed progress notes and a field for the date of the note.

8. **Safety**:
   - Tracks safety measures such as hip protectors, side rails, crash mats, and bed alarms.
   - Includes a fall risk scale (Low, Medium, High).

9. **Sensory Aids & Skin Integrity**:
   - Tracks sensory aids (e.g., glasses, hearing aids) and skin integrity data such as pressure ulcer risk, Braden scale, turning schedule, and dressings.


### Create Patient
---
The `CreatePatient` route provides a form interface for creating a new patient. Submits form data to the backend API.

#### Props
- **None**: The component relies on the `useUser` hook to access the current user's token for API authentication.

#### Behavior
1. **Form Validation**:
   - Required field validation
   - Displays validation feedback for invalid fields.

2. **Form Submission**:
   - Sends a POST request to the backend API with the form data.
   - On successful submission, displays a success message and navigates back to the patient list.
   - On failure, displays an error message.


### Patients
---
The `Patients` route displays a list of patients in a grid layout, allowing users to view patient details by clicking on individual patient cards.

#### Props
- **None**: The component does not accept any props but relies on the `useUser` hook for authentication and state management.

#### Behavior
1. **Data Loading**:
   - Fetches patient data from the backend API on component mount.
   - Displays a `Spinner` component while data is being loaded.

2. **Shift Selection**:
   - Requires users to select a shift (Morning, Afternoon, or Evening) before accessing patient details.
   - The selected shift is stored in `sessionStorage` and validated before allowing access to patient records.

3. **Patient Card Interaction**:
   - Clicking on a `PatientCard` navigates to the patient's details page.
   - Alerts the user if no shift is selected.

4. **Authentication**:
   - Redirects unauthenticated users to the login page (`/login`).









