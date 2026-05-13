import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import ClassCard from '../components/ClassCard';
import CampusCard from '../components/CampusCard'
import { FaTrashAlt } from 'react-icons/fa';


const AdminProfile = () => {
  // API data loading state
  const [dataLoading, setDataLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [invites, setInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [guestUsers, setGuestUsers] = useState([]);
  const [guestMessage, setGuestMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const { user } = useUser();
  const navigate = useNavigate();


  const APIHOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        const response = await axios.get('/api/classes');
        console.log("classes", response.data);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }

      try {
        const inviteResponse = await axios.get('/api/admin/invitations');
        setInvites(inviteResponse.data);
      } catch (error) {
        console.error('Error fetching invites:', error);
      }

      try {
        const guestsResponse = await axios.get('/api/admin/guests');
        setGuestUsers(guestsResponse.data);
      } catch (error) {
        console.error('Error fetching guest users:', error);
      }

      setDataLoading(false);
    };

    fetchData();
  }, []);




const handleClassDelete = async (id) => {

  try {
    await axios.delete(`${APIHOST}/api/classes/${id}`);

    const response = await axios.get('/api/classes');
    setClasses(response.data);
  } catch (error) {
    console.error('Error deleting class:', error);
    alert("Failed to delete class. Try again?");
  }
};

const handleInviteSubmit = async (event) => {
  event.preventDefault();
  setInviteMessage('');

  if (!inviteEmail.trim()) {
    setInviteMessage('Email is required.');
    return;
  }

  try {
    setInviteLoading(true);
    const response = await axios.post('/api/admin/invitations', {
      email: inviteEmail.trim(),
      displayName: inviteName.trim() || null
    });

    if (response.data?.invite) {
      setInvites((prev) => [response.data.invite, ...prev]);
    }

    setInviteMessage(response.data?.message || 'Invitation sent.');
    setInviteEmail('');
    setInviteName('');
  } catch (error) {
    const message = error?.response?.data?.message || error?.response?.data?.Message || 'Failed to send invite.';
    setInviteMessage(message);
  } finally {
    setInviteLoading(false);
  }
};

const openConfirm = (message, action) => {
  setConfirmMessage(message);
  setConfirmAction(() => action);
  setConfirmOpen(true);
};

const closeConfirm = () => {
  setConfirmOpen(false);
  setConfirmMessage('');
  setConfirmAction(null);
};

const handleConfirm = async () => {
  if (confirmAction) {
    await confirmAction();
  }
  closeConfirm();
};

const handleInviteDelete = async (inviteId) => {
  try {
    await axios.delete(`/api/admin/invitations/${inviteId}`);
    setInvites((prev) => prev.filter((invite) => invite.pendingInviteId !== inviteId));
  } catch (error) {
    console.error('Error deleting invite:', error);
    setInviteMessage('Failed to delete invite.');
  }
};

const handleGuestDelete = async (guest) => {
  setGuestMessage('');
  const email = guest.mail || guest.otherMails?.[0] || guest.userPrincipalName;

  try {
    await axios.delete(`/api/admin/guests/${guest.id}`, {
      params: {
        email: email || ''
      }
    });
    setGuestUsers((prev) => prev.filter((user) => user.id !== guest.id));
  } catch (error) {
    console.error('Error deleting guest user:', error);
    setGuestMessage('Failed to delete guest user.');
  }
};

  if (dataLoading) return <div>Loading classes...</div>;

  return (
    <div>
      <h1 className="mb-3 text-center">Invite Users</h1>
      <div className="container mb-4">
        <form className="row g-2" onSubmit={handleInviteSubmit}>
          <div className="col-md-5">
            <input
              type="email"
              className="form-control"
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Display name (optional)"
              value={inviteName}
              onChange={(event) => setInviteName(event.target.value)}
            />
          </div>
          <div className="col-md-3 d-grid">
            <button className="btn btn-primary" type="submit" disabled={inviteLoading}>
              {inviteLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
        {inviteMessage && (
          <div className="mt-2 text-center">{inviteMessage}</div>
        )}
      </div>

      {confirmOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="bg-white rounded shadow p-4" style={{ maxWidth: '420px', width: '90%' }}>
              <h5 className="mb-3">Please confirm</h5>
              <p className="mb-4">{confirmMessage}</p>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-outline-secondary" type="button" onClick={closeConfirm}>
                  Cancel
                </button>
                <button className="btn btn-danger" type="button" onClick={handleConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mb-5">
        <h5>Pending Invites</h5>
        {invites.length === 0 ? (
          <div>No invites yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Invited</th>
                  <th>Invited By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.pendingInviteId}>
                    <td>{invite.email}</td>
                    <td>{invite.displayName || '-'}</td>
                    <td>{invite.status}</td>
                    <td>{new Date(invite.createdAtUtc).toLocaleString()}</td>
                    <td>{invite.invitedByEmail || '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() =>
                          openConfirm('Remove this pending invite?', () => handleInviteDelete(invite.pendingInviteId))
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="container mb-5">
        <h5>Authorized Users</h5>
        {guestMessage && (
          <div className="mb-2 text-center">{guestMessage}</div>
        )}
        {guestUsers.length === 0 ? (
          <div>No guest users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>UPN</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {guestUsers.map((guest) => (
                  <tr key={guest.id}>
                    <td>{guest.displayName || '-'}</td>
                    <td>{guest.mail || guest.otherMails?.[0] || '-'}</td>
                    <td>{guest.userPrincipalName || '-'}</td>
                    <td>{guest.createdDateTime ? new Date(guest.createdDateTime).toLocaleString() : '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() =>
                          openConfirm(
                            'Delete this guest from Entra and remove app access?',
                            () => handleGuestDelete(guest)
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <h1 className="mb-3 text-center"> Classes </h1>
      <div className="mb-3 text-center">
        <button className="btn btn-primary"  onClick={() => {navigate('/admin/class/create')}}>
          <i className="bi bi-plus"></i> Create Class
        </button>
      </div>
      
      {/* display all classes */}
      <div className="container-fluid min-vw-100">
        
        <div className="row">

          {classes.map((classData) => (
            <div key={classData.id} className="col-12 mb-3 w-50">
              <ClassCard
                classData={classData}
                onClick={() => { navigate(`/admin/class/${classData.id}`) }}
                onDelete={() => handleClassDelete(classData.id)}
              />
                
            </div>
          ))}
        </div>

      </div>

      
    </div>
  )
}

export default AdminProfile
