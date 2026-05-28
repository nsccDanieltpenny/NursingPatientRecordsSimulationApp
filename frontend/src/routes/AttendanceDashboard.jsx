import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";

function AttendanceDashboard() {
  const [searchParams] = useSearchParams();
  const attendanceId = searchParams.get("id");

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!attendanceId) {
      setAttendanceRecords([]);
      setError("Missing attendance ID. Start an attendance session first.");
      return;
    }

    setLoading(true);
    setError("");

    api
      .get("/api/attendance/list", {
        params: { id: attendanceId },
      })
      .then((response) => {
        setAttendanceRecords(response.data);
      })
      .catch((err) => {
        console.error("Failed to load attendance records:", err);
        setError("Could not load attendance records.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [attendanceId]);

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
          <p className="text-uppercase fw-semibold mb-1" style={{ color: "#0b5c97" }}>
            Instructor View
          </p>
          <h1 className="fw-bold mb-2">Attendance Dashboard</h1>
          <p className="text-muted mb-0">
            Track student attendance activity and session participation.
          </p>
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
            <h2 className="h5 fw-bold mb-0">Attendance Records</h2>
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
    </main>
  );
}

export default AttendanceDashboard;