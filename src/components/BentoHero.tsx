import React from 'react';

export const BentoHero: React.FC = () => {
  return (
    <section className="py-4 py-lg-5 position-relative">
      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* Top Header Badge & Intro */}
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 mb-2">
              <span className="badge-tech">
                <span className="pulse-dot pulse-emerald"></span>
                <span>FLAGSHIP 2026 EDITION</span>
              </span>
              <span className="badge-cyan d-none d-sm-inline-flex">
                <i className="bi bi-shield-check"></i> OFFICIAL WARRANTY
              </span>
            </div>
            <h1 className="fw-black display-5 text-white mb-2 tracking-tight">
              Next-Gen Flagship <span className="gradient-text-cyan">Smartphones.</span>
            </h1>
            <p className="text-secondary mb-0 small" style={{ maxWidth: '620px', lineHeight: '1.6' }}>
              ခေတ်မီဆန်းသစ်သော 3nm Chipsets၊ 200MP Pro Cameras နှင့် Titanium Body ပါဝင်သည့် စစ်မှန်သော Official Warranty အပြည့်အစုံဖြင့် အတန်ဆုံးဈေးနှုန်းများ။
            </p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <a href="#phone-catalog" className="btn btn-tech-primary">
              <i className="bi bi-grid-3x3-gap"></i>
              <span>Explore Catalog</span>
            </a>
          </div>
        </div>

        {/* Bento Grid Showcase */}
        <div className="row g-3">
          {/* Grand Hero Bento Card (8 Cols) */}
          <div className="col-12 col-lg-8">
            <div
              className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse at 85% 20%, rgba(99, 102, 241, 0.28) 0%, rgba(6, 182, 212, 0.1) 40%, rgba(15, 23, 42, 0.95) 85%)',
                minHeight: '380px',
              }}
            >
              {/* Subtle tech background grid effect */}
              <div
                className="position-absolute top-0 end-0 p-4 opacity-25 d-none d-sm-block pointer-events-none"
                style={{ fontSize: '7rem', lineHeight: '1', color: '#6366f1' }}
              >
                <i className="bi bi-cpu"></i>
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge-cyan">
                    <i className="bi bi-stars me-1"></i> AI Pro Generation
                  </span>
                  <span className="badge bg-dark border border-secondary text-secondary small py-1 px-2 rounded-pill">
                    Snapdragon 8 Elite • A18 Pro
                  </span>
                </div>

                <h2 className="text-white fw-black display-6 mb-2 tracking-tight">
                  Galaxy S25 Ultra & <br className="d-none d-sm-inline" />
                  iPhone 16 Pro Max
                </h2>
                <p className="text-secondary small mb-4" style={{ maxWidth: '520px', lineHeight: '1.6' }}>
                  အဆင့်မြင့်ဆုံး Silicon စွမ်းဆောင်ရည်၊ Studio-Grade ဓာတ်ပုံရိုက်ကူးနိုင်စွမ်းနှင့် တစ်နေ့တာလုံး အသုံးပြုနိုင်သော စွမ်းအင်သိုလှောင်မှု။
                </p>
              </div>

              {/* Hardware Spec Micro Tiles */}
              <div className="row g-2 mt-auto pt-3">
                <div className="col-4">
                  <div className="bento-spec-tile text-center">
                    <span className="text-secondary d-block" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                      PROCESSOR
                    </span>
                    <strong className="text-white small fw-bold">3nm Elite</strong>
                    <div className="text-info mt-1" style={{ fontSize: '11px' }}>
                      <i className="bi bi-lightning-charge-fill me-1"></i>4.32 GHz
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bento-spec-tile text-center">
                    <span className="text-secondary d-block" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                      OPTICS
                    </span>
                    <strong className="gradient-text-cyan small fw-bold">200 MP Ultra</strong>
                    <div className="text-secondary mt-1" style={{ fontSize: '11px' }}>
                      <i className="bi bi-camera-fill me-1"></i>Periscope 5x
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bento-spec-tile text-center">
                    <span className="text-secondary d-block" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                      DISPLAY
                    </span>
                    <strong className="text-white small fw-bold">120Hz LTPO</strong>
                    <div className="text-warning mt-1" style={{ fontSize: '11px' }}>
                      <i className="bi bi-brightness-high-fill me-1"></i>2600 nits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Bento Tiles (4 Cols) */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-3 h-100">
              {/* Tile 1: Instant Payment */}
              <div
                className="glass-card p-4 flex-grow-1 d-flex flex-column justify-content-between"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-info"
                      style={{
                        width: '42px',
                        height: '42px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                      }}
                    >
                      <i className="bi bi-qr-code fs-5"></i>
                    </div>
                    <span className="badge-emerald small">
                      <i className="bi bi-check2-circle me-1"></i> 0% Fee
                    </span>
                  </div>
                  <h6 className="text-white fw-bold mb-1">Instant Payment Verification</h6>
                  <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                    KBZPay နှင့် WavePay QR ဖြင့် အလွယ်တကူ ငွေလွှဲပေးချေနိုင်ပြီး Admin မှ မိနစ်ပိုင်းအတွင်း စစ်ဆေးအတည်ပြုပေးပါသည်။
                  </p>
                </div>
                <div className="d-flex gap-2 pt-3 border-top border-secondary border-opacity-25 mt-3">
                  <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-50 small">
                    KBZPay
                  </span>
                  <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 small">
                    WavePay
                  </span>
                  <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary small">
                    Cash on Delivery
                  </span>
                </div>
              </div>

              {/* Tile 2: Fast Track Delivery */}
              <div
                className="glass-card p-4 flex-grow-1 d-flex flex-column justify-content-between"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-success"
                      style={{
                        width: '42px',
                        height: '42px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <i className="bi bi-truck fs-5"></i>
                    </div>
                    <span className="badge-cyan small">Express</span>
                  </div>
                  <h6 className="text-white fw-bold mb-1">Nationwide Doorstep Delivery</h6>
                  <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                    ရန်ကုန်၊ မန္တလေးနှင့် မြို့ကြီးများအားလုံးသို့ အိမ်အရောက်ပို့ဆောင်ပေးပြီး Tracking နံပါတ်ဖြင့် အချိန်နှင့်တပြေးညီ ကြည့်ရှုနိုင်ပါသည်။
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25 mt-3 small text-secondary">
                  <span>
                    <i className="bi bi-geo-alt text-info me-1"></i> All Myanmar States
                  </span>
                  <span className="text-white fw-semibold">1-3 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
