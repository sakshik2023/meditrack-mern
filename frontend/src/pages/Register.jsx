import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.role);
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="auth-card">
                <div className="brand">
                    <div className="brand-icon">🏥</div>
                    <span className="brand-name">MediTrack</span>
                </div>
                <p className="auth-subtitle">Create your account to get started</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            id="reg-name"
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Dr. Jane Smith or John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            id="reg-email"
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Create a strong password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">I am a</label>
                        <select
                            id="reg-role"
                            name="role"
                            className="form-select"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="patient">🧑‍⚕️ Patient</option>
                            <option value="doctor">👨‍⚕️ Doctor</option>
                        </select>
                    </div>

                    <button id="reg-submit" type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><span className="spinner"></span> Creating account...</> : '✨ Create Account'}
                    </button>
                </form>

                <div className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
