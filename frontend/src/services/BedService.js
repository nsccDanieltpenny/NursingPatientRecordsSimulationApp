import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { generateAllBeds } from '../utils/bedUtils';
import { useCallback } from 'react';


export const useBedService = () => {
  const [beds, setBeds] = useState([]);

  //memoized fetch() and clear(), to cache the values and prevent re-running the function 
  const fetchBeds = useCallback(async () => {
    try {
      const adminCampusId = localStorage.getItem('adminCampusId');
      const response = await axios.get('/api/patients', {
        params: adminCampusId ? { campusId: adminCampusId } : undefined
      });
      setBeds(generateAllBeds(response.data));
    } catch (error) {
      console.error("Error fetching beds:", error);
      setBeds(generateAllBeds([]));
    }
  }, []);

  const clearBed = useCallback(async (bed) => {
    try {
      const bedNumber = typeof bed === 'number' ? bed : bed?.bedNumber;
      const patientId = typeof bed === 'object' ? bed?.patientId : null;

      if (patientId) {
        await axios.post(`/api/patients/${patientId}/clear-bed`);
      } else if (bedNumber != null) {
        await axios.post(`/api/patients/clear-bed/${bedNumber}`);
      } else {
        throw new Error('Missing bed identifier');
      }

      await fetchBeds();
      return true;
    } catch (error) {
      console.error('Error clearing bed:', error);
      throw error;
    }
  }, [fetchBeds]);

  useEffect(() => { fetchBeds(); }, []);

  return { beds, fetchBeds, clearBed };
};