import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-top border-secondary border-opacity-25 py-5 position-relative" style={{ background: 'rgba(7, 9, 14, 0.95)' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
                }}
              >
                <i className="bi bi-phone-fill fs-5"></i>
              </div>
              <div className="d-flex flex-column">
                <span className="fw-black text-white tracking-tight fs-5">
                  Aung Myo <span className="gradient-text-cyan">Oo</span>
                </span>
                <span className="text-secondary fw-semibold" style={{ fontSize: '9px', letterSpacing: '0.15em', marginTop: '-4px' }}>
                  TECH STORE
                </span>
              </div>
            </div>
            <p className="small text-secondary mb-3" style={{ lineHeight: '1.6' }}>
              မြန်မာနိုင်ငံ၏ စိတ်ချယုံကြည်ရဆုံး စမတ်ဖုန်းနှင့် နည်းပညာပစ္စည်းအရောင်းဆိုင်။ စစ်မှန်သော Official 1-Year Warranty အပြည့်ဖြင့် ဝယ်ယူရရှိနိုင်ပါသည်။
            </p>
            <div className="d-flex gap-3 text-secondary fs-5">
              <span className="cursor-pointer hover-text-cyan transition-all" style={{ cursor: 'pointer' }}>
                <i className="bi bi-facebook"></i>
              </span>
              <span className="cursor-pointer hover-text-cyan transition-all" style={{ cursor: 'pointer' }}>
                <i className="bi bi-telegram"></i>
              </span>
              <span className="cursor-pointer hover-text-cyan transition-all" style={{ cursor: 'pointer' }}>
                <i className="bi bi-tiktok"></i>
              </span>
              <span className="cursor-pointer hover-text-cyan transition-all" style={{ cursor: 'pointer' }}>
                <i className="bi bi-instagram"></i>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Shop Brands
            </h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/?search=Apple" className="text-secondary text-decoration-none hover-text-cyan">
                  Apple iPhone
                </Link>
              </li>
              <li>
                <Link to="/?search=Samsung" className="text-secondary text-decoration-none hover-text-cyan">
                  Samsung Galaxy
                </Link>
              </li>
              <li>
                <Link to="/?search=Xiaomi" className="text-secondary text-decoration-none hover-text-cyan">
                  Xiaomi / Redmi
                </Link>
              </li>
              <li>
                <Link to="/?search=Vivo" className="text-secondary text-decoration-none hover-text-cyan">
                  Vivo & OPPO
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Partners */}
          <div className="col-6 col-md-3">
            <h6 className="text-white fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Digital Payments
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-50 small">
                KBZPay
              </span>
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 small">
                WavePay
              </span>
              <span className="badge bg-info bg-opacity-25 text-white border border-info border-opacity-50 small">
                CBPay
              </span>
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 small">
                COD Delivery
              </span>
            </div>
            <p className="small text-secondary mb-0" style={{ fontSize: '11px', lineHeight: '1.5' }}>
              ရန်ကုန်၊ မန္တလေးနှင့် မြို့ကြီးများအားလုံးသို့ အိမ်အရောက် Express Doorstep ဖြင့် ပို့ဆောင်ပေးပါသည်။
            </p>
          </div>

          {/* Customer Support */}
          <div className="col-12 col-md-3">
            <h6 className="text-white fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Customer Support
            </h6>
            <p className="small text-secondary mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt text-info"></i>
              <span>Yangon & Mandalay, Myanmar</span>
            </p>
            <p className="small text-secondary mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-telephone text-info"></i>
              <span>+95 9 420 011 223</span>
            </p>
            <p className="small text-secondary mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-envelope text-info"></i>
              <span>support@aungmyooo-tech.com</span>
            </p>
            <div className="mt-2">
              <span className="badge-emerald small" style={{ fontSize: '10px' }}>
                <span className="pulse-dot pulse-emerald"></span> 24/7 Online Support
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-top border-secondary border-opacity-25 pt-4 text-center small text-secondary">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
            <div>
              &copy; {new Date().getFullYear()} <strong className="text-white">Aung Myo Oo Tech Store</strong>. All rights reserved.
            </div>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              Engineered with React 19 • Vite • Spring Boot 4
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
