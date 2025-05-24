
![care logo](/frontend/src/img/logo-whitebg.png "Care: Clinical Assessment Record Entry")<br><br>
# Getting Started 

This document serves as an **overview** of the frontend for ***CARE***. Please read the following document carefully to get a clear idea of what is going on. This project was written in JavaScript w/ React framework. For a comprehensive API guide, please have a look at our [API Breakdown](/NursingEducationalBackend/api-documentation.md). 

**NOTE:** For a step-by-step breakdown of each component, please see [Components](/docs/Components.md). 

# Installation

## Prerequisites
- Ensure you have the following installed:
  - [Node.js](https://nodejs.org/)
  - [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/) (v1 or v2)
  - [Git](https://git-scm.com/) (for version control)
## Setup Instruction

### 1. Clone the Repository
```bash
git clone https://github.com/nsccDanieltpenny/NursingPatientRecordsSimulationApp
cd frontend
```

### 2. Install Necessary Dependencies

Using npm, we need to install the required dependencies in order to run the app:
```bash
npm install
```

Or using Yarn:
```bash
yarn install
```

### 3. Start-up the dev server

```bash
npm run dev
```

### 4. Configure Environment Variables

You'll need to create a .env file in the root of the project to ensure connection to the backend. All image handling in the project is done through an Azure Function app, so you will need to include that too. 

```env
VITE_API_URL= ''
VITE_FUNCTION_APP= ''
```

# Project Structure (React+Vite)

```bash
frontend/
├── node_modules/
├── .env
├── index.html
├── vite.config.js/
├── src/      
│   ├── components/                       # Reusable UI components
│   ├── context/                          # Contains role mgmt.
│   ├── css/
│   │   ├── assessment_styles.css         # Styles for assessment pages
│   │   ├── assessment_summary.css        # Styles for summary (on patient profile)
│   │   ├── component_styles.css          # Styles for reusable components
│   │   ├── home_styles.css               # Styles for Home Page (patients)
│   │   ├── patient_admin_styles.css      # Styles for patient creation (intake)
│   ├── routes/   
│   │   ├── AdminProfile.jsx
│   │   ├── ClassProfile.jsx
│   │   ├── CreateClass.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Logout.jsx
│   │   ├── 
│   ├── utils/                            # Helper functions
│   ├── App.jsx/tsx                       # Main app component
│   └── main.jsx/tsx                      # Entry point
├── public/                               # Public assets
├── package.json                          # Dependencies & scripts
└── vite.config.js                        # Build configuration (or webpack.config.js)
```
