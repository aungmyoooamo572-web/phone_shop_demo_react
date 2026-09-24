import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import type { Order, Payment, PaymentProvider } from '../types';

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [existingPayments, setExistingPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [provider, setProvider] = useState<PaymentProvider>('KPAY');
  const [transactionId, setTransactionId] = useState('');
  const [slipUrl, setSlipUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchOrderData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const [orderData, paymentsData] = await Promise.all([
        orderService.getOrderById(id),
        paymentService.getPaymentsByOrder(id).catch(() => [] as Payment[]),
      ]);
      setOrder(orderData);
      setExistingPayments(paymentsData);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Order အချက်အလက်များ ရှာမတွေ့ပါ သို့မဟုတ် ရယူရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderData(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (provider !== 'COD' && !transactionId.trim()) {
      setError('ငွေလွှဲ Transaction ID (သို့မဟုတ်) နောက်ဆုံးဂဏန်း ၆ လုံး ထည့်သွင်းပေးပါ။');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      await paymentService.createPayment({
        orderId: order.id,
        provider,
        transactionId: provider === 'COD' ? 'COD-PAYMENT' : transactionId.trim(),
        paymentSlipUrl: slipUrl.trim() || undefined,
      });

      setSuccessMsg('ငွေပေးချေမှု အချက်အလက် တင်သွင်းပြီးပါပြီ။ Admin မှ မကြာမီ စစ်ဆေးအတည်ပြုပေးပါမည်။');
      setTransactionId('');
      setSlipUrl('');

      // Refresh payments list
      const updatedPayments = await paymentService.getPaymentsByOrder(order.id);
      setExistingPayments(updatedPayments);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'ငွေပေးချေမှု အတည်ပြုရန် ပေးပို့ရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasVerifiedPayment = existingPayments.some((p) => p.status === 'VERIFIED');

  if (!orderId) {
    return (
      <div className="container py-5 text-center">
        <div className="bento-card p-5 max-w-md mx-auto my-5">
          <i className="bi bi-wallet2 text-primary display-4 mb-3"></i>
          <h4 className="text-white fw-bold mb-2">Order မတွေ့ရှိပါ</h4>
          <p className="text-secondary small mb-4">
            ငွေပေးချေလိုသော Order ကို သင်၏ Order စာရင်းမှ ရွေးချယ်ပေးပါ။
          </p>
          <Link to="/my-orders" className="btn btn-bento-primary">
            ကျွန်ုပ်၏ Orders များသို့သွားရန်
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status"></div>
        <p className="text-secondary">Order အချက်အလက်များ ဖတ်ရှုနေပါသည်...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger bento-card border-danger text-center max-w-lg mx-auto p-4">
          <i className="bi bi-exclamation-triangle-fill fs-2 mb-2 d-block"></i>
          <h5 className="fw-bold">{error}</h5>
          <Link to="/my-orders" className="btn btn-outline-light mt-3 btn-sm">
            Orders စာရင်းသို့ ပြန်သွားရန်
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-3 py-1 mb-2">
            Secure Payment Gateway
          </span>
          <h2 className="text-white fw-bold mb-1">ငွေပေးချေခြင်း (Payment)</h2>
          <p className="text-secondary small mb-0">
            Order #{order?.id.substring(0, 8)} အတွက် ငွေလွှဲပြေစာနှင့် အချက်အလက်များ ပေးပို့ရန်
          </p>
        </div>
        <Link to="/my-orders" className="btn btn-bento-outline btn-sm">
          <i className="bi bi-arrow-left me-1"></i> My Orders
        </Link>
      </div>

      {successMsg && (
        <div className="alert alert-success bg-opacity-25 border-success text-white mb-4 d-flex align-items-center gap-3">
          <i className="bi bi-check-circle-fill text-success fs-3"></i>
          <div>
            <div className="fw-bold">{successMsg}</div>
            <div className="small text-white-50">
              Admin ဘက်မှ ငွေလွှဲစစ်ဆေးအတည်ပြုပြီးသည်နှင့် Order အဆင့်မှာ CONFIRMED သို့ ပြောင်းလဲသွားပါမည်။
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger bg-opacity-25 border-danger text-danger mb-4">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Order Summary & Payment Records */}
        <div className="col-lg-5">
          {/* Order Snapshot Card */}
          <div className="bento-card p-4 mb-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-primary"></i> Order Summary
            </h5>

            <div className="d-flex justify-content-between py-2 border-bottom border-dark border-opacity-25">
              <span className="text-secondary small">Order ID</span>
              <span className="text-white font-monospace small">{order?.id}</span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom border-dark border-opacity-25">
              <span className="text-secondary small">Order Status</span>
              <span
                className={`badge ${
                  order?.status === 'CONFIRMED'
                    ? 'bg-success'
                    : order?.status === 'PENDING'
                    ? 'bg-warning text-dark'
                    : 'bg-info'
                }`}
              >
                {order?.status}
              </span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom border-dark border-opacity-25">
              <span className="text-secondary small">Shipping Address</span>
              <span className="text-white-50 small text-end" style={{ maxWidth: '200px' }}>
                {order?.shippingAddress}
              </span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom border-dark border-opacity-25">
              <span className="text-secondary small">Order Items</span>
              <span className="text-white small">
                {order?.items?.length || 0} items
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3">
              <span className="text-white fw-bold">စုစုပေါင်း ပေးချေရန်</span>
              <span className="price-tag fs-4 fw-bold">
                {order?.totalAmount.toLocaleString()} MMK
              </span>
            </div>
          </div>

          {/* Existing Payment Attempts Bento Card */}
          <div className="bento-card p-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-cyan"></i> ငွေလွှဲမှတ်တမ်းများ (Payments)
            </h5>

            {existingPayments.length === 0 ? (
              <p className="text-secondary small mb-0">
                ဤ Order အတွက် ငွေလွှဲမှတ်တမ်း မရှိသေးပါ။ ညာဘက်တွင် ငွေပေးချေမှု တင်သွင်းနိုင်ပါသည်။
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {existingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-secondary">{p.provider}</span>
                      <span
                        className={`badge ${
                          p.status === 'VERIFIED'
                            ? 'bg-success'
                            : p.status === 'REJECTED'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="text-white small fw-bold mt-1">
                      {p.amount.toLocaleString()} MMK
                    </div>
                    <div className="text-secondary small font-monospace">
                      Txn: {p.transactionId || 'N/A'}
                    </div>
                    {p.paymentSlipUrl && (
                      <a
                        href={p.paymentSlipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan small d-inline-block mt-1"
                      >
                        <i className="bi bi-image me-1"></i> View Slip Image
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="col-lg-7">
          <div className="bento-card p-4">
            <h5 className="text-white fw-bold mb-3">ငွေပေးချေနည်းလမ်း ရွေးချယ်ရန်</h5>

            {hasVerifiedPayment ? (
              <div className="alert alert-success bg-opacity-25 border-success text-white p-4 text-center">
                <i className="bi bi-check2-circle fs-1 text-success mb-2 d-block"></i>
                <h5 className="fw-bold mb-2">ငွေပေးချေမှု အောင်မြင်ပြီးဖြစ်ပါသည်!</h5>
                <p className="small text-white-50 mb-3">
                  ဤ Order အတွက် ငွေလွှဲစစ်ဆေးအတည်ပြုခြင်း (VERIFIED) ပြီးမြောက်ပါပြီ။ ထပ်မံပေးချေရန် မလိုအပ်တော့ပါ။
                </p>
                <Link to="/my-orders" className="btn btn-bento-primary">
                  Order အခြေအနေ ကြည့်ရန်
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Payment Provider Selection Grid */}
                <div className="row g-3 mb-4">
                  {/* KBZPay */}
                  <div className="col-sm-6">
                    <div
                      onClick={() => setProvider('KPAY')}
                      className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${
                        provider === 'KPAY'
                          ? 'border border-primary'
                          : 'border border-dark border-opacity-50'
                      }`}
                      style={{
                        background:
                          provider === 'KPAY'
                            ? 'rgba(79, 70, 229, 0.15)'
                            : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-white">KBZPay (KPay)</span>
                        {provider === 'KPAY' && (
                          <i className="bi bi-check-circle-fill text-primary"></i>
                        )}
                      </div>
                      <div className="text-white-50 small mb-1">ဖုန်းနံပါတ်: 09-952001122</div>
                      <div className="text-secondary small">အမည်: Phone Shop Official</div>
                    </div>
                  </div>

                  {/* WavePay */}
                  <div className="col-sm-6">
                    <div
                      onClick={() => setProvider('WAVEPAY')}
                      className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${
                        provider === 'WAVEPAY'
                          ? 'border border-warning'
                          : 'border border-dark border-opacity-50'
                      }`}
                      style={{
                        background:
                          provider === 'WAVEPAY'
                            ? 'rgba(234, 179, 8, 0.15)'
                            : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-white">WavePay</span>
                        {provider === 'WAVEPAY' && (
                          <i className="bi bi-check-circle-fill text-warning"></i>
                        )}
                      </div>
                      <div className="text-white-50 small mb-1">ဖုန်းနံပါတ်: 09-792003344</div>
                      <div className="text-secondary small">အမည်: Phone Shop Waves</div>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div className="col-sm-6">
                    <div
                      onClick={() => setProvider('BANK_TRANSFER')}
                      className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${
                        provider === 'BANK_TRANSFER'
                          ? 'border border-info'
                          : 'border border-dark border-opacity-50'
                      }`}
                      style={{
                        background:
                          provider === 'BANK_TRANSFER'
                            ? 'rgba(6, 182, 212, 0.15)'
                            : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-white">Bank Transfer</span>
                        {provider === 'BANK_TRANSFER' && (
                          <i className="bi bi-check-circle-fill text-info"></i>
                        )}
                      </div>
                      <div className="text-white-50 small mb-1">KBZ Bank: 0123 4567 8901</div>
                      <div className="text-secondary small">CB Bank: 0098 7654 3210</div>
                    </div>
                  </div>

                  {/* Cash On Delivery */}
                  <div className="col-sm-6">
                    <div
                      onClick={() => setProvider('COD')}
                      className={`p-3 rounded-3 cursor-pointer h-100 transition-all ${
                        provider === 'COD'
                          ? 'border border-success'
                          : 'border border-dark border-opacity-50'
                      }`}
                      style={{
                        background:
                          provider === 'COD'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-white">Cash on Delivery</span>
                        {provider === 'COD' && (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        )}
                      </div>
                      <div className="text-white-50 small mb-1">ပစ္စည်းရောက်မှ ငွေချေရန်</div>
                      <div className="text-secondary small">ရန်ကုန်/မန္တလေး မြို့တွင်း</div>
                    </div>
                  </div>
                </div>

                {/* Form fields based on selected method */}
                {provider !== 'COD' && (
                  <div className="space-y-3 mb-4">
                    <div className="mb-3">
                      <label className="form-label text-white small fw-bold">
                        Transaction ID (ငွေလွှဲ အမှတ်အသား) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control bento-input"
                        placeholder="ဥပမာ- 2026032488921"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                      />
                      <div className="form-text text-secondary small">
                        KPay / WavePay တွင် ပြသသော Transaction No သို့မဟုတ် နောက်ဆုံး ဂဏန်း ၆ လုံး ထည့်သွင်းပေးပါ။
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-white small fw-bold">
                        Payment Slip URL (ငွေလွှဲပြေစာ ဓာတ်ပုံ Link)
                      </label>
                      <div className="input-group">
                        <input
                          type="url"
                          className="form-control bento-input"
                          placeholder="https://example.com/slip.jpg"
                          value={slipUrl}
                          onChange={(e) => setSlipUrl(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            setSlipUrl(
                              'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
                            )
                          }
                        >
                          Use Demo Slip
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {provider === 'COD' && (
                  <div className="alert alert-info bg-opacity-10 border-info text-info small mb-4">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Cash on Delivery ကို ရွေးချယ်ထားပါသည်။ ပို့ဆောင်သူထံသို့ ပစ္စည်းလက်ခံရရှိချိန်တွင် ငွေကျပ်{' '}
                    <strong>{order?.totalAmount.toLocaleString()} MMK</strong> ပေးချေပေးရပါမည်။
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-bento-primary w-100 py-3 fw-bold"
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      ငွေလွှဲအချက်အလက် ပေးပို့နေပါသည်...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      ငွေပေးချေမှု အတည်ပြုပေးပို့မည်
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
