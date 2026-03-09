import { useEffect, useState } from 'react'
import {
  ChevronLeft, ChevronRight,
  Sun, Car, Lightbulb, Disc3, Layers, Wind,
  RectangleHorizontal, FlipHorizontal2, Phone,
  LayoutGrid, Settings, Wrench, Shield, Clock,
  MapPin, Trophy, Flag, Gauge, Star,
  ShoppingBag, Shirt, Watch, Gift,
  CreditCard, FileText, Calculator, ChevronRight as ChevronR,
  ArrowRight
} from 'lucide-react'
import './App.css'

// Types
type Page = 'models' | 'services' | 'experience' | 'shop' | 'purchase'

const porscheModels = [
  { name: '718 Cayman', tagline: 'The mid-engine sports car', price: 'From $63,400', emoji: '🏎️', configurable: false },
  { name: '911 Carrera', tagline: 'The icon, reimagined', price: 'From $276,000', emoji: '', configurable: true },
  { name: 'Taycan', tagline: 'Soul, electrified', price: 'From $92,000', emoji: '⚡', configurable: false },
  { name: 'Panamera', tagline: 'The luxury performance sedan', price: 'From $99,900', emoji: '🚗', configurable: false },
  { name: 'Macan', tagline: 'The sports car of SUVs', price: 'From $62,900', emoji: '🏔️', configurable: false },
  { name: 'Cayenne', tagline: 'The performance SUV', price: 'From $76,500', emoji: '🛞', configurable: false },
]
type CarColor = 'silver' | 'black' | 'red' | 'blue' | 'white'
type BodyType = 'coupe' | 'convertible'
type WheelType = 'wheel1' | 'wheel2' | 'wheel3'
type DriveType = '2WD' | '4WD'

// Data
const carImages: Record<CarColor, Record<BodyType, string>> = {
  silver: { coupe: '/images/car-silver-coupe-wheel2.webp', convertible: '/images/car-silver-convertible-wheel2.webp' },
  black: { coupe: '/images/car-black-coupe-wheel2.webp', convertible: '/images/car-black-convertible-wheel2.webp' },
  red: { coupe: '/images/car-red-coupe-wheel2.webp', convertible: '/images/car-red-convertible-wheel2.webp' },
  blue: { coupe: '/images/car-blue-coupe-wheel2.webp', convertible: '/images/car-blue-convertible-wheel2.webp' },
  white: { coupe: '/images/car-white-coupe-wheel2.webp', convertible: '/images/car-white-convertible-wheel2.webp' }
}

const wheelImages: Record<WheelType, string> = {
  wheel1: '/images/wheel-1.webp',
  wheel2: '/images/wheel-2.webp',
  wheel3: '/images/wheel-3.webp'
}

const colorOptions: { id: CarColor; name: string; hex: string }[] = [
  { id: 'silver', name: 'GT Silver', hex: '#C0C0C0' },
  { id: 'black', name: 'Jet Black', hex: '#1a1a1a' },
  { id: 'red', name: 'Carmine Red', hex: '#c41e3a' },
  { id: 'blue', name: 'Gentian Blue', hex: '#1e3a5f' },
  { id: 'white', name: 'Carrara White', hex: '#f5f5f5' }
]

const wheelOptions: { id: WheelType; name: string; price: number }[] = [
  { id: 'wheel1', name: 'Carrera Classic Rader', price: 1800 },
  { id: 'wheel2', name: 'RS Spyder Rader', price: 3403 },
  { id: 'wheel3', name: 'SportDesign Rader', price: 4200 }
]

const bodyOptions: { id: BodyType; name: string }[] = [
  { id: 'coupe', name: 'Coupe Type' },
  { id: 'convertible', name: 'Targa Type' }
]

