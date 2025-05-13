import {useState, useEffect} from 'react';

const useReadOnlyMode = () => {
    const [readOnly, setReadOnly] = useState(false);

    useEffect(()=>{
        const shift = sessionStorage.getItem('selectedShift');
        setReadOnly(shift === 'ViewOnly');
    }, []);

    return readOnly;



}
export default useReadOnlyMode;