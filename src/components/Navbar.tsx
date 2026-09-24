import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="glass-navbar py-3">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              fontWeight: 'bold',
            }}
          >
            <i className="bi bi-phone"></i>
          </div>
          <div>
            <span className="fw-bold fs-5 text-white tracking-tight">PHONE</span>
            <span className="fw-bold fs-5 text-info">STORE</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="d-none d-md-flex align-items-center mx-4 flex-grow-1" style={{ maxWidth: '420px' }}>
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary text-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-bento border-start-0 ps-0"
              placeholder="Search flagship phones, models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {/* Nav Links & Actions */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="text-decoration-none text-light opacity-75 hover-opacity-100 d-none d-lg-block fw-semibold small">
            Home
          </Link>

          {isAuthenticated && (
            <Link to="/my-orders" className="text-decoration-none text-light opacity-75 hover-opacity-100 d-none d-sm-block fw-semibold small">
              <i className="bi bi-bag-check me-1"></i> My Orders
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="badge-cyan text-decoration-none small">
              <i className="bi bi-shield-lock me-1"></i> Admin Panel
            </Link>
          )}

          {/* Cart Icon with Live Badge */}
          <Link to="/cart" className="btn btn-bento-secondary position-relative px-3 py-2">
            <i className="bi bi-cart3 fs-6"></i>
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Profile or Login */}
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-bento-secondary d-flex align-items-center gap-2 dropdown-toggle py-2"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-indigo-600 text-white fw-bold"
                  style={{ width: '26px', height: '26px', fontSize: '11px', background: '#6366f1' }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="small fw-semibold d-none d-sm-inline">{user?.username}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-card border-secondary shadow-lg" aria-labelledby="userDropdown">
                <li className="px-3 py-2 border-bottom border-secondary small text-secondary">
                  Signed in as <br />
                  <strong className="text-white">{user?.email}</strong>
                </li>
                <li>
                  <Link className="dropdown-item small py-2" to="/my-orders">
                    <i className="bi bi-bag-check me-2"></i> My Orders
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link className="dropdown-item small py-2 text-info" to="/admin">
                      <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <hr className="dropdown-divider border-secondary" />
                </li>
                <li>
                  <button className="dropdown-item small py-2 text-danger" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-bento-secondary small">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-bento-primary small d-none d-sm-inline-block">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
