
export const useDefaultDate = () => {
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    return today;
  };