import { useUser } from '../../context/UserContext';

function LoggedInUserCard() {
  const { user, loading, isAdmin, isInstructor } = useUser();

  if (loading) {
    return <p>Loading logged-in user information...</p>;
  }

  if (!user) {
    return <p>No user is currently logged in.</p>;
  }

  return (
    <div className="card p-3 shadow-sm">
      <h3>Logged-In User</h3>

      <p><strong>Name:</strong> {user.fullName || 'Not available'}</p>
      <p><strong>Email:</strong> {user.email || 'Not available'}</p>
      <p><strong>Class:</strong> {user.className || 'Not enrolled'}</p>
      <p><strong>Nurse ID:</strong> {user.nurseId || 'Not assigned'}</p>
      <p><strong>Valid Profile:</strong> {user.isValid ? 'Yes' : 'No'}</p>
      <p><strong>Instructor:</strong> {isInstructor ? 'Yes' : 'No'}</p>
      <p><strong>Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>

      {user.needsEnrollment && (
        <p className="text-warning">
          This user still needs to complete enrollment.
        </p>
      )}
    </div>
  );
}

export default LoggedInUserCard;