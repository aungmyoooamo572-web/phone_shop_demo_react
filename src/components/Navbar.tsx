import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    navigate('/');
  };

  return (
    <nav className="glass-navbar py-2 py-md-3">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between gap-3">
          {/* Brand Logo */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 flex-shrink-0">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm position-relative overflow-hidden"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
              }}
            >
              <i className="bi bi-phone-fill fs-5"></i>
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center gap-1">
                <span className="fw-black fs-5 text-white tracking-tight">Aung</span>
                <span className="fw-black fs-5 gradient-text-cyan"></span>
              </div>
              <span className="text-secondary fw-semibold" style={{ fontSize: '9px', letterSpacing: '0.15em', marginTop: '-4px' }}>
                TECH STORE
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="d-none d-md-flex align-items-center flex-grow-1 mx-lg-4"
            style={{ maxWidth: '440px' }}
          >
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
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-tech border-start-0 border-end-0 ps-0"
                placeholder="Search iPhone, Galaxy, Xiaomi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="input-group-text border-start-0 text-secondary bg-transparent cursor-pointer"
                  style={{
                    background: 'rgba(11, 15, 25, 0.75)',
                    borderColor: 'var(--border-glass)',
                  }}
                >
                  <i className="bi bi-x-lg" style={{ fontSize: '11px' }}></i>
                </button>
              )}
              <button
                type="submit"
                className="input-group-text text-info border-start-0"
                style={{
                  background: 'rgba(11, 15, 25, 0.75)',
                  borderColor: 'var(--border-glass)',
                  borderTopRightRadius: '0.85rem',
                  borderBottomRightRadius: '0.85rem',
                }}
              >
                <i className="bi bi-arrow-right-short fs-5"></i>
              </button>
            </div>
          </form>

          {/* Nav Actions */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            <Link
              to="/"
              className="text-decoration-none text-light opacity-75 hover-opacity-100 d-none d-lg-flex align-items-center gap-1 fw-semibold small px-2 py-1 rounded-2"
            >
              <i className="bi bi-grid-3x3-gap text-secondary"></i>
              <span>Catalog</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-orders"
                className="text-decoration-none text-light opacity-75 hover-opacity-100 d-none d-sm-flex align-items-center gap-1 fw-semibold small px-2 py-1 rounded-2"
              >
                <i className="bi bi-bag-check text-info"></i>
                <span>My Orders</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="badge-cyan text-decoration-none fw-bold small py-1 px-3 d-none d-sm-inline-flex"
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                <i className="bi bi-shield-lock-fill me-1"></i> Admin
              </Link>
            )}

            {/* Cart Button with Live Pulse */}
            <Link
              to="/cart"
              className="btn btn-tech-secondary position-relative px-3 py-2"
              title="Shopping Cart"
            >
              <i className="bi bi-bag fs-6 text-white"></i>
              {itemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    border: '2px solid #090d16',
                    fontSize: '11px',
                    boxShadow: '0 0 10px rgba(244, 63, 94, 0.6)',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-tech-secondary d-flex align-items-center gap-2 dropdown-toggle py-2 px-2 px-sm-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                    style={{
                      width: '28px',
                      height: '28px',
                      fontSize: '12px',
                      background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                      boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="small fw-semibold d-none d-sm-inline">{user?.username}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-dark glass-card-static border-secondary shadow-lg py-2"
                  aria-labelledby="userDropdown"
                  style={{ minWidth: '220px', background: '#0e1526' }}
                >
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-25 small text-secondary">
                    <span className="d-block" style={{ fontSize: '11px' }}>Signed in as</span>
                    <strong className="text-white d-block text-truncate">{user?.email || user?.username}</strong>
                    <span className="badge badge-tech mt-1">{user?.role}</span>
                  </li>
                  <li>
                    <Link className="dropdown-item small py-2 px-3 d-flex align-items-center gap-2" to="/my-orders">
                      <i className="bi bi-bag-check text-info"></i> My Orders
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item small py-2 px-3 text-info d-flex align-items-center gap-2" to="/admin">
                        <i className="bi bi-speedometer2"></i> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider border-secondary border-opacity-25 my-1" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item small py-2 px-3 text-danger d-flex align-items-center gap-2"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-tech-secondary btn-sm px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-tech-primary btn-sm px-3 d-none d-sm-inline-flex">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="btn btn-tech-secondary d-md-none p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="d-md-none pt-3 pb-2 border-top border-secondary border-opacity-25 mt-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-tech border-start-0"
                  placeholder="Search phones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-tech-primary px-3">
                  Search
                </button>
              </div>
            </form>
            <div className="d-flex flex-column gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-tech-secondary text-start py-2"
              >
                <i className="bi bi-grid-3x3-gap me-2 text-info"></i> All Phones
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-tech-secondary text-start py-2"
                >
                  <i className="bi bi-bag-check me-2 text-info"></i> My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-tech-secondary text-start py-2 text-info"
                >
                  <i className="bi bi-shield-lock me-2"></i> Admin Panel
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-tech-primary text-center py-2 mt-1"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
