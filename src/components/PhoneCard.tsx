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
    <div className="glass-card h-100 d-flex flex-column group">
      {/* Top Media Showcase Area */}
      <div
        className="position-relative d-flex align-items-center justify-content-center p-4 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)',
          minHeight: '230px',
        }}
      >
        {/* Live Stock Indicator Badge */}
        <div
          className="position-absolute top-0 start-0 m-3 d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill"
          style={{
            background: inStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${inStock ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            backdropFilter: 'blur(8px)',
            fontSize: '11px',
            color: inStock ? '#34d399' : '#f87171',
            fontWeight: 600,
          }}
        >
          <span className={`pulse-dot ${inStock ? 'pulse-emerald' : 'pulse-rose'}`}></span>
          <span>{inStock ? 'In Stock' : 'Sold Out'}</span>
        </div>

        {/* Brand Badge */}
        {phone.brand && (
          <span
            className="position-absolute top-0 end-0 m-3 badge-tech"
            style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {phone.brand.name}
          </span>
        )}

        {/* Product Image with Hover 3D Lift */}
        <Link to={`/phones/${phone.id}`} className="text-decoration-none d-flex align-items-center justify-content-center w-100">
          <img
            src={primaryImage}
            alt={phone.name}
            className="img-fluid"
            style={{
              maxHeight: '180px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.55))',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
              e.currentTarget.style.filter = 'drop-shadow(0 20px 30px rgba(99, 102, 241, 0.35))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 14px 20px rgba(0,0,0,0.55))';
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=400&auto=format&fit=crop';
            }}
          />
        </Link>
      </div>

      {/* Info & Content Area */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        <div className="mb-2">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span
              className="text-secondary small fw-semibold text-uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.08em' }}
            >
              {phone.category?.name || 'Flagship Smartphone'}
            </span>
            {phone.screenSize && (
              <span className="text-secondary" style={{ fontSize: '11px' }}>
                <i className="bi bi-aspect-ratio me-1 text-info"></i>
                {phone.screenSize}"
              </span>
            )}
          </div>
          <Link to={`/phones/${phone.id}`} className="text-decoration-none">
            <h5 className="text-white fw-bold mb-1 line-clamp-1 hover-text-cyan transition-all">
              {phone.name}
            </h5>
          </Link>
          <p className="text-secondary small text-truncate mb-0" style={{ fontSize: '12px' }}>
            Model: {phone.model}
          </p>
        </div>

        {/* Micro Specs Tiles */}
        <div className="row g-1 my-2">
          {phone.processor && (
            <div className="col-6">
              <div className="bento-spec-tile py-1 px-2 text-truncate" title={phone.processor}>
                <i className="bi bi-cpu text-info me-1" style={{ fontSize: '11px' }}></i>
                <span className="text-light" style={{ fontSize: '11px' }}>
                  {phone.processor}
                </span>
              </div>
            </div>
          )}
          {phone.battery && (
            <div className="col-6">
              <div className="bento-spec-tile py-1 px-2 text-truncate">
                <i className="bi bi-battery-charging text-success me-1" style={{ fontSize: '11px' }}></i>
                <span className="text-light" style={{ fontSize: '11px' }}>
                  {phone.battery} mAh
                </span>
              </div>
            </div>
          )}
          {phone.camera && (
            <div className="col-12 mt-1">
              <div className="bento-spec-tile py-1 px-2 text-truncate" title={phone.camera}>
                <i className="bi bi-camera text-warning me-1" style={{ fontSize: '11px' }}></i>
                <span className="text-light" style={{ fontSize: '11px' }}>
                  {phone.camera}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Storage Variant Pills */}
        {activeVariants.length > 0 && (
          <div className="d-flex flex-wrap gap-1 my-2">
            {Array.from(new Set(activeVariants.map((v) => v.storage))).map((s) => (
              <span
                key={s}
                className="badge rounded-pill"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                  fontSize: '10px',
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action CTA */}
        <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
          <div>
            <span className="text-secondary d-block" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
              STARTING AT
            </span>
            <div className="text-white fw-bold fs-6">
              {minPrice > 0 ? (
                <span className="gradient-text-cyan fw-bold">
                  {minPrice.toLocaleString()}{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>MMK</span>
                </span>
              ) : (
                <span className="text-secondary small">Contact for Price</span>
              )}
            </div>
          </div>

          <Link
            to={`/phones/${phone.id}`}
            className="btn btn-tech-primary btn-sm px-3"
            style={{ fontSize: '12px' }}
          >
            <span>Specs & Buy</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
