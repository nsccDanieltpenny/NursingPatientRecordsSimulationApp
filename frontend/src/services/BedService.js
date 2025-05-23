import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { generateAllBeds } from '../utils/bedUtils';
import { useCallback } from 'react';


export const useBedService = () => {
  const [beds, setBeds] = useState([]);

  //memoized fetch() and clear(), to cache the values and prevent re-running the function 
  const fetchBeds = useCallback(async () => {
    try {
      const response = await axios.get(`/api/patients`);
      setBeds(generateAllBeds(response.data));
    } catch (error) {
      console.error("Error fetching beds:", error);
      setBeds(generateAllBeds([]));
    }
  }, []);

  const clearBed = useCallback((bedNumber) => {
    setBeds(prevBeds => 
      prevBeds.map(bed => 
        bed.bedNumber === bedNumber 
          ? { ...bed, isOccupied: false, patientId: null }
          : bed
      )
    );
  }, []);

  useEffect(() => { fetchBeds(); }, []);

  return { beds, fetchBeds, clearBed };
};