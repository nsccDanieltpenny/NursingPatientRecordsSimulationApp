import { useBlocker } from 'react-router-dom';

export function useNavigationBlocker(shouldBlock, message = "You have unsaved changes. Click OK to proceed without saving.") {
    useBlocker(() => {
        if (!shouldBlock) return false;

        const confirmLeave = window.confirm(message);
        return !confirmLeave;
    }, shouldBlock);
}
