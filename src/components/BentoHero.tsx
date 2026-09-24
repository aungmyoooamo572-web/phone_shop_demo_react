import React from 'react';

export const BentoHero: React.FC = () => {
  return (
    <section className="py-4 py-md-5">
      <div className="container">
        {/* Top Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
          <div>
            <span className="badge-tech mb-2 d-inline-block">
              <i className="bi bi-cpu me-1"></i> NEXT-GEN SMARTPHONES
            </span>
            <h1 className="fw-black display-6 text-white mb-1">
              Engineered for Extreme Performance.
            </h1>
            <p className="text-secondary mb-0 small">
              စွမ်းဆောင်ရည်မြင့် Flagship ဖုန်းများ၊ စစ်မှန်သော Official Warranty နှင့် အကောင်းဆုံးဈေးနှုန်းများ။
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <a href="#phone-catalog" className="btn btn-bento-primary">
              <i className="bi bi-grid-3x3-gap me-2"></i> Browse All Phones
            </a>
          </div>
        </div>

        {/* Bento Grid Container */}
        <div className="row g-3">
          {/* Main Hero Tile (Large 8 cols on desktop) */}
          <div className="col-12 col-lg-8">
            <div
              className="bento-card p-4 p-md-5 h-100 position-relative d-flex flex-column justify-content-between"
              style={{
                background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25) 0%, rgba(17, 24, 39, 1) 70%)',
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge-cyan mb-2 d-inline-block">Flagship AI Series</span>
                  <h2 className="text-white fw-bold display-6 mb-2">Galaxy S25 Ultra & iPhone 16 Pro</h2>
                  <p className="text-secondary small max-w-lg mb-4">
                    Snapdragon 8 Elite နှင့် A18 Pro 3nm Chips များပါဝင်သော ခေတ်အမီဆုံး စမတ်ဖုန်းအသစ်များကို အထူးပရိုမိုးရှင်းဖြင့် ရရှိနိုင်ပါပြီ။
                  </p>
                </div>
                <div className="display-4 text-info opacity-75 d-none d-sm-block">
                  <i className="bi bi-stars"></i>
                </div>
              </div>

              {/* Sub-spec tiles inside hero */}
              <div className="row g-2 mt-auto">
                <div className="col-4">
                  <div className="bento-spec-tile text-center">
                    <span className="text-secondary d-block" style={{ fontSize: '11px' }}>PROCESSOR</span>
                    <strong className="text-white fs-6">3nm Elite</strong>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bento-spec-tile text-center">
                    <span className="text-secondary d-block" style={{ fontSize: '11px' }}>CAMERA</span>
                    <strong className="text-info fs-6">200 MP Ultra</strong>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bento-spec-tile text-center">
                    <span className="text-secondary d-block" style={{ fontSize: '11px' }}>DISPLAY</span>
                    <strong className="text-white fs-6">120Hz LTPO</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Bento Tiles (4 cols) */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-3 h-100">
              {/* Tile: Fast Checkout & Payment */}
              <div className="bento-card p-4 flex-grow-1" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(17, 24, 39, 1) 100%)' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="rounded-3 p-2 text-info fs-4 bg-dark border border-secondary">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-0">Instant Payment Verification</h6>
                    <span className="text-secondary small">KBZPay / WavePay Instant</span>
                  </div>
                </div>
                <p className="text-secondary small mb-0 mt-2">
                  အွန်လိုင်းမှ ငွေလွှဲပြေစာတင်ပြီးသည်နှင့် မိနစ်ပိုင်းအတွင်း Admin မှ စစ်ဆေးအတည်ပြုပေးပါသည်။
                </p>
              </div>

              {/* Tile: Doorstep Delivery */}
              <div className="bento-card p-4 flex-grow-1" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 24, 39, 1) 100%)' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="rounded-3 p-2 text-success fs-4 bg-dark border border-secondary">
                    <i className="bi bi-truck"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-0">Live Order Tracking</h6>
                    <span className="text-secondary small">Doorstep Delivery</span>
                  </div>
                </div>
                <p className="text-secondary small mb-0 mt-2">
                  ပို့ဆောင်မှုအဆင့်ဆင့်နှင့် Tracking Number အား My Orders တွင် အချိန်နှင့်တပြေးညီ ကြည့်ရှုနိုင်ပါသည်။
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
