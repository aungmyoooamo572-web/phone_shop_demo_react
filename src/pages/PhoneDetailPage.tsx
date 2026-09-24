import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Phone, PhoneVariant } from '../types';
import { phoneService } from '../services/phoneService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const PhoneDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PhoneVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  useEffect(() => {
    const fetchPhone = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await phoneService.getPhoneById(id);
        setPhone(data);

        // Select first active variant
        const activeVariants = data.variants?.filter((v) => v.isActive && !v.isDeleted) || [];
        if (activeVariants.length > 0) {
          setSelectedVariant(activeVariants[0]);
          if (activeVariants[0].imageUrl) {
            setActiveImage(activeVariants[0].imageUrl);
          }
        }

        // Fallback image
        if (!activeImage) {
          const primary = data.images?.find((img) => img.isPrimary)?.imageUrl || data.images?.[0]?.imageUrl;
          if (primary) setActiveImage(primary);
        }
      } catch {
        setFeedbackMsg({ type: 'danger', text: 'ဖုန်းအချက်အလက်များ ရယူ၍မရပါ' });
      } finally {
        setLoading(false);
      }
    };

    fetchPhone();
  }, [id]);

  const handleVariantChange = (variant: PhoneVariant) => {
    setSelectedVariant(variant);
    if (variant.imageUrl) {
      setActiveImage(variant.imageUrl);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      setFeedbackMsg(null);
      await addToCart(selectedVariant.id);
      setFeedbackMsg({
        type: 'success',
        text: `"${phone?.name} (${selectedVariant.ram}/${selectedVariant.storage} - ${selectedVariant.color})" ကို Cart ထဲသို့ ထည့်သွင်းပြီးပါပြီ!`,
      });
    } catch (err: any) {
      const errorDetail = err?.response?.data?.message || 'Cart ထဲသို့ ထည့်သွင်းရာတွင် အဆင်မပြေဖြစ်သွားပါသည်';
      setFeedbackMsg({ type: 'danger', text: errorDetail });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-info" role="status"></div>
        <p className="text-secondary small mt-3">Loading phone specs & details...</p>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-white">ဖုန်းမော်ဒယ် မတွေ့ရှိပါ</h4>
        <Link to="/" className="btn btn-bento-secondary mt-3">Back to Catalog</Link>
      </div>
    );
  }

  const activeVariants = phone.variants?.filter((v) => v.isActive && !v.isDeleted) || [];
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  return (
    <div className="py-4 py-md-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small text-secondary">
            <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><span className="text-secondary">{phone.brand?.name}</span></li>
            <li className="breadcrumb-item active text-info" aria-current="page">{phone.name}</li>
          </ol>
        </nav>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className={`alert alert-${feedbackMsg.type} border-${feedbackMsg.type} rounded-4 py-3 mb-4 d-flex align-items-center justify-content-between`}>
            <div>
              <i className={`bi bi-${feedbackMsg.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2 fs-5`}></i>
              {feedbackMsg.text}
            </div>
            {feedbackMsg.type === 'success' && (
              <Link to="/cart" className="btn btn-sm btn-light fw-bold text-dark rounded-pill px-3">
                View Cart <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            )}
          </div>
        )}

        {/* Top Product Showcase Section */}
        <div className="row g-4 mb-5">
          {/* Left: Gallery Tile */}
          <div className="col-12 col-lg-6">
            <div className="bento-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div
                className="d-flex align-items-center justify-content-center flex-grow-1 p-4 rounded-4"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(17,24,39,0.8) 100%)',
                  minHeight: '380px',
                }}
              >
                <img
                  src={
                    activeImage ||
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop'
                  }
                  alt={phone.name}
                  className="img-fluid"
                  style={{
                    maxHeight: '340px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.6))',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
                  }}
                />
              </div>

              {/* Thumbnails */}
              {phone.images && phone.images.length > 1 && (
                <div className="d-flex gap-2 justify-content-center mt-3 pt-2">
                  {phone.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={`btn p-1 rounded-3 border ${
                        activeImage === img.imageUrl ? 'border-info' : 'border-secondary'
                      }`}
                      style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <img src={img.imageUrl} alt="" className="img-fluid h-100 w-100 object-fit-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info & Variant Configuration Tile */}
          <div className="col-12 col-lg-6">
            <div className="bento-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  {phone.brand && <span className="badge-tech">{phone.brand.name}</span>}
                  <span className="badge-cyan">{phone.category?.name || 'Smartphone'}</span>
                  <span className={`badge ${inStock ? 'badge-emerald' : 'bg-danger text-white'}`}>
                    {inStock ? `In Stock (${selectedVariant?.stock} units)` : 'Out of Stock'}
                  </span>
                </div>

                <h1 className="text-white fw-bold display-6 mb-1">{phone.name}</h1>
                <p className="text-secondary small mb-3">Model: {phone.model}</p>

                {/* Price Display */}
                <div className="p-3 rounded-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                  <div className="d-flex align-items-baseline gap-2">
                    <span className="text-white fw-black display-6">
                      {selectedVariant
                        ? `${selectedVariant.price.toLocaleString()} MMK`
                        : 'Select configuration'}
                    </span>
                  </div>
                  <span className="text-secondary small d-block mt-1">
                    <i className="bi bi-shield-check text-info me-1"></i> Includes Official 1-Year Brand Warranty & Free Delivery
                  </span>
                </div>

                {/* Configuration: Choose Variant */}
                <div className="mb-4">
                  <label className="text-white fw-semibold small text-uppercase mb-2 d-block">
                    1. Select RAM & Storage:
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {activeVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant)}
                        className={`btn btn-sm px-3 py-2 rounded-3 text-start transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'btn-bento-primary'
                            : 'btn-bento-secondary'
                        }`}
                      >
                        <div className="fw-bold">{variant.ram} / {variant.storage}</div>
                        <div style={{ fontSize: '11px', opacity: 0.85 }}>{variant.color}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Configuration: Selected Variant Color & SKU */}
                {selectedVariant && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center small text-secondary mb-1">
                      <span>Selected Color: <strong className="text-white">{selectedVariant.color}</strong></span>
                      <span>SKU: <strong className="text-info">{selectedVariant.sku}</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-top border-secondary d-flex flex-column flex-sm-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || addingToCart}
                  className="btn btn-bento-primary flex-grow-1 py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
                >
                  {addingToCart ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <>
                      <i className="bi bi-bag-plus fs-5"></i>
                      <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </>
                  )}
                </button>

                <Link to="/cart" className="btn btn-bento-secondary py-3 px-4 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-cart3"></i>
                  <span>Go to Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BENTO GRID SPECIFICATIONS MATRIX (The Core Feature of Option 4) */}
        {/* ============================================================== */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="p-2 rounded-3 bg-indigo-600 text-white fs-5" style={{ background: '#6366f1' }}>
              <i className="bi bi-grid-fill"></i>
            </div>
            <div>
              <h3 className="text-white fw-bold mb-0">Hardware Specifications Matrix</h3>
              <p className="text-secondary small mb-0">Bento Grid Deep-Dive of all internal components & metrics</p>
            </div>
          </div>

          <div className="row g-3">
            {/* Bento Tile 1: Processor & Chipset */}
            <div className="col-12 col-md-4">
              <div className="bento-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase">Silicon & Engine</span>
                  <div className="p-2 rounded-3 text-info fs-5 bg-dark border border-secondary">
                    <i className="bi bi-cpu"></i>
                  </div>
                </div>
                <h4 className="text-white fw-bold mb-1">{phone.processor || 'Advanced Flagship SoC'}</h4>
                <p className="text-secondary small mb-0">
                  Next-generation neural engine with hyper-fast multi-core processing for gaming, AI calculations, and computational photography.
                </p>
              </div>
            </div>

            {/* Bento Tile 2: Pro Camera System */}
            <div className="col-12 col-md-4">
              <div className="bento-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase">Camera Array</span>
                  <div className="p-2 rounded-3 text-warning fs-5 bg-dark border border-secondary">
                    <i className="bi bi-camera"></i>
                  </div>
                </div>
                <h4 className="text-white fw-bold mb-1">{phone.camera || 'Multi-lens Array'}</h4>
                <p className="text-secondary small mb-0">
                  Ultra-clear night photography, cinematic 4K video recording, and AI stabilization for professional studio results.
                </p>
              </div>
            </div>

            {/* Bento Tile 3: Battery & Endurance */}
            <div className="col-12 col-md-4">
              <div className="bento-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase">All-Day Power</span>
                  <div className="p-2 rounded-3 text-success fs-5 bg-dark border border-secondary">
                    <i className="bi bi-battery-charging"></i>
                  </div>
                </div>
                <h4 className="text-white fw-bold mb-1">{phone.battery ? `${phone.battery} mAh` : 'Heavy Duty Battery'}</h4>
                <p className="text-secondary small mb-0">
                  High-density lithium cell with intelligent battery management and super fast charging support.
                </p>
              </div>
            </div>

            {/* Bento Tile 4: Display & Screen */}
            <div className="col-12 col-md-6">
              <div className="bento-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase">Display & Touch</span>
                  <div className="p-2 rounded-3 text-info fs-5 bg-dark border border-secondary">
                    <i className="bi bi-display"></i>
                  </div>
                </div>
                <h4 className="text-white fw-bold mb-1">
                  {phone.screenSize ? `${phone.screenSize} Inches Display` : 'AMOLED Display'}
                </h4>
                <p className="text-secondary small mb-0">
                  HDR10+ vivid colors, ultra-high peak brightness outdoors, and dynamic 120Hz smooth adaptive refresh rate.
                </p>
              </div>
            </div>

            {/* Bento Tile 5: Operating System & Release */}
            <div className="col-12 col-md-6">
              <div className="bento-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase">Platform & Support</span>
                  <div className="p-2 rounded-3 text-primary fs-5 bg-dark border border-secondary">
                    <i className="bi bi-gear-wide-connected"></i>
                  </div>
                </div>
                <h4 className="text-white fw-bold mb-1">{phone.operatingSystem || 'Latest OS Version'}</h4>
                <p className="text-secondary small mb-0">
                  Release Date: {phone.releaseDate || 'Current Global Release'}. Guaranteed software & security updates for 4+ years.
                </p>
              </div>
            </div>

            {/* Bento Tile 6: Product Overview & Notes */}
            {phone.description && (
              <div className="col-12">
                <div className="bento-card p-4">
                  <h6 className="text-white fw-bold mb-2">Description & Notes</h6>
                  <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                    {phone.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
