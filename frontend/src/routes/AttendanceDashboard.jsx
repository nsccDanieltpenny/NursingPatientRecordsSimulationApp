function AttendanceDashboard() {
  const attendanceRecords = [
    {
      id: 1,
      name: "Student One",
      checkedIn: true,
      checkedOut: false,
      status: "Checked In",
    },
    {
      id: 2,
      name: "Student Two",
      checkedIn: false,
      checkedOut: false,
      status: "Absent",
    },
    {
      id: 3,
      name: "Student Three",
      checkedIn: true,
      checkedOut: true,
      status: "Complete",
    },
  ];

  return (
    <main className="container mt-4">
      <h1>Attendance Dashboard</h1>

      <p>
        Instructor-facing attendance view prepared to display records from the
        QR/TOTP attendance system.
      </p>

      <table className="table table-striped table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Checked In</th>
            <th>Checked Out</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.checkedIn ? "Yes" : "No"}</td>
              <td>{record.checkedOut ? "Yes" : "No"}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default AttendanceDashboard;