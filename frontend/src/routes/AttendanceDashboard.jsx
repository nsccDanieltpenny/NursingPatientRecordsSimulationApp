import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AttendanceModal from "../components/AttendanceModal";
import { useUser } from '../context/UserContext';




function AttendanceDashboard() {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceType, setAttendanceType] = useState("IN");
  const { user } = useUser();
  const [students, setStudents] = useState([]);


  useEffect(() => {
    fetchByDate()
    if (!user?.classId) return;

    api.get(`/api/classes/${user.classId}`)
      .then(res => setStudents(res.data.students))
      .catch(console.error);

  }, [user]);

  
  const fetchByDate = () => {
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    setError("");

    const formattedDate = selectedDate.toISOString().split("T")[0];

    api
      .get("/api/attendance/list", {
        params: { date: formattedDate },
      })
      .then((response) => {
        setAttendanceRecords(response.data);
      })
      .catch((err) => {
        console.error("Failed to load attendance by date:", err);
        setError("Could not load attendance records for that date.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  
  useEffect(() => {
    if (!selectedDate) return;

    const interval = setInterval(() => {
      fetchByDate();
    }, 3000); 

    return () => clearInterval(interval); 
  }, [selectedDate]);



  const total = attendanceRecords.length;
  const checkedIn = attendanceRecords.filter((r) => r.checkedIn).length;
  const complete = attendanceRecords.filter((r) => r.status === "Complete").length;
  const absent = attendanceRecords.filter((r) => r.status === "Absent").length;

  const getStatusBadgeClass = (status) => {
    if (status === "Complete") return "bg-success";
    if (status === "Checked In") return "bg-primary";
    return "bg-warning text-dark";
  };

  return (
    <main
      className="container-fluid min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #0b5c97 0%, #18a8e1 100%)",
      }}
    >
      <div className="container bg-white rounded-4 shadow p-4">
        <section className="mb-4">
          <div className="d-flex align-items-center flex-wrap gap-3">
            
            {/* TEXT */}
            <div>
              <h1 className="fw-bold mb-1">Attendance Dashboard</h1>
            </div>

            {/* BUTTONS + NOTE */}
            <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
              <button
                className="btn btn-success"
                onClick={() => {
                  setAttendanceType("IN");
                  setShowAttendanceModal(true);
                }}
              >
                Start Check-In
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setAttendanceType("OUT");
                  setShowAttendanceModal(true);
                }}
              >
                Start Check-Out
              </button>

              <span className="text-muted small ms-2">
                (Applies to today’s attendance only)
              </span>
            </div>
          </div>
        </section>

        <section className="mb-4">

          <button
            className="btn btn-primary"
            onClick={() => setShowCalendar(true)}
          >
            Pick Date
          </button>

        </section>



        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="alert alert-info" role="alert">
            Loading attendance records...
          </div>
        )}

        <section className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Total Records</p>
                <h3 className="fw-bold mb-0" style={{ color: "#0b5c97" }}>
                  {total}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Checked In</p>
                <h3 className="fw-bold mb-0" style={{ color: "#0b5c97" }}>
                  {checkedIn}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Completed</p>
                <h3 className="fw-bold mb-0 text-success">{complete}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Absent</p>
                <h3 className="fw-bold mb-0 text-warning">{absent}</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="card shadow-sm border-0">
          <div
            className="card-header text-white"
            style={{ backgroundColor: "#0b5c97" }}
          >
            <h2 className="h5 fw-bold mb-0">Attendance Records for {selectedDate.toDateString()}</h2>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Checked In</th>
                    <th>Checked Out</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendanceRecords.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No attendance records to display.
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="fw-semibold">{record.name}</td>
                        <td>{record.checkedIn ? "Yes" : "No"}</td>
                        <td>{record.checkedOut ? "Yes" : "No"}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      
      <AttendanceModal
        show={showAttendanceModal}
        handleClose={() => setShowAttendanceModal(false)}
        students={students}
        type={attendanceType}
        classId={user?.classId}
      />

      {showCalendar && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            transform: "scale(1.2)"
          }}
        >
          <div className="bg-white p-4 rounded-4 shadow">
            <Calendar
              onChange={(date) => {
                setSelectedDate(date);
              }}
              value={selectedDate}
            />

              <div className="text-end mt-3">

              <button
                className="btn btn-primary mt-2 ms-2"
                onClick={() => {
                  fetchByDate();
                  setShowCalendar(false);
                }}

              >
                Load Attendance
              </button>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AttendanceDashboard;