import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="bento-card p-4 p-md-5 w-100" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <div className="brand-logo fs-3 mb-2">
            PHONE<span className="text-white">SHOP</span>
          </div>
          <h4 className="text-white fw-bold mb-1">အကောင့်အသစ်ဖွင့်ရန်</h4>
          <p className="text-secondary small">
            ဖုန်းဝယ်ယူမှု လွယ်ကူမြန်ဆန်စေရန် အချက်အလက်များ ဖြည့်သွင်းပါ
          </p>
        </div>

        {success && (
          <div className="alert alert-success bg-opacity-25 border-success text-white small py-3 px-3 mb-3">
            <i className="bi bi-check-circle-fill me-2 text-success"></i>
            အကောင့်အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ! Login စာမျက်နှာသို့ ခေါ်ဆောင်နေပါသည်...
          </div>
        )}

        {error && (
          <div className="alert alert-danger bg-opacity-25 border-danger text-danger small py-2 px-3 mb-3">
            <i className="bi bi-exclamation-circle me-1"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white small fw-bold">
              Username <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-dark border-opacity-50 text-secondary">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control bento-input"
                placeholder="အသုံးပြုလိုသော နာမည်"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-bold">
              Email <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-dark border-opacity-50 text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bento-input"
                placeholder="example@mail.com"
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
              <span className="input-group-text bg-dark border-dark border-opacity-50 text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bento-input"
                placeholder="အနည်းဆုံး စာလုံး ၆ လုံး"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-bold">ဖုန်းနံပါတ် (Phone Number)</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-dark border-opacity-50 text-secondary">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="tel"
                className="form-control bento-input"
                placeholder="09..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-white small fw-bold">ပို့ဆောင်ရမည့် လိပ်စာ (Address)</label>
            <textarea
              rows={2}
              className="form-control bento-input"
              placeholder="အမှတ်၊ လမ်း၊ မြို့နယ်၊ မြို့..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn btn-bento-primary w-100 py-2 fw-bold mb-3"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                အကောင့်ဖွင့်နေပါသည်...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-3 text-secondary small">
          အကောင့်ရှိပြီးသားဖြစ်ပါသလား?{' '}
          <Link to="/login" className="text-cyan fw-bold text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
