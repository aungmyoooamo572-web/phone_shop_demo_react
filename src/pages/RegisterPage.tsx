import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Username, Email နှင့် Password များကို ဖြည့်သွင်းပေးပါ။');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authService.register({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'အကောင့်ဖွင့်ရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။ အခြား Username/Email ဖြင့် ထပ်မံကြိုးစားပါ။'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center position-relative" style={{ minHeight: '85vh' }}>
      <div className="glass-card p-4 p-md-5 w-100" style={{ maxWidth: '500px' }}>
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
            <i className="bi bi-person-plus-fill fs-4"></i>
          </div>
          <h4 className="text-white fw-black mb-1 tracking-tight">အကောင့်အသစ်ဖွင့်ရန်</h4>
          <p className="text-secondary small mb-0">
            ဖုန်းဝယ်ယူမှု လွယ်ကူမြန်ဆန်စေရန် အချက်အလက်များ ဖြည့်သွင်းပါ
          </p>
        </div>

        {success && (
          <div className="glass-card border-success p-3 mb-3 d-flex align-items-center gap-2" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span className="text-white small fw-semibold">
              အကောင့်အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ! Login သို့ ခေါ်ဆောင်နေပါသည်...
            </span>
          </div>
        )}

        {error && (
          <div className="glass-card border-danger text-danger small py-2 px-3 mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">
              Username <span className="text-danger">*</span>
            </label>
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
                placeholder="အသုံးပြုလိုသော နာမည်"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-bold">
              Email Address <span className="text-danger">*</span>
            </label>
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
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control form-tech border-start-0"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-bold">
              Password <span className="text-danger">*</span>
            </label>
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
                placeholder="စကားဝှက် သတ်မှတ်ပါ (အနည်းဆုံး ၆ လုံး)"
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

          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label text-secondary small fw-semibold">Phone Number</label>
              <input
                type="text"
                className="form-control form-tech"
                placeholder="09xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label text-secondary small fw-semibold">Delivery City</label>
              <input
                type="text"
                className="form-control form-tech"
                placeholder="Yangon / Mandalay"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn btn-tech-primary w-100 py-3 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>အကောင့်ဖွင့်နေပါသည်...</span>
              </>
            ) : (
              <>
                <span>Create New Account</span>
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-secondary small">
          အကောင့်ရှိပြီးသား ဖြစ်ပါသလား?{' '}
          <Link to="/login" className="gradient-text-cyan fw-bold text-decoration-none ms-1">
            အကောင့်ဝင်ရန် (Sign In)
          </Link>
        </div>
      </div>
    </div>
  );
};
