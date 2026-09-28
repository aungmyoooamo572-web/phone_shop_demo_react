import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="glass-card p-5 max-w-md mx-auto" style={{ maxWidth: '460px' }}>
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <i className="bi bi-person-lock text-info fs-2"></i>
          </div>
          <h4 className="text-white fw-bold mb-2">Login ပြုလုပ်ရန် လိုအပ်ပါသည်</h4>
          <p className="text-secondary small mb-4">
            Cart စာရင်းကြည့်ရှုရန်နှင့် ပစ္စည်းများ ဝယ်ယူရန်အတွက် သင်၏ Account ဖြင့် Login ဝင်ပေးပါ။
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-tech-primary px-4">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-tech-secondary px-4">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div
          className="spinner-border text-info"
          role="status"
          style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}
        ></div>
        <p className="text-secondary small mt-3">Loading your shopping cart...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="py-4 py-md-5 position-relative">
      <div className="container">
        {/* Step Flow Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25 flex-wrap gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="text-white fw-black mb-0 tracking-tight fs-3">Shopping Cart</h2>
              <span className="badge-tech small">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <p className="text-secondary small mb-0">
              စမတ်ဖုန်းနှင့် ပစ္စည်းများကို စစ်ဆေးပြီး Checkout သို့ ဆက်လက်သွားပါ
            </p>
          </div>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="btn btn-sm btn-outline-danger rounded-pill px-3"
              style={{ fontSize: '12px' }}
            >
              <i className="bi bi-trash3 me-1"></i> Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="glass-card p-5 text-center my-4">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '72px',
                height: '72px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              <i className="bi bi-cart3 text-info fs-2"></i>
            </div>
            <h4 className="text-white fw-bold mb-2">သင့် Cart ထဲတွင် ပစ္စည်းမရှိသေးပါ</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
              စိတ်ကြိုက် Flagship စမတ်ဖုန်းများကို ရွေးချယ်ပြီး Cart ထဲသို့ ထည့်သွင်းနိုင်ပါသည်။
            </p>
            <Link to="/" className="btn btn-tech-primary">
              <i className="bi bi-grid-3x3-gap me-2"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                {items.map((item) => (
                  <div key={item.id} className="glass-card p-3 p-md-4">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                      <div>
                        <h5 className="text-white fw-bold mb-1">{item.phoneName}</h5>
                        <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                          <span className="badge-tech" style={{ fontSize: '11px' }}>
                            {item.ram} / {item.storage}
                          </span>
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-glass)',
                              color: 'var(--text-secondary)',
                              fontSize: '11px',
                            }}
                          >
                            Color: {item.color}
                          </span>
                        </div>
                        <div className="text-info fw-bold small">
                          {item.price.toLocaleString()} MMK / unit
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        {/* Stepper Controls */}
                        <div
                          className="d-flex align-items-center rounded-3 p-1"
                          style={{ background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--border-glass)' }}
                        >
                          <button
                            className="btn btn-sm btn-tech-secondary px-2 py-0 border-0"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            style={{ minWidth: '28px', height: '28px' }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="px-3 fw-bold small text-white">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-tech-secondary px-2 py-0 border-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ minWidth: '28px', height: '28px' }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-end" style={{ minWidth: '120px' }}>
                          <span className="text-secondary d-block" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                            SUBTOTAL
                          </span>
                          <strong className="text-white gradient-text-cyan fs-6">
                            {item.subtotal.toLocaleString()} MMK
                          </strong>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn btn-tech-secondary p-2 text-danger hover-bg-danger"
                          title="Remove item"
                          style={{ width: '36px', height: '36px' }}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-12 col-lg-4">
              <div className="glass-card p-4 p-md-4 position-sticky" style={{ top: '90px' }}>
                <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  Order Summary
                </h5>

                <div className="d-flex flex-column gap-2 mb-3 small text-secondary">
                  <div className="d-flex justify-content-between">
                    <span>Items Total ({items.length}):</span>
                    <strong className="text-white">{(cart?.total || 0).toLocaleString()} MMK</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Express Delivery:</span>
                    <span className="badge-emerald" style={{ fontSize: '11px' }}>
                      <i className="bi bi-check2"></i> FREE
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Warranty Coverage:</span>
                    <span className="text-info">Official 1-Year</span>
                  </div>
                </div>

                <div className="pt-3 border-top border-secondary border-opacity-25 mb-4">
                  <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <span className="text-white fw-bold">Total Amount:</span>
                    <strong className="display-6 fs-4 gradient-text-cyan fw-black">
                      {(cart?.total || 0).toLocaleString()} MMK
                    </strong>
                  </div>
                  <span className="text-secondary small d-block" style={{ fontSize: '11px' }}>
                    အခွန်နှင့် ပို့ဆောင်ခ အားလုံး ပါဝင်ပြီးဖြစ်ပါသည်။
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-tech-primary w-100 py-3 fw-bold fs-6 mb-2"
                >
                  <span>Proceed to Checkout</span>
                  <i className="bi bi-arrow-right"></i>
                </button>

                <Link
                  to="/"
                  className="btn btn-tech-secondary w-100 py-2 small text-secondary text-decoration-none"
                >
                  <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