// Carousel — renders ALL items always, positions them with transforms
function OptionCarousel<T>({
  items,
  selectedId,
  getId,
  onSelect,
  renderItem
}: {
  items: T[]
  selectedId: string
  getId: (item: T) => string
  onSelect: (id: string) => void
  renderItem: (item: T, state: 'center' | 'side') => React.ReactNode
}) {
  const idx = items.findIndex(item => getId(item) === selectedId)
  const len = items.length

  const prev = () => {
    const newIdx = idx > 0 ? idx - 1 : len - 1
    onSelect(getId(items[newIdx]))
  }
  const next = () => {
    const newIdx = idx < len - 1 ? idx + 1 : 0
    onSelect(getId(items[newIdx]))
  }

  // Calculate position for each item relative to center
  const getPosition = (i: number): number => {
    let diff = i - idx
    // Wrap around
    if (diff > len / 2) diff -= len
    if (diff < -len / 2) diff += len
    return diff
  }

  return (
    <div className="opt-carousel">
      <button className="opt-arrow" onClick={prev}><ChevronLeft size={18} /></button>
      <div className="opt-track">
        {items.map((item, i) => {
          const pos = getPosition(i)
          const isCenter = pos === 0
          const isVisible = Math.abs(pos) <= 1

          return (
            <div
              key={getId(item)}
              className="opt-item"
              style={{
                transform: `translateX(${pos * 100}%) scale(${isCenter ? 1 : 0.65})`,
                opacity: isCenter ? 1 : isVisible ? 0.35 : 0,
                zIndex: isCenter ? 3 : isVisible ? 2 : 1,
                pointerEvents: isCenter ? 'none' : isVisible ? 'auto' : 'none',
              }}
              onClick={() => !isCenter && onSelect(getId(item))}
            >
              {renderItem(item, isCenter ? 'center' : 'side')}
            </div>
          )
        })}
      </div>
      <button className="opt-arrow" onClick={next}><ChevronRight size={18} /></button>
    </div>
  )
}

// Side icon button
function SideIcon({ icon, active, comingSoon, onClick, tooltip }: {
  icon: React.ReactNode
  active?: boolean
  comingSoon?: boolean
  onClick?: () => void
  tooltip?: string
}) {
  return (
    <button
      className={`side-icon ${active ? 'active' : ''} ${comingSoon ? 'coming-soon' : ''}`}
      onClick={comingSoon ? undefined : onClick}
      title={tooltip}
    >
      {icon}
      {comingSoon && <span className="soon-dot" />}
    </button>
  )
}

// ===== SERVICES PAGE =====
function ServicesPage() {
  const services = [
    { icon: <Wrench size={24} />, title: 'Porsche Service', desc: 'Factory-trained technicians using genuine parts to maintain peak performance of your vehicle.', tag: 'Maintenance' },
    { icon: <Shield size={24} />, title: 'Porsche Approved Warranty', desc: 'Comprehensive coverage up to 15 years, regardless of mileage. Drive with complete confidence.', tag: 'Protection' },
    { icon: <Clock size={24} />, title: 'Roadside Assistance', desc: '24/7 worldwide support. One call connects you to our dedicated team, anywhere, anytime.', tag: '24/7' },
    { icon: <MapPin size={24} />, title: 'Service Locator', desc: 'Find your nearest authorized Porsche Centre with our global network of 860+ service points.', tag: 'Global' },
  ]

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1 className="page-title">Porsche Service</h1>
        <p className="page-desc">Your Porsche deserves nothing less than the best. Our service network ensures your vehicle performs exactly as it was engineered to — every single day.</p>
      </div>
      <div className="service-grid">
        {services.map((s, i) => (
          <div className="service-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="service-card-top">
              <div className="service-icon">{s.icon}</div>
              <span className="service-tag">{s.tag}</span>
            </div>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
            <button className="service-link">Learn more <ArrowRight size={14} /></button>
          </div>
        ))}
      </div>
      <div className="service-banner">
        <div className="banner-text">
          <h2>Schedule Your Next Service</h2>
          <p>Book online in under 2 minutes. Choose your preferred date, time, and Porsche Centre.</p>
        </div>
        <button className="banner-btn">Book Appointment</button>
      </div>
    </div>
  )
}

