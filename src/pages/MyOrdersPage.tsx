import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { Order, OrderStatus } from '../types';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Orders စာရင်း ရယူရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 fw-semibold">Pending Payment</span>;
      case 'CONFIRMED':
        return <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 px-3 py-2 fw-semibold">Confirmed</span>;
      case 'PROCESSING':
        return <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-3 py-2 fw-semibold">Processing</span>;
      case 'SHIPPED':
        return <span className="badge bg-indigo bg-opacity-25 text-white border border-indigo px-3 py-2 fw-semibold" style={{ background: 'rgba(99, 102, 241, 0.25)', borderColor: '#6366f1' }}>Shipped</span>;
      case 'DELIVERED':
        return <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 fw-semibold">Delivered</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-3 py-2 fw-semibold">Cancelled</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status}</span>;
    }
  };

  const filteredOrders =
    filterStatus === 'ALL'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div
          className="spinner-border text-info"
          role="status"
          style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}
        ></div>
        <p className="text-secondary small mt-3">သင်၏ Orders များ ဖတ်ရှုနေပါသည်...</p>
      </div>
    );
  }

  return (
    <div className="py-4 py-md-5 position-relative">
      <div className="container">
        {/* Page Title & Stats */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <span className="badge-tech mb-2">
              <i className="bi bi-clock-history me-1"></i> Order History & Tracking
            </span>
            <h2 className="text-white fw-black mb-1 tracking-tight fs-3">ကျွန်ုပ်၏ Orders များ</h2>
            <p className="text-secondary small mb-0">
              မှာယူထားသော စမတ်ဖုန်းများ၏ အခြေအနေနှင့် Tracking နံပါတ်များကို စစ်ဆေးပါ
            </p>
          </div>
          <button onClick={fetchOrders} className="btn btn-tech-secondary btn-sm px-3">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {error && (
          <div className="glass-card border-danger text-danger p-3 mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill fs-5"></i>
            <span className="small">{error}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                filterStatus === status ? 'btn-tech-primary' : 'btn-tech-secondary'
              }`}
              style={{ fontSize: '12px' }}
            >
              {status}
              {status === 'ALL' && ` (${orders.length})`}
              {status !== 'ALL' && ` (${orders.filter((o) => o.status === status).length})`}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="glass-card p-5 text-center my-4">
            <i className="bi bi-bag-x text-secondary display-3 mb-3"></i>
            <h4 className="text-white fw-bold mb-2">Orders မတွေ့ရှိပါ</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
              {filterStatus === 'ALL'
                ? 'သင်သည် မည်သည့်ဖုန်းကိုမျှ မမှာယူရသေးပါ။ စတင်ဝယ်ယူလိုက်ပါ!'
                : `${filterStatus} အခြေအနေရှိသော Order မရှိသေးပါ။`}
            </p>
            <Link to="/" className="btn btn-tech-primary">
              <i className="bi bi-grid-3x3-gap me-2"></i> Explore Latest Phones
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="glass-card p-4">
                {/* Order Header */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pb-3 border-bottom border-secondary border-opacity-25">
                  <div>
                    <div className="text-secondary small">
                      Order ID:{' '}
                      <span className="text-white font-monospace fw-bold">{order.id}</span>
                    </div>
                    <div className="text-secondary small" style={{ fontSize: '11px' }}>
                      Date: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {getStatusBadge(order.status)}
                    {order.status === 'PENDING' && (
                      <Link
                        to={`/payment?orderId=${order.id}`}
                        className="btn btn-tech-primary btn-sm py-1 px-3"
                      >
                        <i className="bi bi-credit-card me-1"></i> Pay Now
                      </Link>
                    )}
                  </div>
                </div>

                {/* Tracking & Shipping Details */}
                <div className="row g-3 py-3 border-bottom border-secondary border-opacity-25">
                  <div className="col-md-6">
                    <div className="text-secondary small mb-1" style={{ fontSize: '11px' }}>
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i> Shipping Address
                    </div>
                    <div className="text-white small">{order.shippingAddress}</div>
                    {order.notes && (
                      <div className="text-secondary small mt-1" style={{ fontSize: '11px' }}>
                        <em>Note: {order.notes}</em>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <div className="text-secondary small mb-1" style={{ fontSize: '11px' }}>
                      <i className="bi bi-truck text-info me-1"></i> Delivery / Tracking
                    </div>
                    {order.trackingNumber ? (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-pill bg-dark border border-info text-info font-monospace px-3 py-2">
                          <i className="bi bi-box-seam me-1"></i> {order.trackingNumber}
                        </span>
                      </div>
                    ) : (
                      <div className="text-secondary small">
                        {order.status === 'PENDING'
                          ? 'ငွေလွှဲအတည်ပြုပြီးပါက Tracking နံပါတ် ထုတ်ပေးပါမည်။'
                          : 'Tracking နံပါတ် မကြာမီ ထည့်သွင်းပေးပါမည်။'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="table-responsive pt-3">
                  <table className="table table-dark table-borderless align-middle mb-0" style={{ background: 'transparent' }}>
                    <thead>
                      <tr className="text-secondary small border-bottom border-secondary border-opacity-25">
                        <th>Phone Model</th>
                        <th>SKU</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="small">
                          <td className="text-white fw-bold">{item.productName}</td>
                          <td className="text-secondary font-monospace" style={{ fontSize: '11px' }}>{item.sku}</td>
                          <td className="text-center text-white">{item.quantity}</td>
                          <td className="text-end text-white-50">
                            {item.price.toLocaleString()} MMK
                          </td>
                          <td className="text-end text-white fw-bold">
                            {item.subtotal.toLocaleString()} MMK
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-top border-secondary border-opacity-25">
                        <td colSpan={4} className="text-end text-white fw-bold pt-3">
                          Total Amount:
                        </td>
                        <td className="text-end pt-3">
                          <span className="gradient-text-cyan fs-5 fw-black">
                            {order.totalAmount.toLocaleString()} MMK
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
