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

You'll need to create a .env file in the root of the project to ensure connection to the backend. All image handling in the project is done through an Azure Function app, and is optional for development deployments.

```env
VITE_API_URL= ''
VITE_FUNCTION_APP= ''
VITE_AD_CLIENTID=''
VITE_AD_TENANTID=''
VITE_AD_REDIRECTURI=''
VITE_AD_APICLIENTID=''
```

These values will be given to you by whoever is managing deployments for your team (although VITE_API_URL can be your local development instance, usually http://localhost:5232)