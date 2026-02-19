import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [updating, setUpdating] = useState(null); // id of appointment being updated
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchAppointments = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/api/appointments');
            setAppointments(res.data.appointments);
        } catch {
            // silent fail
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const handleStatusUpdate = async (id, status) => {
        setUpdating(id);
        setMessage({ type: '', text: '' });
        try {
            const res = await axiosInstance.put(`/api/appointments/${id}`, { status });
            setAppointments(prev => prev.map(a => a._id === id ? res.data.appointment : a));
            setMessage({ type: 'success', text: `Appointment ${status} successfully!` });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update appointment.' });
        } finally {
            setUpdating(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const statusCounts = {
        pending: appointments.filter(a => a.status === 'pending').length,
        approved: appointments.filter(a => a.status === 'approved').length,
        rejected: appointments.filter(a => a.status === 'rejected').length,
    };

    return (
        <div className="dashboard-layout">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <div className="navbar-brand-icon">🏥</div>
                    <span className="navbar-brand-name">MediTrack</span>
                </div>
                <div className="navbar-right">
                    <div className="navbar-user">
                        <div className="navbar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                        <span className="navbar-username">{user?.name}</span>
                    </div>
                    <span className="navbar-role-badge badge-doctor">Doctor</span>
                    <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Content */}
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Doctor Dashboard</h1>
                    <p className="dashboard-subtitle">Manage patient appointment requests</p>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-number">{appointments.length}</div>
                        <div className="stat-label">Total</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number" style={{ color: 'var(--color-warning)' }}>{statusCounts.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number" style={{ color: 'var(--color-success)' }}>{statusCounts.approved}</div>
                        <div className="stat-label">Approved</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number" style={{ color: 'var(--color-danger)' }}>{statusCounts.rejected}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
                        {message.text}
                    </div>
                )}

                {/* Appointments Table */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title"><span className="card-icon">📋</span> Patient Appointments</h2>
                        <button className="btn btn-outline" onClick={fetchAppointments} style={{ fontSize: '12px' }}>
                            🔄 Refresh
                        </button>
                    </div>

                    {fetching ? (
                        <div className="empty-state">
                            <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }}></div>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p className="empty-state-text">No appointments assigned to you yet.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(apt => (
                                        <tr key={apt._id}>
                                            <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{apt.patientName}</td>
                                            <td>{apt.department}</td>
                                            <td>{apt.date}</td>
                                            <td>{apt.timeSlot}</td>
                                            <td>
                                                <span className={`status-badge status-${apt.status}`}>
                                                    {apt.status === 'pending' && '⏳'}
                                                    {apt.status === 'approved' && '✅'}
                                                    {apt.status === 'rejected' && '❌'}
                                                    {' '}{apt.status}
                                                </span>
                                            </td>
                                            <td>
                                                {apt.status === 'pending' ? (
                                                    <div className="action-btns">
                                                        <button
                                                            id={`approve-${apt._id}`}
                                                            className="btn btn-success"
                                                            onClick={() => handleStatusUpdate(apt._id, 'approved')}
                                                            disabled={updating === apt._id}
                                                        >
                                                            {updating === apt._id ? <span className="spinner"></span> : '✅ Approve'}
                                                        </button>
                                                        <button
                                                            id={`reject-${apt._id}`}
                                                            className="btn btn-danger"
                                                            onClick={() => handleStatusUpdate(apt._id, 'rejected')}
                                                            disabled={updating === apt._id}
                                                        >
                                                            {updating === apt._id ? <span className="spinner"></span> : '❌ Reject'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                        {apt.status === 'approved' ? 'Approved ✓' : 'Rejected ✗'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