// ===== EXPERIENCE PAGE =====
function ExperiencePage() {
  const experiences = [
    { icon: <Trophy size={22} />, title: 'Porsche Track Experience', desc: 'Push your limits on world-class circuits. Professional instructors guide you through performance driving at its finest.', image: '🏁' },
    { icon: <Flag size={22} />, title: 'Porsche Travel Experience', desc: 'Discover breathtaking routes across six continents. Curated driving adventures through the most scenic roads on earth.', image: '🌍' },
    { icon: <Gauge size={22} />, title: 'Porsche Ice Experience', desc: 'Master the art of driving on frozen lakes in Finland and Sweden. A unique winter challenge for the adventurous.', image: '❄️' },
    { icon: <Star size={22} />, title: 'Porsche Museum', desc: 'Explore over 80 vehicles spanning the history of Porsche. Stuttgart-Zuffenhausen awaits enthusiasts worldwide.', image: '🏛️' },
  ]

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1 className="page-title">Experience Porsche</h1>
        <p className="page-desc">Beyond the road, beyond the track. Porsche is a way of life — an invitation to experience something extraordinary.</p>
      </div>
      <div className="experience-list">
        {experiences.map((e, i) => (
          <div className="experience-row" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="experience-emoji">{e.image}</div>
            <div className="experience-info">
              <div className="experience-head">
                {e.icon}
                <h3>{e.title}</h3>
              </div>
              <p>{e.desc}</p>
            </div>
            <button className="experience-btn"><ArrowRight size={18} /></button>
          </div>
        ))}
      </div>
      <div className="stats-row">
        <div className="stat-item"><span className="stat-num">860+</span><span className="stat-label">Centres Worldwide</span></div>
        <div className="stat-item"><span className="stat-num">75+</span><span className="stat-label">Years of Heritage</span></div>
        <div className="stat-item"><span className="stat-num">6</span><span className="stat-label">Continents Covered</span></div>
        <div className="stat-item"><span className="stat-num">50k+</span><span className="stat-label">Annual Participants</span></div>
      </div>
    </div>
  )
}

