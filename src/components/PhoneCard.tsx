import React from 'react';
import { Link } from 'react-router-dom';
import type { Phone } from '../types';

interface PhoneCardProps {
  phone: Phone;
}

export const PhoneCard: React.FC<PhoneCardProps> = ({ phone }) => {
  // Find starting price from active variants
  const activeVariants = phone.variants?.filter((v) => v.isActive && !v.isDeleted) || [];
  const prices = activeVariants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const inStock = activeVariants.some((v) => v.stock > 0);

  // Primary image or first image or placeholder
  const primaryImage =
    phone.images?.find((img) => img.isPrimary)?.imageUrl ||
    phone.images?.[0]?.imageUrl ||
    activeVariants[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="bento-card h-100 d-flex flex-column">
      {/* Top Media Area */}
      <div
        className="position-relative d-flex align-items-center justify-content-center p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          minHeight: '220px',
        }}
      >
        <span
          className={`position-absolute top-0 start-0 m-3 badge ${
            inStock ? 'badge-emerald' : 'bg-danger text-white'
          }`}
          style={{ fontSize: '11px' }}
        >
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>

        {phone.brand && (
          <span className="position-absolute top-0 end-0 m-3 badge-tech" style={{ fontSize: '11px' }}>
            {phone.brand.name}
          </span>
        )}

        <img
          src={primaryImage}
          alt={phone.name}
          className="img-fluid"
          style={{
            maxHeight: '170px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=400&auto=format&fit=crop';
          }}
        />
      </div>

      {/* Content Area */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        <div className="mb-2">
          <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
            {phone.category?.name || 'Smartphone'}
          </span>
          <h5 className="text-white fw-bold mb-1 mt-1">{phone.name}</h5>
          <p className="text-secondary small text-truncate mb-0">{phone.model}</p>
        </div>

        {/* Bento Micro-Specs */}
        <div className="row g-1 my-2">
          {phone.processor && (
            <div className="col-6">
              <div className="bento-spec-tile py-1 px-2 text-truncate small" title={phone.processor}>
                <i className="bi bi-cpu text-info me-1"></i>
                <span className="text-secondary" style={{ fontSize: '11px' }}>{phone.processor}</span>
              </div>
            </div>
          )}
          {phone.battery && (
            <div className="col-6">
              <div className="bento-spec-tile py-1 px-2 text-truncate small">
                <i className="bi bi-battery-charging text-success me-1"></i>
                <span className="text-secondary" style={{ fontSize: '11px' }}>{phone.battery} mAh</span>
              </div>
            </div>
          )}
          {phone.camera && (
            <div className="col-12 mt-1">
              <div className="bento-spec-tile py-1 px-2 text-truncate small" title={phone.camera}>
                <i className="bi bi-camera text-warning me-1"></i>
                <span className="text-secondary" style={{ fontSize: '11px' }}>{phone.camera}</span>
              </div>
            </div>
          )}
        </div>

        {/* Variant summary pills */}
        {activeVariants.length > 0 && (
          <div className="d-flex flex-wrap gap-1 my-2">
            {Array.from(new Set(activeVariants.map((v) => v.storage))).map((s) => (
              <span key={s} className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '10px' }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-top border-secondary d-flex align-items-center justify-content-between">
          <div>
            <span className="text-secondary d-block" style={{ fontSize: '11px' }}>
              Starting From
            </span>
            <span className="text-white fw-extrabold fs-6">
              {minPrice > 0 ? `${minPrice.toLocaleString()} MMK` : 'Contact for Price'}
            </span>
          </div>

          <Link to={`/phones/${phone.id}`} className="btn btn-bento-primary btn-sm px-3">
            Specs & Buy <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
