import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="bento-card p-4 p-md-5 w-100" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="brand-logo fs-3 mb-2">
            PHONE<span className="text-white">SHOP</span>
          </div>
          <h4 className="text-white fw-bold mb-1">အကောင့်ဝင်ရောက်ရန်</h4>
          <p className="text-secondary small">
            မင်္ဂလာပါ! ဆက်လက်ဆောင်ရွက်ရန် သင့်အကောင့်သို့ ဝင်ရောက်ပါ။
          </p>
        </div>

        {error && (
          <div className="alert alert-danger bg-opacity-25 border-danger text-danger small py-2 px-3 mb-3">
            <i className="bi bi-exclamation-circle me-1"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-dark border-opacity-50 text-secondary">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control bento-input"
                placeholder="Username ထည့်ပါ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label text-white small fw-bold mb-0">Password</label>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-dark border-dark border-opacity-50 text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bento-input"
                placeholder="စကားဝှက် ထည့်ပါ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-bento-primary w-100 py-2 fw-bold mb-3"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ဝင်ရောက်နေပါသည်...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Demo Test Buttons */}
        <div className="pt-3 border-top border-dark border-opacity-25 text-center">
          <div className="text-secondary small mb-2">စမ်းသပ်ရန် Demo Accounts အမြန်ထည့်ရန်:</div>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin', 'admin123')}
              className="btn btn-sm btn-outline-info"
            >
              <i className="bi bi-shield-lock me-1"></i> Admin (admin)
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('customer', 'customer123')}
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="bi bi-person me-1"></i> Customer
            </button>
          </div>
        </div>

        <div className="text-center mt-4 pt-2 text-secondary small">
          အကောင့်အသစ် ဖွင့်လိုပါသလား?{' '}
          <Link to="/register" className="text-cyan fw-bold text-decoration-none">
            အကောင့်ဖွင့်မည် (Register)
          </Link>
        </div>
      </div>
    </div>
  );
};
