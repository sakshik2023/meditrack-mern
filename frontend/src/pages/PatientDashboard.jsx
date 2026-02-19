import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const DEPARTMENTS = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Radiology', 'General Medicine', 'ENT', 'Ophthalmology'
];

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [form, setForm] = useState({ department: '', doctorName: '', date: '', timeSlot: '' });
    const [booking, setBooking] = useState(false);
    const [bookError, setBookError] = useState('');
    const [bookSuccess, setBookSuccess] = useState('');

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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleBook = async (e) => {
        e.preventDefault();
        setBookError('');
        setBookSuccess('');
        setBooking(true);
        try {
            await axiosInstance.post('/api/appointments', form);
            setBookSuccess('Appointment booked successfully! 🎉');
            setForm({ department: '', doctorName: '', date: '', timeSlot: '' });
            fetchAppointments();
        } catch (err) {
            setBookError(err.response?.data?.message || 'Failed to book appointment.');
        } finally {
            setBooking(false);
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

    const today = new Date().toISOString().split('T')[0];

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
                    <span className="navbar-role-badge badge-patient">Patient</span>
                    <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Content */}
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Patient Dashboard</h1>
                    <p className="dashboard-subtitle">Book and track your medical appointments</p>
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

                <div className="grid-2">
                    {/* Book Appointment Form */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title"><span className="card-icon">📅</span> Book Appointment</h2>
                        </div>

                        {bookError && <div className="alert alert-error">{bookError}</div>}
                        {bookSuccess && <div className="alert alert-success">{bookSuccess}</div>}

                        <form onSubmit={handleBook}>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    id="book-department"
                                    name="department"
                                    className="form-select"
                                    value={form.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Doctor Name</label>
                                <input
                                    id="book-doctor"
                                    type="text"
                                    name="doctorName"
                                    className="form-input"
                                    placeholder="Enter doctor's full name"
                                    value={form.doctorName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    id="book-date"
                                    type="date"
                                    name="date"
                                    className="form-input"
                                    value={form.date}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Time Slot</label>
                                <select
                                    id="book-timeslot"
                                    name="timeSlot"
                                    className="form-select"
                                    value={form.timeSlot}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select time slot</option>
                                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <button id="book-submit" type="submit" className="btn btn-primary" disabled={booking}>
                                {booking ? <><span className="spinner"></span> Booking...</> : '📅 Book Appointment'}
                            </button>
                        </form>
                    </div>

                    {/* My Appointments */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title"><span className="card-icon">📋</span> My Appointments</h2>
                        </div>

                        {fetching ? (
                            <div className="empty-state">
                                <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto' }}></div>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🗓️</div>
                                <p className="empty-state-text">No appointments yet.<br />Book your first one!</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Doctor</th>
                                            <th>Dept</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map(apt => (
                                            <tr key={apt._id}>
                                                <td>{apt.doctorName}</td>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