// ===== SHOP PAGE =====
function ShopPage() {
  const products = [
    { icon: <Shirt size={22} />, name: 'Porsche Motorsport Polo', price: '$89', category: 'Apparel' },
    { icon: <Watch size={22} />, name: 'Chronograph 911 Turbo S', price: '$6,500', category: 'Watches' },
    { icon: <ShoppingBag size={22} />, name: 'Leather Weekender Bag', price: '$420', category: 'Accessories' },
    { icon: <Gift size={22} />, name: '1:18 Scale 911 GT3 RS', price: '$159', category: 'Models' },
    { icon: <Shirt size={22} />, name: 'Heritage Collection Jacket', price: '$340', category: 'Apparel' },
    { icon: <ShoppingBag size={22} />, name: 'Carbon Fiber Wallet', price: '$195', category: 'Accessories' },
  ]

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1 className="page-title">Porsche Shop</h1>
        <p className="page-desc">Premium lifestyle products crafted with the same precision and passion that defines every Porsche.</p>
      </div>
      <div className="shop-categories">
        <button className="shop-cat active">All</button>
        <button className="shop-cat">Apparel</button>
        <button className="shop-cat">Watches</button>
        <button className="shop-cat">Accessories</button>
        <button className="shop-cat">Models</button>
      </div>
      <div className="shop-grid">
        {products.map((p, i) => (
          <div className="shop-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="shop-card-image">{p.icon}</div>
            <span className="shop-category">{p.category}</span>
            <h3 className="shop-name">{p.name}</h3>
            <div className="shop-bottom">
              <span className="shop-price">{p.price}</span>
              <button className="shop-add">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== PURCHASE PAGE =====
function PurchasePage() {
  const steps = [
    { icon: <Car size={22} />, step: '01', title: 'Configure Your Porsche', desc: 'Use our configurator to build your perfect vehicle. Choose the model, color, interior, and every detail to your exact specification.' },
    { icon: <Calculator size={22} />, step: '02', title: 'Get Your Quote', desc: 'Receive a transparent, detailed pricing breakdown. No hidden fees. Our finance team can tailor a payment plan to suit your needs.' },
    { icon: <FileText size={22} />, step: '03', title: 'Place Your Order', desc: 'Finalize your configuration with your local Porsche Centre. Your dedicated sales consultant will guide you through every step.' },
    { icon: <CreditCard size={22} />, step: '04', title: 'Take Delivery', desc: 'Collect your Porsche from the factory in Stuttgart-Zuffenhausen or have it delivered to your local Centre. The journey begins.' },
  ]

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1 className="page-title">Purchase</h1>
        <p className="page-desc">From the first spark of inspiration to the moment you turn the key — we make owning a Porsche as extraordinary as driving one.</p>
      </div>
      <div className="purchase-steps">
        {steps.map((s, i) => (
          <div className="purchase-step" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="step-number">{s.step}</div>
            <div className="step-icon">{s.icon}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="purchase-cta">
        <div className="cta-card">
          <h2>Ready to Begin?</h2>
          <p>Contact your nearest Porsche Centre to start your journey. Our team is ready to make your dream a reality.</p>
          <div className="cta-buttons">
            <button className="cta-primary"><Phone size={16} /> Contact Dealer</button>
            <button className="cta-secondary">Find a Centre <ChevronR size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState<Page>('models')
  const [showConfigurator, setShowConfigurator] = useState(true)
  const [carColor, setCarColor] = useState<CarColor>('silver')
  const [bodyType, setBodyType] = useState<BodyType>('coupe')
  const [wheelType, setWheelType] = useState<WheelType>('wheel2')
  const [driveType] = useState<DriveType>('4WD')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Image transition
  const [displayedImage, setDisplayedImage] = useState(carImages[carColor][bodyType])
  const [incomingImage, setIncomingImage] = useState<string | null>(null)
  const [transitionKey, setTransitionKey] = useState(0)
  const targetImage = carImages[carColor][bodyType]

  useEffect(() => {
    if (targetImage !== displayedImage && !incomingImage) {
      const img = new Image()
      img.src = targetImage
      img.onload = () => {
        setIncomingImage(targetImage)
        setTransitionKey(k => k + 1)
      }
    }
  }, [targetImage, displayedImage, incomingImage])

  useEffect(() => {
    if (incomingImage) {
      const timer = setTimeout(() => {
        setDisplayedImage(incomingImage)
        setIncomingImage(null)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [incomingImage])

  // Pricing
  const basePrice = 276000
  const accessoryPrice = 4350
  const wheelPrice = wheelOptions.find(w => w.id === wheelType)?.price || 0
  const drivePrice = driveType === '4WD' ? 1800 : 0
  const bodyPrice = bodyType === 'convertible' ? 3500 : 0
  const totalPrice = basePrice + accessoryPrice + wheelPrice + drivePrice + bodyPrice

  return (
    <div className="app">
      {/* ===== NAVIGATION ===== */}
      <nav className="nav">
        <div className="nav-left">
          <img src="/images/porsche-logo.webp" alt="Porsche" className="porsche-logo" />
        </div>

        <div className={`nav-center ${mobileMenuOpen ? 'open' : ''}`}>
          {(['models', 'services', 'experience', 'shop', 'purchase'] as Page[]).map(page => (
            <a
              key={page}
              href="#"
              className={`${page === 'models' ? 'nav-pill' : ''} ${activePage === page ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActivePage(page); setMobileMenuOpen(false) }}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </a>
          ))}
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn hide-mobile"><LayoutGrid size={18} /></button>
          <button className="contact-btn hide-mobile">
            <Phone size={16} />
            <span>Contact Dealer</span>
          </button>
          <button className="nav-icon-btn hide-mobile"><Settings size={18} /></button>
          <button className="hamburger show-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ===== MAIN ===== */}
      <main className={`main ${(activePage !== 'models' || !showConfigurator) ? 'main-scrollable' : ''}`}>
        {activePage === 'models' && !showConfigurator && (
          <div className="page-content">
            <div className="page-hero">
              <h1 className="page-title">Choose Your Porsche</h1>
              <p className="page-desc">Six model lines. One unmistakable feeling. Select a model to explore — or configure your dream 911.</p>
            </div>
            <div className="models-grid">
              {porscheModels.map((m, i) => (
                <div
                  className={`model-card ${m.configurable ? 'model-configurable' : ''}`}
                  key={i}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => m.configurable && setShowConfigurator(true)}
                >
                  <div className="model-image-area">
                    {m.configurable ? (
                      <img src={carImages[carColor][bodyType]} alt={m.name} className="model-img" />
                    ) : (
                      <span className="model-emoji">{m.emoji}</span>
                    )}
                  </div>
                  <div className="model-info">
                    <h3 className="model-name">{m.name}</h3>
                    <p className="model-tagline">{m.tagline}</p>
                    <div className="model-bottom">
                      <span className="model-price">{m.price}</span>
                      {m.configurable ? (
                        <button className="model-configure-btn">Configure <ArrowRight size={14} /></button>
                      ) : (
                        <span className="model-soon">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'models' && showConfigurator && (
          <>
            <div className="info-bar">
              <div className="info-left">
                <button className="back-to-models" onClick={() => setShowConfigurator(false)}>
                  <ChevronLeft size={16} /> All Models
                </button>
                <h1 className="car-title">Tagra-4</h1>
                <p className="car-subtitle">911 Carera · Personal Edition</p>
              </div>
              <div className="info-right">
                <div className="price-block">
                  <span className="currency">$</span>
                  <span className="amount">{totalPrice.toLocaleString()}</span>
                </div>
                <p className="accessories-label">+ ${accessoryPrice.toLocaleString()} accessories</p>
              </div>
            </div>

            <div className="car-viewport">
              <div className="side-icons side-left">
                <SideIcon icon={<Lightbulb size={20} />} comingSoon tooltip="Headlights" />
                <SideIcon icon={<Disc3 size={20} />} comingSoon tooltip="Brakes" />
                <SideIcon icon={<Layers size={20} />} comingSoon tooltip="Trim" />
                <SideIcon icon={<Wind size={20} />} comingSoon tooltip="Exhaust" />
              </div>

              <div className="car-stage">
                <div className="car-image-wrapper">
                  <img src={displayedImage} alt="Porsche 911" className="car-image" />
                  {incomingImage && (
                    <img
                      key={transitionKey}
                      src={incomingImage}
                      alt="Porsche 911"
                      className="car-image car-image-enter"
                    />
                  )}
                </div>
              </div>

              <div className="side-icons side-right">
                <SideIcon icon={<Car size={20} />} active={bodyType === 'coupe'} onClick={() => setBodyType('coupe')} tooltip="Coupe" />
                <SideIcon icon={<Sun size={20} />} active={bodyType === 'convertible'} onClick={() => setBodyType('convertible')} tooltip="Convertible" />
                <SideIcon icon={<RectangleHorizontal size={20} />} comingSoon tooltip="Spoiler" />
                <SideIcon icon={<FlipHorizontal2 size={20} />} comingSoon tooltip="Mirrors" />
              </div>
            </div>

            <div className="bottom-cards">
              <div className="config-card">
                <div className="card-head">
                  <span className="card-label">Car Body</span>
                  <span className="card-price">+${bodyPrice.toLocaleString()}</span>
                </div>
                <OptionCarousel
                  items={bodyOptions}
                  selectedId={bodyType}
                  getId={item => item.id}
                  onSelect={id => setBodyType(id as BodyType)}
                  renderItem={(item, state) => (
                    <div className="body-thumb">
                      <img src={carImages[carColor][item.id]} alt={item.name} />
                      {state === 'center' && <span className="opt-name">{item.name}</span>}
                    </div>
                  )}
                />
              </div>

              <div className="config-card">
                <div className="card-head">
                  <span className="card-label">Wheels Type</span>
                  <span className="card-price">+${wheelPrice.toLocaleString()}</span>
                </div>
                <OptionCarousel
                  items={wheelOptions}
                  selectedId={wheelType}
                  getId={item => item.id}
                  onSelect={id => setWheelType(id as WheelType)}
                  renderItem={(item, state) => (
                    <div className="wheel-thumb">
                      <img src={wheelImages[item.id]} alt={item.name} />
                      {state === 'center' && <span className="opt-name">Zoll {item.name}</span>}
                    </div>
                  )}
                />
              </div>

              <div className="config-card">
                <div className="card-head">
                  <span className="card-label">Paint Color</span>
                </div>
                <OptionCarousel
                  items={colorOptions}
                  selectedId={carColor}
                  getId={item => item.id}
                  onSelect={id => setCarColor(id as CarColor)}
                  renderItem={(item, state) => (
                    <div className="paint-thumb">
                      <img src={carImages[item.id][bodyType]} alt={item.name} />
                      {state === 'center' && <span className="opt-name">{item.name}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          </>
        )}

        {activePage === 'services' && <ServicesPage />}
        {activePage === 'experience' && <ExperiencePage />}
        {activePage === 'shop' && <ShopPage />}
        {activePage === 'purchase' && <PurchasePage />}
      </main>
    </div>
  )
}

export default App
