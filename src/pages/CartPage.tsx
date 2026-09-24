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
      <div className="container py-5 text-center">
        <div className="bento-card p-5 max-w-md mx-auto my-5">
          <div className="display-4 text-info mb-3"><i className="bi bi-cart-x"></i></div>
          <h4 className="text-white fw-bold mb-2">Login ပြုလုပ်ရန် လိုအပ်ပါသည်</h4>
          <p className="text-secondary small mb-4">
            Cart စာရင်းကြည့်ရှုရန်နှင့် ပစ္စည်းများ ဝယ်ယူရန်အတွက် သင်၏ Account ဖြင့် Login ဝင်ပေးပါ။
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-bento-primary">Sign In</Link>
            <Link to="/register" className="btn btn-bento-secondary">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-info" role="status"></div>
        <p className="text-secondary small mt-3">Loading your cart items...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="py-4 py-md-5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary">
          <div>
            <h2 className="text-white fw-bold mb-1">Shopping Cart</h2>
            <p className="text-secondary small mb-0">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {!isEmpty && (
            <button onClick={clearCart} className="btn btn-outline-danger btn-sm rounded-pill px-3">
              <i className="bi bi-trash3 me-1"></i> Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="bento-card p-5 text-center my-4">
            <div className="display-4 text-secondary mb-3">
              <i className="bi bi-cart3"></i>
            </div>
            <h4 className="text-white fw-bold mb-2">သင့် Cart ထဲတွင် ပစ္စည်းမရှိသေးပါ</h4>
            <p className="text-secondary small mb-4">
              စိတ်ကြိုက် စမတ်ဖုန်းများကို ရွေးချယ်ပြီး Cart ထဲသို့ ထည့်သွင်းနိုင်ပါသည်။
            </p>
            <Link to="/" className="btn btn-bento-primary">
              <i className="bi bi-grid me-2"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                {items.map((item) => (
                  <div key={item.id} className="bento-card p-3 p-md-4">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                      <div>
                        <h5 className="text-white fw-bold mb-1">{item.phoneName}</h5>
                        <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                          <span className="badge-tech small" style={{ fontSize: '11px' }}>
                            {item.ram} / {item.storage}
                          </span>
                          <span className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '11px' }}>
                            Color: {item.color}
                          </span>
                        </div>
                        <div className="text-info fw-bold fs-6">
                          {item.price.toLocaleString()} MMK
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center bg-dark border border-secondary rounded-3 p-1">
                          <button
                            className="btn btn-sm btn-dark text-white px-2 py-0"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="px-3 fw-bold small text-white">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-dark text-white px-2 py-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-end" style={{ minWidth: '110px' }}>
                          <span className="text-secondary d-block" style={{ fontSize: '10px' }}>Subtotal</span>
                          <strong className="text-white">{item.subtotal.toLocaleString()} MMK</strong>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-2"
                          title="Remove item"
                          style={{ width: '34px', height: '34px' }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Tile */}
            <div className="col-12 col-lg-4">
              <div className="bento-card p-4">
                <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary">
                  Order Summary
                </h5>

                <div className="d-flex justify-content-between text-secondary small mb-2">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-white">{(cart?.total || 0).toLocaleString()} MMK</span>
                </div>

                <div className="d-flex justify-content-between text-secondary small mb-3">
                  <span>Estimated Delivery</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>

                <div className="border-top border-secondary pt-3 mt-3 d-flex justify-content-between align-items-center mb-4">
                  <span className="text-white fw-bold fs-6">Total Amount</span>
                  <span className="text-info fw-black fs-5">
                    {(cart?.total || 0).toLocaleString()} MMK
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-bento-primary w-full py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <i className="bi bi-arrow-right"></i>
                </button>

                <div className="mt-3 text-center">
                  <Link to="/" className="text-secondary text-decoration-none small">
                    <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
