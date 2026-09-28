import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Brand, Category, Phone } from '../types';
import { phoneService } from '../services/phoneService';
import { BentoHero } from '../components/BentoHero';
import { PhoneCard } from '../components/PhoneCard';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [phones, setPhones] = useState<Phone[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          phoneService.getBrands(),
          phoneService.getCategories(),
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch {
        // Fallback silently if metadata fails
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: Phone[] = [];
        if (search.trim()) {
          data = await phoneService.searchPhones(search.trim());
        } else if (selectedBrand !== 'all') {
          data = await phoneService.getPhonesByBrand(selectedBrand);
        } else if (selectedCategory !== 'all') {
          data = await phoneService.getPhonesByCategory(selectedCategory);
        } else {
          data = await phoneService.getAllPhones();
        }
        setPhones(data);
      } catch {
        setError('ဖုန်းစာရင်းများ ရယူရာတွင် အဆင်မပြေဖြစ်နေပါသည်။ Backend Server အလုပ်လုပ်နေခြင်း ရှိမရှိ စစ်ဆေးပေးပါ။');
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, [search, selectedBrand, selectedCategory]);

  const clearSearchFilter = () => {
    setSearchParams({});
    setSelectedBrand('all');
    setSelectedCategory('all');
  };

  // Sorting
  const sortedPhones = [...phones].sort((a, b) => {
    if (sortBy === 'default') return 0;
    const aPrices = a.variants?.map((v) => v.price) || [];
    const bPrices = b.variants?.map((v) => v.price) || [];
    const aMin = aPrices.length > 0 ? Math.min(...aPrices) : 0;
    const bMin = bPrices.length > 0 ? Math.min(...bPrices) : 0;
    if (sortBy === 'price-asc') return aMin - bMin;
    if (sortBy === 'price-desc') return bMin - aMin;
    return 0;
  });

  return (
    <div>
      {/* Bento Hero Section */}
      {!search && <BentoHero />}

      {/* Phone Catalog Section */}
      <section id="phone-catalog" className="py-5 position-relative">
        <div className="container">
          {/* Header & Filter Bar */}
          <div className="glass-card-static p-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h2 className="text-white fw-black mb-0 tracking-tight fs-3">
                    {search ? `Search Results for "${search}"` : 'Flagship Phone Catalog'}
                  </h2>
                  <span className="badge-tech small">
                    {phones.length} {phones.length === 1 ? 'Model' : 'Models'}
                  </span>
                </div>
                <p className="text-secondary small mb-0">
                  စစ်မှန်သော 1-Year Official Warranty အပြည့်အစုံဖြင့် ရရှိနိုင်သော စမတ်ဖုန်းများ။
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small d-none d-sm-inline">Sort by:</span>
                <select
                  className="form-select form-tech text-white"
                  style={{ width: 'auto', minWidth: '160px', padding: '0.45rem 1rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="default" className="bg-dark text-white">Featured</option>
                  <option value="price-asc" className="bg-dark text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-dark text-white">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Filter Pills (Brands & Categories) */}
            <div className="d-flex flex-column gap-2 pt-3 border-top border-secondary border-opacity-25">
              {/* Brand Pills */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="text-secondary small fw-semibold me-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  BRANDS:
                </span>
                <button
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    selectedBrand === 'all' ? 'btn-tech-primary' : 'btn-tech-secondary'
                  }`}
                  style={{ fontSize: '12px' }}
                  onClick={() => {
                    setSelectedBrand('all');
                  }}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                      selectedBrand === b.id ? 'btn-tech-primary' : 'btn-tech-secondary'
                    }`}
                    style={{ fontSize: '12px' }}
                    onClick={() => {
                      setSelectedBrand(b.id);
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Category Pills */}
              {categories.length > 0 && (
                <div className="d-flex align-items-center gap-2 flex-wrap pt-2">
                  <span className="text-secondary small fw-semibold me-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    CATEGORY:
                  </span>
                  <button
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                      selectedCategory === 'all' ? 'badge-cyan' : 'btn-tech-secondary'
                    }`}
                    style={{ fontSize: '12px' }}
                    onClick={() => {
                      setSelectedCategory('all');
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                        selectedCategory === c.id ? 'btn-tech-primary' : 'btn-tech-secondary'
                      }`}
                      style={{ fontSize: '12px' }}
                      onClick={() => {
                        setSelectedCategory(c.id);
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active search tag */}
            {search && (
              <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top border-secondary border-opacity-25">
                <span className="small text-secondary">
                  Showing results for query: <strong className="text-white">"{search}"</strong>
                </span>
                <button onClick={clearSearchFilter} className="btn btn-sm btn-tech-secondary">
                  <i className="bi bi-x-circle me-1"></i> Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5 my-5">
              <div
                className="spinner-border text-info"
                role="status"
                style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary small mt-3">Loading smartphones & specifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="glass-card border-danger text-center my-4 py-5 px-4">
              <i className="bi bi-exclamation-triangle-fill fs-1 text-danger d-block mb-3"></i>
              <h5 className="text-white fw-bold mb-2">မော်ဒယ်များ ရယူရာတွင် အဆင်မပြေဖြစ်နေပါသည်</h5>
              <p className="text-secondary small mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-tech-primary">
                <i className="bi bi-arrow-clockwise me-1"></i> Try Again
              </button>
            </div>
          )}

          {/* Phone Cards Grid */}
          {!loading && !error && sortedPhones.length > 0 && (
            <div className="row g-4">
              {sortedPhones.map((phone) => (
                <div key={phone.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <PhoneCard phone={phone} />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sortedPhones.length === 0 && (
            <div className="glass-card text-center py-5 p-4 my-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                <i className="bi bi-phone text-info fs-2"></i>
              </div>
              <h4 className="text-white fw-bold mb-2">ဖုန်းမော်ဒယ်များ မတွေ့ရှိပါ</h4>
              <p className="text-secondary small mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
                ရွေးချယ်ထားသော Filter သို့မဟုတ် ရှာဖွေမှုနှင့် ကိုက်ညီသော ဖုန်းမရှိသေးပါ။ Filter များကို ပြန်လည်ရှင်းလင်းကြည့်ရှုပါ။
              </p>
              <button onClick={clearSearchFilter} className="btn btn-tech-primary">
                <i className="bi bi-arrow-counterclockwise me-2"></i> Reset All Filters
              </button>
            </div>
          )}

          {/* Trust Guarantees Banner */}
          <div className="mt-5 pt-4">
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-card h-100 d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 text-info fs-4 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(6, 182, 212, 0.15)', minWidth: '44px', height: '44px' }}
                  >
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1 small">1-Year Official Warranty</h6>
                    <p className="text-secondary small mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      တရားဝင် အာမခံ ၁ နှစ် အပြည့်အစုံ ပါဝင်ပါသည်။
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-card h-100 d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 text-primary fs-4 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', minWidth: '44px', height: '44px' }}
                  >
                    <i className="bi bi-patch-check"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1 small">100% Genuine Guaranteed</h6>
                    <p className="text-secondary small mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      စစ်မှန်သော မူရင်း Official စက်သစ်များသာ ဖြစ်ပါသည်။
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-card h-100 d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 text-warning fs-4 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(245, 158, 11, 0.15)', minWidth: '44px', height: '44px' }}
                  >
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1 small">KBZPay & WavePay 0% Fee</h6>
                    <p className="text-secondary small mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      QR ဖြင့် အလွယ်တကူ ငွေလွှဲပေးချေနိုင်ပါသည်။
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-card h-100 d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 text-success fs-4 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', minWidth: '44px', height: '44px' }}
                  >
                    <i className="bi bi-box-seam"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1 small">Doorstep Delivery</h6>
                    <p className="text-secondary small mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      မြန်မာနိုင်ငံအနှံ့ အိမ်အရောက် ပို့ဆောင်ပေးပါသည်။
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
