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
      <div className="container py-5 text-center">
        <div className="bento-card p-5 max-w-md mx-auto my-5">
          <h4 className="text-white fw-bold mb-2">Cart ထဲတွင် ပစ္စည်းမရှိပါ</h4>
          <p className="text-secondary small mb-4">Checkout ပြုလုပ်ရန် ပစ္စည်းအရင် ရွေးချယ်ပေးပါ။</p>
          <Link to="/" className="btn btn-bento-primary">Shop Phones</Link>
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
      const msg = err?.response?.data?.message || 'Order တင်ရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-4 py-md-5">
      <div className="container">
        <h2 className="text-white fw-bold mb-1">Checkout & Order Placement</h2>
        <p className="text-secondary small mb-4">
          ပို့ဆောင်ရမည့် လိပ်စာနှင့် အချက်အလက်များကို ဖြည့်သွင်းပြီး အော်ဒါတင်နိုင်ပါသည်။
        </p>

        {error && (
          <div className="alert alert-danger border-danger rounded-4 py-3 mb-4">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="row g-4">
          {/* Shipping Form (8 cols) */}
          <div className="col-12 col-lg-7">
            <div className="bento-card p-4 p-md-5">
              <h5 className="text-white fw-bold mb-4 pb-2 border-bottom border-secondary">
                <i className="bi bi-geo-alt-fill text-info me-2"></i> Shipping Information
              </h5>

              <div className="mb-3">
                <label className="text-secondary small fw-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  className="form-control form-bento"
                  value={user?.username || ''}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="text-secondary small fw-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  className="form-control form-bento"
                  value={user?.phone || '09xxxxxxxxx'}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="text-white small fw-bold mb-1">
                  Delivery Address <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control form-bento"
                  rows={3}
                  placeholder="ဥပမာ - အမှတ် (၁၂)၊ လမ်းမတော်လမ်း၊ လမ်းမတော်မြို့နယ်၊ ရန်ကုန်မြို့။"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="text-secondary small fw-semibold mb-1">
                  Order Notes / Special Delivery Instructions (Optional)
                </label>
                <textarea
                  className="form-control form-bento"
                  rows={2}
                  placeholder="ဖုန်းမဆက်မီ message ပို့ပေးပါ (သို့မဟုတ်) ရုံးချိန်အတွင်း ပို့ပေးပါ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Order Review & Pay (5 cols) */}
          <div className="col-12 col-lg-5">
            <div className="bento-card p-4">
              <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary">
                Review Items ({items.length})
              </h5>

              <div className="d-flex flex-column gap-2 mb-4 max-h-60 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center small py-1 border-bottom border-secondary border-opacity-25">
                    <div>
                      <strong className="text-white d-block">{item.phoneName}</strong>
                      <span className="text-secondary" style={{ fontSize: '11px' }}>
                        {item.ram}/{item.storage} • {item.color} (x{item.quantity})
                      </span>
                    </div>
                    <span className="text-info fw-semibold">{item.subtotal.toLocaleString()} MMK</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Total Amount:</span>
                <span className="text-info fw-black fs-5">
                  {(cart?.total || 0).toLocaleString()} MMK
                </span>
              </div>

              <div className="p-3 rounded-3 mb-4 small" style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <i className="bi bi-info-circle text-info me-2"></i>
                <span className="text-secondary">
                  အော်ဒါတင်ပြီးပါက Payment Provider (KBZPay / WavePay) ဖြင့် ငွေပေးချေရန် စာမျက်နှာသို့ ရောက်ရှိပါမည်။
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-bento-primary w-full py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
              >
                {submitting ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Place Order & Proceed to Pay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
