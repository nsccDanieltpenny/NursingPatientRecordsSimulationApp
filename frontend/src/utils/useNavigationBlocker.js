import { useBlocker } from 'react-router-dom';
import { useEffect } from 'react';

export function useNavigationBlocker(shouldBlock, message = "You have unsaved changes. Click OK to proceed without saving.") {
    useBlocker(({ currentLocation, nextLocation, historyAction }) => {
        if (!shouldBlock) return false;

        const confirmLeave = window.confirm(message);
        return !confirmLeave;
    }, shouldBlock);
}
