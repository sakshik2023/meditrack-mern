import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            if (user.role === 'doctor') navigate('/doctor/dashboard');
            else navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                <p className="auth-subtitle">Sign in to your account to continue</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            id="login-email"
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
                            id="login-password"
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button id="login-submit" type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><span className="spinner"></span> Signing in...</> : '🔐 Sign In'}
                    </button>
                </form>

                <div className="auth-link">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
