import axios from 'axios';
const APIHOST = import.meta.env.VITE_API_URL;



/////////////////////////
// BED DATA FUNCTIONS  //
/////////////////////////
/**
 * Creates an array of bed objects with information about occupancy
 * status, patient ID, and unit based on a list of patients and total number of beds.
 */
export const generateAllBeds = (patients, totalBeds = 15) => {
    const occupiedBedNumbers = new Set(patients.map(p => p.bedNumber));
    return Array.from({ length: totalBeds }, (_, i) => {
        const bedNumber = i + 1;
        const patient = patients.find(p => p.bedNumber === bedNumber);
        return {
            bedNumber,
            isOccupied: occupiedBedNumbers.has(bedNumber),
            patientId: patient?.patientId || null,
            unit: patient?.Unit || '4260'
        };
    });
};

///////////////////////////
//   BED API FUNCTIONS   //
///////////////////////////

/*
 * Fetches occupied beds with patient info
 */
export const fetchOccupiedBeds = async () => {
    const response = await axios.get(`${APIHOST}/api/patients`);
    return response.data.map(patient => ({
        bedNumber: patient.bedNumber,
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        unit: patient.Unit || '4260'
    }));
};


//////////////////////////////////
//   BED MANAGEMENT FUNCTIONS   //
//////////////////////////////////

/*
 * Clears a patient from a bed -- NOTE: FRONTEND ONLY. (no endpoint as of 05-18-2025).
 * Temporary fix for trial demo only. Commented out endpoint in clearBed function.
 */ 
export const removePatientFromBed = (currentBeds, bedNumberToClear) => {
    return currentBeds.map(bed => {
        if (bed.bedNumber === bedNumberToClear) {
            return {
                ...bed,
                isOccupied: false,
                patientId: null
            };
        }
        return bed;
    });
};


/**
 * Clears a patient from a bed
 */
export const clearBed = async (bedNumber) => {

    // TODO: Replace with actual API call when endpoint exists
    // await axios.delete(`${APIHOST}/api/beds/${bedNumber}/patient`);
    
    console.log(`Simulating clearance of bed ${bedNumber}`);
    return { success: true, bedNumber };
};