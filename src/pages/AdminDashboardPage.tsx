import React, { useEffect, useState } from 'react';
import { phoneService } from '../services/phoneService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import type { Phone, Order, Payment, OrderStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'payments'>('inventory');

  // Inventory state
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loadingPhones, setLoadingPhones] = useState(false);

  // Order management state
  const [orderSearchId, setOrderSearchId] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderPayments, setOrderPayments] = useState<Payment[]>([]);
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [orderActionLoading, setOrderActionLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  // Direct payment lookup state
  const [directPaymentId, setDirectPaymentId] = useState('');
  const [directPayment, setDirectPayment] = useState<Payment | null>(null);
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  // Initial load
  useEffect(() => {
    loadPhones();
  }, []);

  const loadPhones = async () => {
    try {
      setLoadingPhones(true);
      const data = await phoneService.getAllPhones();
      setPhones(data);
    } catch (err) {
      console.error('Failed to load phones:', err);
    } finally {
      setLoadingPhones(false);
    }
  };

  // Lookup Order by ID
  const handleSearchOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderSearchId.trim()) return;

    try {
      setOrderActionLoading(true);
      setOrderMsg(null);
      const id = orderSearchId.trim();
      const order = await orderService.getOrderById(id);
      setCurrentOrder(order);
      setNewStatus(order.status);
      setTrackingNumberInput(order.trackingNumber || '');

      // Load associated payments
      const payments = await paymentService.getPaymentsByOrder(id).catch(() => []);
      setOrderPayments(payments);
    } catch (err: any) {
      setOrderMsg({
        text: err?.response?.data?.message || 'Order ရှာမတွေ့ပါ သို့မဟုတ် ID မှားယွင်းနေပါသည်။',
        type: 'danger',
      });
      setCurrentOrder(null);
      setOrderPayments([]);
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Update Status
  const handleUpdateStatus = async () => {
    if (!currentOrder) return;
    try {
      setOrderActionLoading(true);
      setOrderMsg(null);
      const updated = await orderService.updateOrderStatus(currentOrder.id, newStatus);
      setCurrentOrder(updated);
      setOrderMsg({
        text: `Order status ကို ${newStatus} သို့ အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။`,
        type: 'success',
      });
    } catch (err: any) {
      setOrderMsg({
        text: err?.response?.data?.message || 'Status ပြောင်းလဲရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။',
        type: 'danger',
      });
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Update Tracking Number
  const handleUpdateTracking = async () => {
    if (!currentOrder || !trackingNumberInput.trim()) return;
    try {
      setOrderActionLoading(true);
      setOrderMsg(null);
      const updated = await orderService.updateTrackingNumber(
        currentOrder.id,
        trackingNumberInput.trim()
      );
      setCurrentOrder(updated);
      setOrderMsg({
        text: `Tracking Number "${trackingNumberInput.trim()}" ကို ထည့်သွင်းပြီးပါပြီ။`,
        type: 'success',
      });
    } catch (err: any) {
      setOrderMsg({
        text: err?.response?.data?.message || 'Tracking number ထည့်သွင်းရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်။',
        type: 'danger',
      });
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Direct Payment Verification
  const handleVerifyPayment = async (paymentId: string) => {
    try {
      setPaymentActionLoading(true);
      setPaymentMsg(null);
      const verified = await paymentService.verifyPayment(paymentId);
      setPaymentMsg({
        text: `Payment ${paymentId.substring(0, 8)} ကို အောင်မြင်စွာ VERIFIED ပြုလုပ်ပြီးပါပြီ။ စတော့ပစ္စည်း လျှော့ချပြီး Order ကို အတည်ပြုပြီးပါပြီ။`,
        type: 'success',
      });

      // Update state if in orderPayments
      setOrderPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? verified : p))
      );
      if (directPayment?.id === paymentId) {
        setDirectPayment(verified);
      }
      // Reload phones to show reduced stock
      loadPhones();
      // If current order matches, re-fetch order
      if (currentOrder) {
        handleSearchOrder();
      }
    } catch (err: any) {
      setPaymentMsg({
        text: err?.response?.data?.message || 'Payment စစ်ဆေးအတည်ပြုရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်။',
        type: 'danger',
      });
    } finally {
      setPaymentActionLoading(false);
    }
  };

  // Direct Payment Rejection
  const handleRejectPayment = async (paymentId: string) => {
    try {
      setPaymentActionLoading(true);
      setPaymentMsg(null);
      const rejected = await paymentService.rejectPayment(paymentId);
      setPaymentMsg({
        text: `Payment ${paymentId.substring(0, 8)} ကို ပယ်ချ (REJECTED) လိုက်ပါပြီ။`,
        type: 'danger',
      });

      setOrderPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? rejected : p))
      );
      if (directPayment?.id === paymentId) {
        setDirectPayment(rejected);
      }
    } catch (err: any) {
      setPaymentMsg({
        text: err?.response?.data?.message || 'Payment ပယ်ချရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်။',
        type: 'danger',
      });
    } finally {
      setPaymentActionLoading(false);
    }
  };

  // Lookup single payment by ID
  const handleSearchPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPaymentId.trim()) return;
    try {
      setPaymentActionLoading(true);
      setPaymentMsg(null);
      const p = await paymentService.getPaymentById(directPaymentId.trim());
      setDirectPayment(p);
    } catch (err: any) {
      setPaymentMsg({
        text: err?.response?.data?.message || 'Payment ID ရှာမတွေ့ပါ သို့မဟုတ် မမှန်ကန်ပါ။',
        type: 'danger',
      });
      setDirectPayment(null);
    } finally {
      setPaymentActionLoading(false);
    }
  };

  // Stats calculation
  const totalVariants = phones.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
  const lowStockCount = phones.reduce(
    (acc, p) => acc + (p.variants?.filter((v) => v.stock < 5).length || 0),
    0
  );

  return (
    <div className="container py-4">
      {/* Admin Dashboard Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-3 py-1 mb-2">
            Admin Control Center
          </span>
          <h2 className="text-white fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-secondary small mb-0">
            စတော့လက်ကျန်များ၊ Orders အခြေအနေနှင့် ငွေလွှဲစစ်ဆေး အတည်ပြုခြင်းများ စီမံရန်
          </p>
        </div>
      </div>

      {/* Bento Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bento-card p-3 d-flex align-items-center gap-3">
            <div
              className="rounded-3 p-3 text-primary"
              style={{ background: 'rgba(79, 70, 229, 0.15)' }}
            >
              <i className="bi bi-phone fs-3"></i>
            </div>
            <div>
              <div className="text-secondary small">Total Phones</div>
              <div className="text-white fs-3 fw-bold">{phones.length} Models</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bento-card p-3 d-flex align-items-center gap-3">
            <div
              className="rounded-3 p-3 text-cyan"
              style={{ background: 'rgba(6, 182, 212, 0.15)' }}
            >
              <i className="bi bi-layers fs-3"></i>
            </div>
            <div>
              <div className="text-secondary small">Total Phone Variants</div>
              <div className="text-white fs-3 fw-bold">{totalVariants} SKUs</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bento-card p-3 d-flex align-items-center gap-3">
            <div
              className="rounded-3 p-3 text-warning"
              style={{ background: 'rgba(234, 179, 8, 0.15)' }}
            >
              <i className="bi bi-exclamation-diamond fs-3"></i>
            </div>
            <div>
              <div className="text-secondary small">Low Stock Alert (&lt; 5)</div>
              <div className="text-white fs-3 fw-bold">{lowStockCount} Variants</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex gap-2 border-bottom border-dark border-opacity-50 pb-3 mb-4">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`btn ${activeTab === 'inventory' ? 'btn-bento-primary' : 'btn-bento-outline'}`}
        >
          <i className="bi bi-boxes me-2"></i> Inventory & Stock
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-bento-primary' : 'btn-bento-outline'}`}
        >
          <i className="bi bi-truck me-2"></i> Order & Delivery Management
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`btn ${activeTab === 'payments' ? 'btn-bento-primary' : 'btn-bento-outline'}`}
        >
          <i className="bi bi-shield-check me-2"></i> Verify Payments
        </button>
      </div>

      {/* Tab 1: Inventory & Stock */}
      {activeTab === 'inventory' && (
        <div className="bento-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white fw-bold mb-0">Phone Stock Status</h5>
            <button onClick={loadPhones} className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-clockwise me-1"></i> Reload Stock
            </button>
          </div>

          {loadingPhones ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small border-bottom border-dark border-opacity-50">
                    <th>Phone Model</th>
                    <th>Brand</th>
                    <th>Color</th>
                    <th>RAM / Storage</th>
                    <th>SKU</th>
                    <th className="text-end">Price</th>
                    <th className="text-center">Stock Available</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {phones.map((phone) =>
                    phone.variants.map((v) => (
                      <tr key={v.id} className="small">
                        <td className="text-white fw-bold">{phone.name}</td>
                        <td className="text-white-50">{phone.brand?.name || 'N/A'}</td>
                        <td>
                          <span className="badge bg-dark border border-secondary text-white">
                            {v.color}
                          </span>
                        </td>
                        <td className="text-cyan font-monospace">
                          {v.ram} / {v.storage}
                        </td>
                        <td className="text-secondary font-monospace">{v.sku}</td>
                        <td className="text-end fw-bold">{v.price.toLocaleString()} MMK</td>
                        <td className="text-center">
                          <span
                            className={`badge px-3 py-1 font-monospace ${
                              v.stock === 0
                                ? 'bg-danger'
                                : v.stock < 5
                                ? 'bg-warning text-dark'
                                : 'bg-success'
                            }`}
                          >
                            {v.stock} units
                          </span>
                        </td>
                        <td className="text-center">
                          {v.stock > 0 ? (
                            <span className="text-success small">In Stock</span>
                          ) : (
                            <span className="text-danger small">Out of Stock</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Order & Delivery Management */}
      {activeTab === 'orders' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="bento-card p-4">
              <h5 className="text-white fw-bold mb-3">Order ရှာဖွေရန်</h5>
              <form onSubmit={handleSearchOrder} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bento-input"
                    placeholder="Enter Order UUID..."
                    value={orderSearchId}
                    onChange={(e) => setOrderSearchId(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={orderActionLoading}
                    className="btn btn-bento-primary"
                  >
                    Search
                  </button>
                </div>
              </form>

              {orderMsg && (
                <div
                  className={`alert alert-${orderMsg.type} bg-opacity-25 border-${orderMsg.type} small py-2 mb-3`}
                >
                  {orderMsg.text}
                </div>
              )}

              {currentOrder && (
                <div className="space-y-3">
                  <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-dark border-opacity-50">
                    <div className="text-secondary small">Order ID:</div>
                    <div className="text-white font-monospace small mb-2">{currentOrder.id}</div>

                    <div className="d-flex justify-content-between small text-secondary py-1 border-bottom border-dark border-opacity-25">
                      <span>Status:</span>
                      <span className="badge bg-primary">{currentOrder.status}</span>
                    </div>

                    <div className="d-flex justify-content-between small text-secondary py-1 border-bottom border-dark border-opacity-25">
                      <span>Total:</span>
                      <span className="text-white fw-bold">
                        {currentOrder.totalAmount.toLocaleString()} MMK
                      </span>
                    </div>

                    <div className="d-flex justify-content-between small text-secondary py-1">
                      <span>Address:</span>
                      <span className="text-white-50 text-end" style={{ maxWidth: '200px' }}>
                        {currentOrder.shippingAddress}
                      </span>
                    </div>
                  </div>

                  {/* Update Status form */}
                  <div className="mt-3">
                    <label className="form-label text-white small fw-bold">
                      Order Status အဆင့် ပြောင်းလဲရန်:
                    </label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select bento-input"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button
                        onClick={handleUpdateStatus}
                        disabled={orderActionLoading}
                        className="btn btn-sm btn-bento-primary text-nowrap"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Update Tracking Number form */}
                  <div className="mt-3">
                    <label className="form-label text-white small fw-bold">
                      Tracking Number ထည့်သွင်းရန်:
                    </label>
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control bento-input"
                        placeholder="e.g. REX-982310 (Royal Express)"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                      />
                      <button
                        onClick={handleUpdateTracking}
                        disabled={orderActionLoading || !trackingNumberInput.trim()}
                        className="btn btn-sm btn-bento-primary text-nowrap"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="bento-card p-4">
              <h5 className="text-white fw-bold mb-3">Order Items & Payments</h5>

              {!currentOrder ? (
                <div className="text-secondary small text-center py-5">
                  ဘယ်ဘက်တွင် Order ID ကို ထည့်သွင်း၍ ရှာဖွေပေးပါ။
                </div>
              ) : (
                <div>
                  <h6 className="text-white-50 small fw-bold text-uppercase mb-2">Ordered Items</h6>
                  <div className="table-responsive mb-4">
                    <table className="table table-dark table-borderless small mb-0">
                      <thead>
                        <tr className="border-bottom border-dark border-opacity-50 text-secondary">
                          <th>Item</th>
                          <th>SKU</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="text-white">{item.productName}</td>
                            <td className="text-secondary font-monospace">{item.sku}</td>
                            <td className="text-center text-white">{item.quantity}</td>
                            <td className="text-end text-white fw-bold">
                              {item.subtotal.toLocaleString()} MMK
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h6 className="text-white-50 small fw-bold text-uppercase mb-2">
                    Payment Slips & Actions
                  </h6>
                  {orderPayments.length === 0 ? (
                    <div className="alert alert-dark bg-opacity-50 small text-secondary">
                      ဤ Order အတွက် ငွေလွှဲပေးပို့ထားခြင်း မရှိသေးပါ။
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {orderPayments.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-3"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
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

                          <div className="small text-secondary font-monospace mb-1">
                            Txn ID: <span className="text-white">{p.transactionId || 'None'}</span>
                          </div>

                          <div className="small text-secondary mb-2">
                            Amount: <span className="text-white fw-bold">{p.amount.toLocaleString()} MMK</span>
                          </div>

                          {p.paymentSlipUrl && (
                            <div className="mb-3">
                              <a
                                href={p.paymentSlipUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-info btn-sm py-0 px-2"
                              >
                                <i className="bi bi-box-arrow-up-right me-1"></i> View Slip Image
                              </a>
                            </div>
                          )}

                          {p.status === 'PENDING' && (
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => handleVerifyPayment(p.id)}
                                disabled={paymentActionLoading}
                                className="btn btn-success btn-sm flex-fill"
                              >
                                <i className="bi bi-check2-circle me-1"></i> Verify & Confirm Order
                              </button>
                              <button
                                onClick={() => handleRejectPayment(p.id)}
                                disabled={paymentActionLoading}
                                className="btn btn-outline-danger btn-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Direct Payment Verification */}
      {activeTab === 'payments' && (
        <div className="row g-4">
          <div className="col-lg-6 mx-auto">
            <div className="bento-card p-4">
              <h5 className="text-white fw-bold mb-3">Direct Payment Verification</h5>
              <p className="text-secondary small mb-3">
                Payment ID ဖြင့် တိုက်ရိုက်ရှာဖွေပြီး စစ်ဆေးအတည်ပြုရန် (Verify) သို့မဟုတ် ပယ်ချရန် (Reject)
              </p>

              <form onSubmit={handleSearchPayment} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bento-input"
                    placeholder="Enter Payment UUID..."
                    value={directPaymentId}
                    onChange={(e) => setDirectPaymentId(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={paymentActionLoading}
                    className="btn btn-bento-primary"
                  >
                    Lookup
                  </button>
                </div>
              </form>

              {paymentMsg && (
                <div
                  className={`alert alert-${paymentMsg.type} bg-opacity-25 border-${paymentMsg.type} small py-2 mb-3`}
                >
                  {paymentMsg.text}
                </div>
              )}

              {directPayment && (
                <div className="p-4 rounded-3 bg-dark bg-opacity-50 border border-dark border-opacity-50">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-secondary fs-6">{directPayment.provider}</span>
                    <span
                      className={`badge px-3 py-1 ${
                        directPayment.status === 'VERIFIED'
                          ? 'bg-success'
                          : directPayment.status === 'REJECTED'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {directPayment.status}
                    </span>
                  </div>

                  <div className="small text-secondary mb-2">
                    Payment ID: <span className="text-white font-monospace">{directPayment.id}</span>
                  </div>
                  <div className="small text-secondary mb-2">
                    Order ID: <span className="text-cyan font-monospace">{directPayment.orderId}</span>
                  </div>
                  <div className="small text-secondary mb-2">
                    Amount:{' '}
                    <span className="text-white fw-bold">
                      {directPayment.amount.toLocaleString()} MMK
                    </span>
                  </div>
                  <div className="small text-secondary mb-3">
                    Transaction ID:{' '}
                    <span className="text-white font-monospace">
                      {directPayment.transactionId || 'N/A'}
                    </span>
                  </div>

                  {directPayment.paymentSlipUrl && (
                    <div className="mb-4">
                      <div className="text-secondary small mb-1">Payment Slip:</div>
                      <a
                        href={directPayment.paymentSlipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-info btn-sm"
                      >
                        <i className="bi bi-image me-1"></i> Open Slip In New Tab
                      </a>
                    </div>
                  )}

                  {directPayment.status === 'PENDING' ? (
                    <div className="d-flex gap-3">
                      <button
                        onClick={() => handleVerifyPayment(directPayment.id)}
                        disabled={paymentActionLoading}
                        className="btn btn-success flex-fill fw-bold"
                      >
                        <i className="bi bi-check2-circle me-1"></i> Verify Payment
                      </button>
                      <button
                        onClick={() => handleRejectPayment(directPayment.id)}
                        disabled={paymentActionLoading}
                        className="btn btn-outline-danger"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-secondary small pt-2">
                      ဤငွေပေးချေမှုသည် <strong>{directPayment.status}</strong> အခြေအနေသို့ ရောက်ရှိပြီးဖြစ်ပါသည်။
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
