import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Brand, Category, Phone } from '../types';
import { phoneService } from '../services/phoneService';
import { BentoHero } from '../components/BentoHero';
import { PhoneCard } from '../components/PhoneCard';

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [phones, setPhones] = useState<Phone[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
        // Continue if metadata fails
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
      } catch (err: unknown) {
        setError('ဖုန်းစာရင်းများ ရယူရာတွင် အဆင်မပြေဖြစ်နေပါသည်။ Backend Server အလုပ်လုပ်နေခြင်း ရှိမရှိ စစ်ဆေးပေးပါ။');
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, [search, selectedBrand, selectedCategory]);

  return (
    <div>
      {/* Bento Hero */}
      {!search && <BentoHero />}

      {/* Catalog Section */}
      <section id="phone-catalog" className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h2 className="text-white fw-bold mb-1">
                {search ? `Search Results for "${search}"` : 'Phone Catalog'}
              </h2>
              <p className="text-secondary small mb-0">
                {phones.length} Models available with original warranty.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
              <button
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                  selectedBrand === 'all' && selectedCategory === 'all'
                    ? 'btn-bento-primary'
                    : 'btn-bento-secondary'
                }`}
                onClick={() => {
                  setSelectedBrand('all');
                  setSelectedCategory('all');
                }}
              >
                All
              </button>

              {brands.map((b) => (
                <button
                  key={b.id}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    selectedBrand === b.id ? 'btn-bento-primary' : 'btn-bento-secondary'
                  }`}
                  onClick={() => {
                    setSelectedBrand(b.id);
                    setSelectedCategory('all');
                  }}
                >
                  {b.name}
                </button>
              ))}

              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    selectedCategory === c.id ? 'badge-cyan' : 'btn-bento-secondary'
                  }`}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setSelectedBrand('all');
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary small mt-2">Loading smartphones...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-dark border-danger text-danger text-center my-4 py-4 rounded-4">
              <i className="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
              {error}
            </div>
          )}

          {/* Phone Grid */}
          {!loading && !error && phones.length > 0 && (
            <div className="row g-4">
              {phones.map((phone) => (
                <div key={phone.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <PhoneCard phone={phone} />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && phones.length === 0 && (
            <div className="bento-card text-center py-5 p-4 my-4">
              <div className="display-4 text-secondary mb-3">
                <i className="bi bi-phone-vibrate"></i>
              </div>
              <h5 className="text-white fw-bold mb-2">ဖုန်းမော်ဒယ်များ မတွေ့ရှိပါ</h5>
              <p className="text-secondary small mb-4">
                ရွေးချယ်ထားသော Brand သို့မဟုတ် ရှာဖွေမှုနှင့် ကိုက်ညီသော ဖုန်းမရှိသေးပါ။
              </p>
              <button
                className="btn btn-bento-secondary"
                onClick={() => {
                  setSelectedBrand('all');
                  setSelectedCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
