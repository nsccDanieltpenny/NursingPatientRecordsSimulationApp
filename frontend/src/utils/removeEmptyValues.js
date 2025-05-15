
const removeEmptyValues = (obj) =>
    Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== '' && v != null)
    );

export default removeEmptyValues;