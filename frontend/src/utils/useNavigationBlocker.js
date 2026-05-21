import { useEffect } from "react";

let useBlocker;
try {
    // Require at runtime to avoid throwing when a data router is not used.
    // eslint-disable-next-line global-require
    useBlocker = require("react-router-dom").useBlocker;
} catch (e) {
    useBlocker = undefined;
}

export function useNavigationBlocker(shouldBlock, message = "You have unsaved changes. Click OK to proceed without saving.") {
    if (useBlocker) {
        useBlocker(() => {
            if (!shouldBlock) return false;
            const confirmLeave = window.confirm(message);
            return !confirmLeave;
        }, shouldBlock);
        return;
    }

    // Fallback: warn on full page unloads only when a data router isn't available.
    useEffect(() => {
        if (!shouldBlock) return;

        const handler = (e) => {
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [shouldBlock, message]);
}
