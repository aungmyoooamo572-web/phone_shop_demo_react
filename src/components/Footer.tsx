import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-top border-secondary py-5 bg-dark text-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                }}
              >
                <i className="bi bi-phone"></i>
              </div>
              <span className="fw-bold text-white tracking-tight">PHONE<span className="text-info">STORE</span></span>
            </div>
            <p className="small mb-2">
              မြန်မာနိုင်ငံ၏ စိတ်ချယုံကြည်ရဆုံး စမတ်ဖုန်းနှင့် နည်းပညာပစ္စည်းအရောင်းဆိုင်။ စစ်မှန်သော Official Warranty အပြည့်ဖြင့် ဝယ်ယူရရှိနိုင်ပါသည်။
            </p>
            <div className="d-flex gap-3 text-light fs-5 mt-3">
              <i className="bi bi-facebook cursor-pointer"></i>
              <i className="bi bi-telegram cursor-pointer"></i>
              <i className="bi bi-tiktok cursor-pointer"></i>
              <i className="bi bi-instagram cursor-pointer"></i>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Shop Brands</h6>
            <ul className="list-unstyled small space-y-2">
              <li className="mb-2"><span className="text-decoration-none text-secondary">Apple iPhone</span></li>
              <li className="mb-2"><span className="text-decoration-none text-secondary">Samsung Galaxy</span></li>
              <li className="mb-2"><span className="text-decoration-none text-secondary">Xiaomi / Redmi</span></li>
              <li className="mb-2"><span className="text-decoration-none text-secondary">OPPO & Vivo</span></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Payments & Delivery</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-primary text-white">KBZPay</span>
              <span className="badge bg-warning text-dark">WavePay</span>
              <span className="badge bg-info text-dark">CBPay</span>
              <span className="badge bg-success text-white">Cash on Delivery</span>
            </div>
            <p className="small mb-0">ရန်ကုန်၊ မန္တလေးနှင့် မြို့ကြီးများအားလုံးသို့ အိမ်အရောက်ပို့ဆောင်ပေးပါသည်။</p>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Customer Support</h6>
            <p className="small mb-1"><i className="bi bi-geo-alt me-2 text-info"></i> Yangon, Myanmar</p>
            <p className="small mb-1"><i className="bi bi-telephone me-2 text-info"></i> +95 9 123 456 789</p>
            <p className="small mb-1"><i className="bi bi-envelope me-2 text-info"></i> support@phonestore.com</p>
          </div>
        </div>

        <div className="border-top border-secondary mt-5 pt-4 text-center small text-secondary">
          &copy; {new Date().getFullYear()} PHONE STORE. All rights reserved. Powered by Spring Boot 4 & React Vite.
        </div>
      </div>
    </footer>
  );
};
