import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="glass-card p-5 max-w-md mx-auto" style={{ maxWidth: '440px' }}>
          <i className="bi bi-cart-x display-4 text-secondary mb-3"></i>
          <h4 className="text-white fw-bold mb-2">Cart ထဲတွင် ပစ္စည်းမရှိပါ</h4>
          <p className="text-secondary small mb-4">Checkout ပြုလုပ်ရန် ပစ္စည်းအရင် ရွေးချယ်ပေးပါ။</p>
          <Link to="/" className="btn btn-tech-primary">
            <i className="bi bi-grid-3x3-gap me-2"></i> Shop Phones
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('ပို့ဆောင်ရမည့် လိပ်စာ (Shipping Address) ထည့်သွင်းပေးပါ။');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const createdOrder = await orderService.createOrder({
        shippingAddress: shippingAddress.trim(),
        notes: notes.trim() || undefined,
      });

      // Refresh cart context so badge updates to 0
      await refreshCart();

      // Navigate to payment page with new order id
      navigate(`/payment?orderId=${createdOrder.id}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Order တင်ရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-4 py-md-5 position-relative">
      <div className="container">
        {/* Step Flow Indicator */}
        <div className="d-flex align-items-center justify-content-center mb-5">
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            <div className="d-flex align-items-center gap-2">
              <span className="step-node completed">
                <i className="bi bi-check2"></i>
              </span>
              <span className="small text-secondary fw-semibold d-none d-sm-inline">1. Cart</span>
            </div>
            <div className="step-line active"></div>
            <div className="d-flex align-items-center gap-2">
              <span className="step-node active">2</span>
              <span className="small text-white fw-bold d-none d-sm-inline">2. Shipping</span>
            </div>
            <div className="step-line"></div>
            <div className="d-flex align-items-center gap-2">
              <span className="step-node">3</span>
              <span className="small text-secondary fw-semibold d-none d-sm-inline">3. Payment</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-white fw-black mb-1 tracking-tight fs-3">Checkout & Shipping</h2>
          <p className="text-secondary small mb-0">
            ပို့ဆောင်ရမည့် လိပ်စာနှင့် အချက်အလက်များကို ဖြည့်သွင်းပြီး အော်ဒါတင်နိုင်ပါသည်။
          </p>
        </div>

        {error && (
          <div className="glass-card border-danger text-danger p-3 mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill fs-5"></i>
            <span className="small">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="row g-4">
          {/* Shipping Form */}
          <div className="col-12 col-lg-7">
            <div className="glass-card p-4 p-md-5">
              <h5 className="text-white fw-bold mb-4 pb-2 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-info"></i>
                <span>Shipping Information</span>
              </h5>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small fw-semibold mb-1">Customer Name</label>
                  <input
                    type="text"
                    className="form-control form-tech opacity-75"
                    value={user?.username || ''}
                    disabled
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small fw-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control form-tech opacity-75"
                    value={user?.phone || 'Not specified'}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-white small fw-bold mb-1">
                  Delivery Address (ပို့ဆောင်ရမည့် လိပ်စာ) <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control form-tech"
                  rows={4}
                  placeholder="ဥပမာ - အမှတ် (၁၂)၊ ဗဟိုလမ်း၊ ကမာရွတ်မြို့နယ်၊ ရန်ကုန်မြို့။"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
                <span className="text-secondary small mt-1 d-block" style={{ fontSize: '11px' }}>
                  အိမ်အမှတ်၊ လမ်းအမည်၊ မြို့နယ် နှင့် မြို့ အပြည့်အစုံ ရေးပေးပါ။
                </span>
              </div>

              <div className="mb-4">
                <label className="text-secondary small fw-semibold mb-1">
                  Order Notes / အထူးမှာကြားချက် (Optional)
                </label>
                <textarea
                  className="form-control form-tech"
                  rows={2}
                  placeholder="ပို့ဆောင်မှုနှင့် ပတ်သက်၍ အထူးမှာကြားလိုသည်များ ရေးသားနိုင်ပါသည်။"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-tech-primary w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order & Proceed to Payment</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary & Items List */}
          <div className="col-12 col-lg-5">
            <div className="glass-card p-4 position-sticky" style={{ top: '90px' }}>
              <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                Order Items ({items.length})
              </h5>

              <div className="d-flex flex-column gap-3 mb-4 overflow-auto" style={{ maxHeight: '280px' }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-3 d-flex justify-content-between align-items-center"
                    style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)' }}
                  >
                    <div>
                      <h6 className="text-white fw-bold mb-1 small">{item.phoneName}</h6>
                      <span className="text-secondary small d-block" style={{ fontSize: '11px' }}>
                        {item.ram}/{item.storage} • {item.color} • Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="text-end">
                      <strong className="text-info small">{item.subtotal.toLocaleString()} MMK</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="d-flex flex-column gap-2 small text-secondary pt-3 border-top border-secondary border-opacity-25 mb-3">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span className="text-white">{(cart?.total || 0).toLocaleString()} MMK</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Express Delivery:</span>
                  <span className="badge-emerald" style={{ fontSize: '10px' }}>FREE</span>
                </div>
              </div>

              <div className="pt-3 border-top border-secondary border-opacity-25 mb-3">
                <div className="d-flex justify-content-between align-items-baseline">
                  <span className="text-white fw-bold">Grand Total:</span>
                  <strong className="display-6 fs-4 gradient-text-cyan fw-black">
                    {(cart?.total || 0).toLocaleString()} MMK
                  </strong>
                </div>
              </div>

              <div
                className="p-3 rounded-3 d-flex align-items-center gap-2 small text-secondary"
                style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
              >
                <i className="bi bi-shield-check text-info fs-5"></i>
                <span style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  အော်ဒါတင်ပြီးပါက KBZPay သို့မဟုတ် WavePay ဖြင့် အလွယ်တကူ ငွေလွှဲပေးချေနိုင်ပါသည်။
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
