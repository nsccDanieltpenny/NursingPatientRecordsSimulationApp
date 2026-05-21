function AttendanceDashboard() {
  const attendanceRecords = [
    {
      id: 1,
      name: "Student One",
      role: "Nurse",
      className: "Class 2",
      status: "Present",
      checkInTime: "10:50 AM",
    },
    {
      id: 2,
      name: "Student Two",
      role: "Nurse",
      className: "Class 1",
      status: "Absent",
      checkInTime: "Not checked in",
    },
  ];

  return (
    <main className="container mt-4">
      <h1>Attendance Dashboard</h1>
      <p>
        Attendance/timesheet records for logged-in users
        and instructor review.
      </p>

      <table className="table table-striped table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Class</th>
            <th>Status</th>
            <th>Check-In Time</th>
          </tr>
        </thead>

        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.role}</td>
              <td>{record.className}</td>
              <td>{record.status}</td>
              <td>{record.checkInTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default AttendanceDashboard;