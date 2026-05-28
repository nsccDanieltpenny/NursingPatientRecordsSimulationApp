import React, { useCallback, useState, useEffect } from "react";
import "../css/home_styles.css";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import DeveloperCredits from "../components/DeveloperCredits.jsx";
import ShiftSelection from "../components/ShiftSelection.jsx";
import RotationSelection from "../components/RotationSelection.jsx";
import { useUser } from "../context/UserContext.jsx";
import Spinner from "../components/Spinner";
import {
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useBedService } from "../services/BedService.js";
import { BedGrid } from "../components/home_components/BedGrid.jsx";
import { getAllTestData } from "../utils/assessmentStorage.js";

const Patients = () => {
  const [dataLoading, setDataLoading] = useState();
  const { user, loading, isAdmin, isInstructor } = useUser();
  const [patientData, setPatientData] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [rotation, setRotation] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [assessmentsCount, setAssessmentsCount] = useState(0);
  const { beds, clearBed, fetchBeds } = useBedService();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingClearBed, setPendingClearBed] = useState(null);

  // Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const isStudent =
    !isAdmin && !isInstructor && user?.classId && user?.isValid !== false;
  const isLtcRotation =
    rotation?.rotationId === 1 ||
    rotation?.rotationName?.toLowerCase() === "ltc";
  const isAcuteCareRotation =
    rotation?.rotationName?.toLowerCase() === "acute care";
  const canCreatePatient = !(isStudent && isLtcRotation);

  /////////////////////////////
  //    FUNCTIONS: testing   //
  /////////////////////////////

  const getAllTestData = () => {
    const assessmentPrefixes = [
      "patient-adl",
      "patient-behaviour",
      "patient-cognitive",
      "patient-elimination",
      "patient-labsdiagnosticsblood",
      "patient-mobilityandsafety",
      "patient-news2",
      "patient-nutrition",
      "patient-progressnote",
      "patient-acuteprogress",
      "patient-skin",
      "patient-profile",
    ];

    const testsByPatient = {};
    let totalCount = 0; //tracks the num of completed assessments available to publish

    // Scan localStorage for all assessment data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const prefixMatch = assessmentPrefixes.find((p) => key.startsWith(p));

      if (prefixMatch) {
        // Extract patient ID from key (format: "prefix-patientId")
        const parts = key.split("-");
        const patientId = parts[parts.length - 1];

        if (!testsByPatient[patientId]) {
          testsByPatient[patientId] = {};
        }

        testsByPatient[patientId][key] = JSON.parse(localStorage.getItem(key));
        totalCount++; //increment for each completed assessment found
      }
    }

    setAssessmentsCount(totalCount);
    return testsByPatient;
  };

  const publishAllTests = async () => {
    if (hasSubmitted || isPublishing) return;

    setIsPublishing(true);
    const allTests = getAllTestData();
    const patientIds = Object.keys(allTests);

    if (patientIds.length === 0) {
      setSnackbar({
        open: true,
        message: "No assessments found in storage to publish.",
        severity: "info",
      });
      setIsPublishing(false);
      return;
    }

    // Collect all test keys first to ensure we clear everything later
    const allTestKeys = [];
    patientIds.forEach((patientId) => {
      Object.keys(allTests[patientId]).forEach((key) => {
        allTestKeys.push(key);
      });
    });

    try {
      let successCount = 0;
      const failedSubmissions = [];

      // Attempt to submit all tests
      for (const patientId of patientIds) {
        try {
          await axios.post(`/api/patients/${patientId}/submit-data`, {
            rotationId: rotation?.rotationId || user.rotationId || 1,
            assessmentData: allTests[patientId],
          });
          successCount++;
        } catch (error) {
          console.error(
            `Failed to submit data for patient ${patientId}:`,
            error,
          );
          failedSubmissions.push({
            patientId,
            error: error.response?.data?.message || error.message,
          });
        }
      }

      // Clear ALL tests from storage regardless of success/failure
      allTestKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Store submission results
      if (failedSubmissions.length > 0) {
        sessionStorage.setItem(
          "lastSubmissionErrors",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            failedCount: failedSubmissions.length,
            totalCount: patientIds.length,
          }),
        );
      }

      setSnackbar({
        open: true,
        message:
          failedSubmissions.length > 0
            ? `Submitted ${successCount} of ${patientIds.length} assessments. ${failedSubmissions.length} failed to reach server.`
            : `Successfully submitted ${successCount} assessments.`,
        severity: failedSubmissions.length > 0 ? "warning" : "success",
      });

      setHasSubmitted(true);
    } catch (error) {
      console.error("System error during publishing:", error);
      setSnackbar({
        open: true,
        message:
          "System error during publishing. No assessments were submitted.",
        severity: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // NOTE!!!
  // comment this section out to log in while testing! This validation is throwing login error in console.
  // if (!user) {
  //   console.log("not logged in redirect");
  //   return <Navigate to="/login" replace />;
  // }

  /* This `useEffect` hook is used to perform side effects in function components.
  In this case, it is fetching patient data from a specified API endpoint when the component mounts
  for the first time (due to the empty dependency array `[]`). */
  // Initialize count on load

  /////////////////////////////
  //          HOOKS          //
  /////////////////////////////
  //initial data:
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        await fetchBeds(); // MOVED FETCH to /services/bedservice 05-18-25
        getAllTestData();
        setDataLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load bed data",
          severity: "error",
        });
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleCampusChange = () => {
      fetchBeds();
    };

    window.addEventListener("adminCampusChanged", handleCampusChange);
    return () =>
      window.removeEventListener("adminCampusChanged", handleCampusChange);
  }, [fetchBeds]);

  
  // Fetch the shift and rotation from sessionStorage when the component mounts
  useEffect(() => {
    const storedShift = sessionStorage.getItem("selectedShift");
    if (storedShift) {
      setSelectedShift(storedShift); // Set shift state if already selected
    }

    const storedRotation = sessionStorage.getItem("selectedRotation");
    if (storedRotation) {
      setRotation(JSON.parse(storedRotation)); // Set rotation state if already selected
    }
  }, []);


  useEffect(() => {
    const syncShiftRotation = () => {
      const storedShift = sessionStorage.getItem('selectedShift');
      setSelectedShift(storedShift);

      const storedRotation = sessionStorage.getItem('selectedRotation');
      setRotation(storedRotation ? JSON.parse(storedRotation) : null);
    };

    window.addEventListener('shiftChanged', syncShiftRotation);

    return () => {
      window.removeEventListener('shiftChanged', syncShiftRotation);
    };
  }, []);


  //listener for changes to storage (reading for added assessments to submit)
  useEffect(() => {
    const handleStorageChange = () => {
      getAllTestData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /////////////////////////////
  //     HANDLERS & EVENTS   //
  /////////////////////////////

  // Handle patient card click and restrict access based on the selected shift
  const handleCardClick = useCallback(
    (bed) => {
      const storedShift = sessionStorage.getItem("selectedShift"); // Get the selected shift from sessionStorage

      if (!isAdmin && !isInstructor && !storedShift) {
        alert("Please select a shift first."); // Alert if shift is not selected
        return;
      }

      if (bed.isOccupied) {
        navigate(`/patients/${bed.patientId}`); //Go to patients page
      } else {
        if (isStudent && isLtcRotation) {
          setSnackbar({
            open: true,
            message: "Students cannot create patients during LTC rotation.",
            severity: "warning",
          });
          return;
        }
        navigate("/intake", { state: { bed } }); //Create new patient at this bed
      }
      // Get the current hour to check if it matches the selected shift
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
    },
    [isAdmin, isInstructor, navigate, isStudent, isLtcRotation],
  );

  const handleRemoveBed = (bed) => {
    setPendingClearBed(bed);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setPendingClearBed(null);
  };

  const handleConfirmClear = async () => {
    if (pendingClearBed == null) return;

    try {
      await clearBed(pendingClearBed); // found in /services/bedservice! :D
      setSnackbar({
        open: true,
        message: `Bed ${pendingClearBed.bedNumber} cleared`,
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to clear bed:", error);
      setSnackbar({
        open: true,
        message: `Failed to clear bed ${pendingClearBed.bedNumber}. Please try again.`,
        severity: "error",
      });
    } finally {
      handleConfirmClose();
    }
  };

  if (dataLoading) return <Spinner />;

  return (
    <div className="PatientsPage">
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "15px",
          position: "relative",
          zIndex: 2,
          backgroundColor: "black",
        }}
      >
        <span
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            fontSize: "64px",
            color: "white",
          }}
        >
          Patients
        </span>

        <div style={{ display: "flex", gap: "16px" }}>
          {!rotation && <RotationSelection onSelectRotation={setRotation} />}
          {rotation && !selectedShift && (
            <ShiftSelection onSelectShift={setSelectedShift} />
          )}
          <Button
            variant="contained"
            onClick={publishAllTests}
            disabled={hasSubmitted || isPublishing || assessmentsCount === 0}
            // overriding any default styling below:
            sx={{
              minWidth: "200px",
              backgroundColor: hasSubmitted ? "#4CAF50" : "#004780",
              "&:hover": {
                backgroundColor: hasSubmitted ? "#388E3C" : "#003366",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
              },
              py: 1.5,
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "500",
              textTransform: "none",
              letterSpacing: "0.3px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 71, 128, 0.2)",
              height: "56px",
              alignSelf: "center",
            }}
          >
            {isPublishing
              ? "Sending..."
              : hasSubmitted
                ? "Submitted ✓"
                : assessmentsCount > 0
                  ? `${assessmentsCount} Assessment${assessmentsCount !== 1 ? "s" : ""} to Publish`
                  : "No Tests Completed"}
          </Button>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* No longer mapping bed cards -- see bedGrid */}
          <BedGrid
            beds={beds}
            onClearBed={handleRemoveBed}
            onCardClick={handleCardClick}
            canCreate={canCreatePatient}
            isAcuteCareRotation={isAcuteCareRotation}
          />
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Clear bed?</DialogTitle>
        <DialogContent dividers>
          <Typography>
            This will remove the patient from bed {pendingClearBed?.bedNumber}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClear}
            variant="contained"
            color="error"
          >
            Clear bed
          </Button>
        </DialogActions>
      </Dialog>
      <DeveloperCredits />
    </div>
  );
};

export default Patients;
