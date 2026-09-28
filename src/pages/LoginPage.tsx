import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username နှင့် Password ဖြည့်သွင်းပေးပါ။');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await authService.login({
        username: username.trim(),
        password: password.trim(),
      });

      login(res.token, {
        id: res.id,
        username: res.username,
        email: res.email,
        phone: res.phone,
        address: res.address,
        role: res.role,
      });

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'အကောင့်ဝင်ရောက်မှု မအောင်မြင်ပါ။ Username နှင့် Password ကို ပြန်လည်စစ်ဆေးပါ။'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center position-relative" style={{ minHeight: '80vh' }}>
      <div className="glass-card p-4 p-md-5 w-100" style={{ maxWidth: '440px' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="rounded-3 d-inline-flex align-items-center justify-content-center text-white mb-2 shadow-sm"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <i className="bi bi-phone-fill fs-4"></i>
          </div>
          <h4 className="text-white fw-black mb-1 tracking-tight">အကောင့်ဝင်ရောက်ရန်</h4>
          <p className="text-secondary small mb-0">
            Aung Myo Oo Tech Store သို့ ဆက်လက်ဆောင်ရွက်ရန် ဝင်ရောက်ပါ
          </p>
        </div>

        {error && (
          <div className="glass-card border-danger text-danger small py-2 px-3 mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">Username</label>
            <div className="input-group">
              <span
                className="input-group-text border-end-0 text-secondary"
                style={{
                  background: 'rgba(11, 15, 25, 0.75)',
                  borderColor: 'var(--border-glass)',
                  borderTopLeftRadius: '0.85rem',
                  borderBottomLeftRadius: '0.85rem',
                }}
              >
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control form-tech border-start-0"
                placeholder="Username ထည့်ပါ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-white small fw-bold">Password</label>
            <div className="input-group">
              <span
                className="input-group-text border-end-0 text-secondary"
                style={{
                  background: 'rgba(11, 15, 25, 0.75)',
                  borderColor: 'var(--border-glass)',
                  borderTopLeftRadius: '0.85rem',
                  borderBottomLeftRadius: '0.85rem',
                }}
              >
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control form-tech border-start-0 border-end-0"
                placeholder="စကားဝှက် ထည့်ပါ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text border-start-0 text-secondary bg-transparent cursor-pointer"
                style={{
                  background: 'rgba(11, 15, 25, 0.75)',
                  borderColor: 'var(--border-glass)',
                  borderTopRightRadius: '0.85rem',
                  borderBottomRightRadius: '0.85rem',
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-tech-primary w-100 py-3 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>ဝင်ရောက်နေပါသည်...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-3 border-top border-secondary border-opacity-25 text-center">
          <div className="text-secondary small mb-2" style={{ fontSize: '11px' }}>
            စမ်းသပ်ရန် Demo Accounts အမြန်ဖြည့်ရန်:
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin', 'admin123')}
              className="btn btn-sm btn-tech-outline"
              style={{ fontSize: '11px' }}
            >
              <i className="bi bi-shield-lock me-1"></i> Admin (admin)
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('customer', 'customer123')}
              className="btn btn-sm btn-tech-secondary"
              style={{ fontSize: '11px' }}
            >
              <i className="bi bi-person me-1"></i> Customer
            </button>
          </div>
        </div>

        <div className="text-center mt-4 pt-2 text-secondary small">
          အကောင့်အသစ် ဖွင့်လိုပါသလား?{' '}
          <Link to="/register" className="gradient-text-cyan fw-bold text-decoration-none ms-1">
            အကောင့်ဖွင့်မည် (Register)
          </Link>
        </div>
      </div>
    </div>
  );
};
