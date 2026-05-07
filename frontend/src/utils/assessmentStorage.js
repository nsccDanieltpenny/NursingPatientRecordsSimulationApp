export const getAllTestData = () => {
  const assessmentPrefixes = [
    'patient-adl',
    'patient-behaviour',
    'patient-cognitive',
    'patient-elimination',
    'patient-mobility',
    'patient-nutrition',
    'patient-progressnote',
    'patient-safety',
    'patient-skinsensoryaid',
    'patient-profile'
  ];

  const testsByPatient = {};
  let totalCount = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const prefixMatch = assessmentPrefixes.find(p => key.startsWith(p));

    if (prefixMatch) {
      const parts = key.split('-');
      const patientId = parts[parts.length - 1];

      if (!testsByPatient[patientId]) {
        testsByPatient[patientId] = {};
      }

      testsByPatient[patientId][key] = JSON.parse(localStorage.getItem(key));
      totalCount++;
    }
  }

  return { testsByPatient, totalCount };
};

export const getAssessmentCount = () => {
  return getAllTestData().totalCount;
};
