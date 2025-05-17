

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