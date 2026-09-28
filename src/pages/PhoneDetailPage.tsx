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
      <div className="container py-5 text-center my-5">
        <div
          className="spinner-border text-info"
          role="status"
          style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}
        ></div>
        <p className="text-secondary small mt-3">Loading phone specs & details...</p>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="glass-card p-5 max-w-md mx-auto">
          <i className="bi bi-question-circle display-4 text-secondary mb-3"></i>
          <h4 className="text-white fw-bold mb-2">ဖုန်းမော်ဒယ် မတွေ့ရှိပါ</h4>
          <p className="text-secondary small mb-4">သင်ရှာဖွေနေသော ဖုန်းကို ရှာမတွေ့ပါ။</p>
          <Link to="/" className="btn btn-tech-primary">
            <i className="bi bi-arrow-left me-2"></i> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const activeVariants = phone.variants?.filter((v) => v.isActive && !v.isDeleted) || [];
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  return (
    <div className="py-4 py-md-5 position-relative">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small text-secondary">
            <li className="breadcrumb-item">
              <Link to="/" className="text-secondary text-decoration-none hover-text-cyan">
                Home
              </Link>
            </li>
            {phone.brand && (
              <li className="breadcrumb-item">
                <span className="text-secondary">{phone.brand.name}</span>
              </li>
            )}
            <li className="breadcrumb-item active text-info" aria-current="page">
              {phone.name}
            </li>
          </ol>
        </nav>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            className={`glass-card p-3 mb-4 d-flex align-items-center justify-content-between border-${
              feedbackMsg.type === 'success' ? 'success' : 'danger'
            }`}
            style={{
              background:
                feedbackMsg.type === 'success'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i
                className={`bi bi-${
                  feedbackMsg.type === 'success' ? 'check-circle-fill text-success' : 'exclamation-circle-fill text-danger'
                } fs-5`}
              ></i>
              <span className="text-white small fw-semibold">{feedbackMsg.text}</span>
            </div>
            {feedbackMsg.type === 'success' && (
              <Link to="/cart" className="btn btn-sm btn-tech-primary">
                View Cart <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            )}
          </div>
        )}

        {/* Top Product Showcase Section */}
        <div className="row g-4 mb-5">
          {/* Left: Gallery Showcase Card */}
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div
                className="d-flex align-items-center justify-content-center flex-grow-1 p-4 rounded-4 position-relative overflow-hidden"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
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
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.65))',
                    transition: 'transform 0.4s ease',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
                  }}
                />
              </div>

              {/* Thumbnails Strip */}
              {phone.images && phone.images.length > 1 && (
                <div className="d-flex gap-2 justify-content-center mt-3 pt-2 overflow-auto">
                  {phone.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={`btn p-1 rounded-3 ${
                        activeImage === img.imageUrl
                          ? 'border border-info'
                          : 'border border-secondary border-opacity-50'
                      }`}
                      style={{
                        width: '58px',
                        height: '58px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <img src={img.imageUrl} alt="" className="img-fluid h-100 w-100 object-fit-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info & Configuration Card */}
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Badges */}
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                  {phone.brand && <span className="badge-tech">{phone.brand.name}</span>}
                  <span className="badge-cyan">{phone.category?.name || 'Flagship Smartphone'}</span>
                  <div
                    className="d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill"
                    style={{
                      background: inStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${inStock ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      fontSize: '11px',
                      color: inStock ? '#34d399' : '#f87171',
                      fontWeight: 600,
                    }}
                  >
                    <span className={`pulse-dot ${inStock ? 'pulse-emerald' : 'pulse-rose'}`}></span>
                    <span>{inStock ? `In Stock (${selectedVariant?.stock} available)` : 'Out of Stock'}</span>
                  </div>
                </div>

                <h1 className="text-white fw-black display-6 mb-1 tracking-tight">{phone.name}</h1>
                <p className="text-secondary small mb-4">Model: {phone.model}</p>

                {/* Price Display Card */}
                <div
                  className="p-3 p-md-4 rounded-4 mb-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <span className="text-secondary small d-block mb-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    SPECIAL OFFER PRICE
                  </span>
                  <div className="d-flex align-items-baseline gap-2">
                    <span className="text-white fw-black display-6 gradient-text-cyan">
                      {selectedVariant
                        ? `${selectedVariant.price.toLocaleString()} MMK`
                        : 'Select configuration'}
                    </span>
                  </div>
                  <span className="text-secondary small d-block mt-2" style={{ fontSize: '12px' }}>
                    <i className="bi bi-shield-check text-info me-1"></i> Includes Official 1-Year Brand Warranty & Express Doorstep Delivery
                  </span>
                </div>

                {/* Variant Configuration */}
                <div className="mb-4">
                  <label className="text-white fw-bold small text-uppercase mb-2 d-block" style={{ letterSpacing: '0.05em' }}>
                    Select RAM & Storage Configuration:
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {activeVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant)}
                        className={`btn btn-sm px-3 py-2 rounded-3 text-start transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'btn-tech-primary'
                            : 'btn-tech-secondary'
                        }`}
                      >
                        <div className="fw-bold">{variant.ram} / {variant.storage}</div>
                        <div style={{ fontSize: '11px', opacity: 0.85 }}>{variant.color}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Details */}
                {selectedVariant && (
                  <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)' }}>
                    <div className="row g-2 small text-secondary">
                      <div className="col-6">
                        <span>Color: </span>
                        <strong className="text-white">{selectedVariant.color}</strong>
                      </div>
                      <div className="col-6 text-end">
                        <span>SKU: </span>
                        <strong className="text-info">{selectedVariant.sku}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || addingToCart}
                  className="btn btn-tech-primary flex-grow-1 py-3 fs-6 d-flex align-items-center justify-content-center gap-2"
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

                <Link
                  to="/cart"
                  className="btn btn-tech-secondary py-3 px-4 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-bag"></i>
                  <span>Go to Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Specifications Matrix */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="p-2 rounded-3 text-white fs-4 d-flex align-items-center justify-content-center"
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              }}
            >
              <i className="bi bi-cpu-fill"></i>
            </div>
            <div>
              <h3 className="text-white fw-bold mb-0">Hardware Specifications Matrix</h3>
              <p className="text-secondary small mb-0">Deep dive into internal silicon, optics, and display architecture</p>
            </div>
          </div>

          <div className="row g-3">
            {/* Tile 1: Processor */}
            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Silicon & Engine
                  </span>
                  <div
                    className="p-2 rounded-3 text-info fs-5 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)' }}
                  >
                    <i className="bi bi-cpu"></i>
                  </div>
                </div>
                <h5 className="text-white fw-bold mb-2">{phone.processor || 'Advanced Flagship SoC'}</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                  Next-generation neural engine with hyper-fast multi-core processing for gaming, AI calculations, and computational photography.
                </p>
              </div>
            </div>

            {/* Tile 2: Optics */}
            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Pro Optics Array
                  </span>
                  <div
                    className="p-2 rounded-3 text-warning fs-5 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                  >
                    <i className="bi bi-camera"></i>
                  </div>
                </div>
                <h5 className="text-white fw-bold mb-2">{phone.camera || 'Multi-lens Array'}</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                  Ultra-clear night photography, cinematic 4K video recording, and optical stabilization for professional studio results.
                </p>
              </div>
            </div>

            {/* Tile 3: Battery */}
            <div className="col-12 col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    All-Day Power
                  </span>
                  <div
                    className="p-2 rounded-3 text-success fs-5 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                  >
                    <i className="bi bi-battery-charging"></i>
                  </div>
                </div>
                <h5 className="text-white fw-bold mb-2">
                  {phone.battery ? `${phone.battery} mAh Battery` : 'Heavy Duty Battery'}
                </h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                  High-density lithium cell with intelligent battery management and super fast charging support.
                </p>
              </div>
            </div>

            {/* Tile 4: Display */}
            <div className="col-12 col-md-6">
              <div className="glass-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Display & Touch
                  </span>
                  <div
                    className="p-2 rounded-3 text-info fs-5 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)' }}
                  >
                    <i className="bi bi-display"></i>
                  </div>
                </div>
                <h5 className="text-white fw-bold mb-2">
                  {phone.screenSize ? `${phone.screenSize} Inches Display` : 'AMOLED Display'}
                </h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                  HDR10+ vivid colors, ultra-high peak brightness outdoors, and dynamic 120Hz smooth adaptive refresh rate.
                </p>
              </div>
            </div>

            {/* Tile 5: Platform */}
            <div className="col-12 col-md-6">
              <div className="glass-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Platform & OS
                  </span>
                  <div
                    className="p-2 rounded-3 text-primary fs-5 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                  >
                    <i className="bi bi-gear-wide-connected"></i>
                  </div>
                </div>
                <h5 className="text-white fw-bold mb-2">{phone.operatingSystem || 'Latest OS Version'}</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.5' }}>
                  Release Date: {phone.releaseDate || 'Current Global Release'}. Guaranteed software & security updates for 4+ years.
                </p>
              </div>
            </div>

            {/* Tile 6: Description */}
            {phone.description && (
              <div className="col-12">
                <div className="glass-card p-4">
                  <h6 className="text-white fw-bold mb-2">Description & Notes</h6>
                  <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
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
