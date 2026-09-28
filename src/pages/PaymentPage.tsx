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
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

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
      <div className="container py-5 text-center my-5">
        <div className="glass-card p-5 max-w-md mx-auto" style={{ maxWidth: '440px' }}>
          <i className="bi bi-wallet2 text-info display-4 mb-3"></i>
          <h4 className="text-white fw-bold mb-2">Order မတွေ့ရှိပါ</h4>
          <p className="text-secondary small mb-4">
            ငွေပေးချေလိုသော Order ကို သင်၏ Order စာရင်းမှ ရွေးချယ်ပေးပါ။
          </p>
          <Link to="/my-orders" className="btn btn-tech-primary">
            <i className="bi bi-bag-check me-2"></i> View My Orders
          </Link>
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
        <p className="text-secondary small mt-3">Loading order & payment details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="glass-card p-5 max-w-md mx-auto" style={{ maxWidth: '440px' }}>
          <i className="bi bi-exclamation-octagon text-danger display-4 mb-3"></i>
          <h4 className="text-white fw-bold mb-2">Order ရှာမတွေ့ပါ</h4>
          <p className="text-secondary small mb-4">{error || 'Order ID မှားယွင်းနေပါသည်။'}</p>
          <Link to="/my-orders" className="btn btn-tech-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 py-md-5 position-relative">
      <div className="container">
        {/* 3-Step Progress Indicator */}
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
              <span className="step-node completed">
                <i className="bi bi-check2"></i>
              </span>
              <span className="small text-secondary fw-semibold d-none d-sm-inline">2. Shipping</span>
            </div>
            <div className="step-line active"></div>
            <div className="d-flex align-items-center gap-2">
              <span className="step-node active">3</span>
              <span className="small text-white fw-bold d-none d-sm-inline">3. Payment</span>
            </div>
          </div>
        </div>

        {/* Order Details Banner */}
        <div className="glass-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge-tech small">ORDER ID: {order.id.substring(0, 8)}...</span>
                <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-50 small">
                  {order.status}
                </span>
                {hasVerifiedPayment && (
                  <span className="badge-emerald small">
                    <i className="bi bi-check2-circle me-1"></i> Payment Verified
                  </span>
                )}
              </div>
              <h4 className="text-white fw-bold mb-1">ငွေပေးချေမှု အတည်ပြုခြင်း</h4>
              <p className="text-secondary small mb-0">
                Shipping Address: <span className="text-white">{order.shippingAddress}</span>
              </p>
            </div>
            <div className="text-md-end">
              <span className="text-secondary small d-block" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                PAYABLE AMOUNT
              </span>
              <span className="display-6 fs-3 fw-black gradient-text-cyan">
                {order.totalAmount.toLocaleString()} MMK
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Notifications */}
        {successMsg && (
          <div className="glass-card border-success p-3 mb-4 d-flex align-items-center gap-2" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span className="text-white small fw-semibold">{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="glass-card border-danger text-danger p-3 mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill fs-5"></i>
            <span className="small">{error}</span>
          </div>
        )}

        <div className="row g-4">
          {/* Left: Payment Form & Account Details */}
          <div className="col-12 col-lg-7">
            <div className="glass-card p-4 p-md-5">
              <h5 className="text-white fw-bold mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                1. Select Payment Method
              </h5>

              {/* Provider Options */}
              <div className="row g-3 mb-4">
                {/* KBZPay */}
                <div className="col-6 col-sm-3">
                  <div
                    onClick={() => setProvider('KPAY')}
                    className={`p-3 rounded-3 text-center cursor-pointer transition-all ${
                      provider === 'KPAY'
                        ? 'border border-primary'
                        : 'border border-secondary border-opacity-25'
                    }`}
                    style={{
                      background: provider === 'KPAY' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-qr-code text-primary fs-3 d-block mb-1"></i>
                    <strong className="text-white small d-block">KBZPay</strong>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>Instant QR</span>
                  </div>
                </div>

                {/* WavePay */}
                <div className="col-6 col-sm-3">
                  <div
                    onClick={() => setProvider('WAVEPAY')}
                    className={`p-3 rounded-3 text-center cursor-pointer transition-all ${
                      provider === 'WAVEPAY'
                        ? 'border border-warning'
                        : 'border border-secondary border-opacity-25'
                    }`}
                    style={{
                      background: provider === 'WAVEPAY' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-wallet2 text-warning fs-3 d-block mb-1"></i>
                    <strong className="text-white small d-block">WavePay</strong>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>QR / Transfer</span>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="col-6 col-sm-3">
                  <div
                    onClick={() => setProvider('BANK_TRANSFER')}
                    className={`p-3 rounded-3 text-center cursor-pointer transition-all ${
                      provider === 'BANK_TRANSFER'
                        ? 'border border-info'
                        : 'border border-secondary border-opacity-25'
                    }`}
                    style={{
                      background: provider === 'BANK_TRANSFER' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-bank text-info fs-3 d-block mb-1"></i>
                    <strong className="text-white small d-block">Bank</strong>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>CB / KBZ Bank</span>
                  </div>
                </div>

                {/* COD */}
                <div className="col-6 col-sm-3">
                  <div
                    onClick={() => setProvider('COD')}
                    className={`p-3 rounded-3 text-center cursor-pointer transition-all ${
                      provider === 'COD'
                        ? 'border border-success'
                        : 'border border-secondary border-opacity-25'
                    }`}
                    style={{
                      background: provider === 'COD' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-cash-stack text-success fs-3 d-block mb-1"></i>
                    <strong className="text-white small d-block">COD</strong>
                    <span className="text-secondary" style={{ fontSize: '10px' }}>Cash On Delivery</span>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              {provider !== 'COD' && (
                <div
                  className="p-4 rounded-4 mb-4"
                  style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)' }}
                >
                  <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle text-info"></i>
                    <span>
                      {provider === 'KPAY' && 'KBZPay Account Details'}
                      {provider === 'WAVEPAY' && 'WavePay Account Details'}
                      {provider === 'BANK_TRANSFER' && 'Bank Transfer Details'}
                    </span>
                  </h6>

                  <div className="row g-3">
                    <div className="col-12 col-sm-7">
                      <div className="mb-2">
                        <span className="text-secondary small d-block" style={{ fontSize: '11px' }}>Account Name:</span>
                        <strong className="text-white">Aung Myo Oo (Phone Store)</strong>
                      </div>
                      <div className="mb-2">
                        <span className="text-secondary small d-block" style={{ fontSize: '11px' }}>Account Number / Phone:</span>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <code className="text-info fs-6 px-2 py-1 rounded bg-dark border border-secondary border-opacity-50">
                            {provider === 'KPAY' && '09420011223'}
                            {provider === 'WAVEPAY' && '09420011223'}
                            {provider === 'BANK_TRANSFER' && '204-101-0099887766'}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                provider === 'BANK_TRANSFER' ? '204-101-0099887766' : '09420011223',
                                'account'
                              )
                            }
                            className="btn btn-sm btn-tech-secondary px-2"
                            title="Copy number"
                          >
                            <i className="bi bi-clipboard"></i>{' '}
                            {copiedAccount === 'account' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-5 text-center">
                      <div
                        className="p-2 rounded-3 bg-white d-inline-block shadow-sm"
                        style={{ maxWidth: '120px' }}
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                            provider === 'KPAY'
                              ? 'kpay:09420011223'
                              : provider === 'WAVEPAY'
                              ? 'wave:09420011223'
                              : 'bank:2041010099887766'
                          )}`}
                          alt="QR Code"
                          className="img-fluid rounded"
                        />
                      </div>
                      <span className="d-block text-secondary small mt-1" style={{ fontSize: '10px' }}>
                        Scan QR Code to Pay
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Input for Verification */}
              <form onSubmit={handleSubmit}>
                {provider !== 'COD' ? (
                  <>
                    <div className="mb-3">
                      <label className="text-white small fw-bold mb-1">
                        Transaction ID / လွှဲပြေစာနံပါတ် <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-tech"
                        placeholder="ဥပမာ - 0123456789 (သို့မဟုတ် နောက်ဆုံးဂဏန်း ၆ လုံး)"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-secondary small fw-semibold mb-1">
                        Payment Slip Image URL (ငွေလွှဲပြေစာ ပုံလင့်ခ် - Optional)
                      </label>
                      <input
                        type="url"
                        className="form-control form-tech"
                        placeholder="https://example.com/slip.jpg"
                        value={slipUrl}
                        onChange={(e) => setSlipUrl(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-3 rounded-3 mb-4 bg-success bg-opacity-10 border border-success border-opacity-25 small text-secondary">
                    <i className="bi bi-check2-circle text-success me-1"></i>
                    ပစ္စည်းရောက်မှ ငွေချေစနစ်ကို ရွေးချယ်ထားပါသည်။ ပို့ဆောင်သူထံသို့ ငွေသားပေးချေနိုင်ပါသည်။
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-tech-primary w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Submitting Payment...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check fs-5"></i>
                      <span>Submit Payment Proof for Verification</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Payment Submissions History */}
          <div className="col-12 col-lg-5">
            <div className="glass-card p-4">
              <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                Payment History
              </h5>

              {existingPayments.length === 0 ? (
                <div className="text-center py-4 text-secondary small">
                  <i className="bi bi-receipt fs-2 d-block mb-2 text-secondary opacity-50"></i>
                  ငွေပေးချေမှု အချက်အလက် မတင်သွင်းရသေးပါ။
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {existingPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-3"
                      style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge badge-tech small">{p.provider}</span>
                        <span
                          className={`badge ${
                            p.status === 'VERIFIED'
                              ? 'bg-success'
                              : p.status === 'REJECTED'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          } small`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="small text-secondary mb-1">
                        Txn ID: <strong className="text-white">{p.transactionId || 'N/A'}</strong>
                      </div>
                      <div className="small text-secondary">
                        Submitted: {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 mt-3 border-top border-secondary border-opacity-25">
                <Link to="/my-orders" className="btn btn-tech-secondary w-100 py-2 small">
                  <i className="bi bi-arrow-left me-1"></i> Go to My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
