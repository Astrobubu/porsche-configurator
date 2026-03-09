import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft, ChevronRight, ChevronDown, Check,
  Sun, Car, Lightbulb, Disc3, Layers, Wind,
  RectangleHorizontal, FlipHorizontal2, Phone,
  LayoutGrid, Settings
} from 'lucide-react'
import './App.css'

// Types
type CarColor = 'silver' | 'black' | 'red' | 'blue' | 'white'
type BodyType = 'coupe' | 'convertible'
type WheelType = 'wheel1' | 'wheel2' | 'wheel3'
type DriveType = '2WD' | '4WD'

// Data
const carImages: Record<CarColor, Record<BodyType, string>> = {
  silver: { coupe: '/images/car-silver-coupe-wheel2.png', convertible: '/images/car-silver-convertible-wheel2.png' },
  black: { coupe: '/images/car-black-coupe-wheel2.png', convertible: '/images/car-black-convertible-wheel2.png' },
  red: { coupe: '/images/car-red-coupe-wheel2.png', convertible: '/images/car-red-convertible-wheel2.png' },
  blue: { coupe: '/images/car-blue-coupe-wheel2.png', convertible: '/images/car-blue-convertible-wheel2.png' },
  white: { coupe: '/images/car-white-coupe-wheel2.png', convertible: '/images/car-white-convertible-wheel2.png' }
}

const wheelImages: Record<WheelType, string> = {
  wheel1: '/images/wheel-1.png',
  wheel2: '/images/wheel-2.png',
  wheel3: '/images/wheel-3.png'
}

const transmissionImages: Record<DriveType, string> = {
  '2WD': '/images/transmission-2wd.png',
  '4WD': '/images/transmission-4wd.png'
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

// Porsche Crest SVG
function PorscheCrest({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 2C50 2 95 15 95 15V70C95 70 50 98 50 98C50 98 5 70 5 70V15C5 15 50 2 50 2Z" fill="#C6A052" stroke="#8B6914" strokeWidth="2"/>
      <path d="M50 8C50 8 88 19 88 19V66C88 66 50 91 50 91C50 91 12 66 12 66V19C12 19 50 8 50 8Z" fill="#1A1A1A"/>
      <path d="M50 14C50 14 82 23 82 23V62C82 62 50 85 50 85C50 85 18 62 18 62V23C18 23 50 14 50 14Z" fill="#C6A052" stroke="#8B6914" strokeWidth="0.5"/>
      {/* Quadrant lines */}
      <line x1="50" y1="14" x2="50" y2="85" stroke="#1A1A1A" strokeWidth="2.5"/>
      <line x1="18" y1="42" x2="82" y2="42" stroke="#1A1A1A" strokeWidth="2.5"/>
      {/* Top-left antlers */}
      <path d="M30 22L30 38M26 24L26 36M34 20L34 40" stroke="#CE2029" strokeWidth="2" strokeLinecap="round"/>
      {/* Top-right antlers */}
      <path d="M70 22L70 38M66 24L66 36M74 20L74 40" stroke="#CE2029" strokeWidth="2" strokeLinecap="round"/>
      {/* Bottom-left Stuttgart horse hint */}
      <path d="M28 52C32 48 38 50 40 55C42 60 36 68 30 65C24 62 24 56 28 52Z" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
      {/* Bottom-right Stuttgart horse hint */}
      <path d="M72 52C68 48 62 50 60 55C58 60 64 68 70 65C76 62 76 56 72 52Z" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
      {/* Center horse silhouette simplified */}
      <path d="M46 56L44 50L46 44L50 42L54 44L56 50L54 56L52 62L50 66L48 62L46 56Z" fill="#1A1A1A" opacity="0.3"/>
    </svg>
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

function App() {
  const [carColor, setCarColor] = useState<CarColor>('silver')
  const [bodyType, setBodyType] = useState<BodyType>('coupe')
  const [wheelType, setWheelType] = useState<WheelType>('wheel2')
  const [driveType, setDriveType] = useState<DriveType>('4WD')
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

  // Wheel scroll
  const wheelScrollRef = useRef<HTMLDivElement>(null)
  const scrollWheels = (dir: 'left' | 'right') => {
    if (wheelScrollRef.current) {
      wheelScrollRef.current.scrollBy({ left: dir === 'left' ? -140 : 140, behavior: 'smooth' })
    }
  }

  // Cycle color
  const cycleColor = (dir: 'prev' | 'next') => {
    const idx = colorOptions.findIndex(c => c.id === carColor)
    if (dir === 'next') {
      setCarColor(colorOptions[(idx + 1) % colorOptions.length].id)
    } else {
      setCarColor(colorOptions[(idx - 1 + colorOptions.length) % colorOptions.length].id)
    }
  }

  return (
    <div className="app">
      {/* ===== NAVIGATION ===== */}
      <nav className="nav">
        <div className="nav-left">
          <PorscheCrest size={32} />
        </div>

        <div className={`nav-center ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#" className="nav-pill active">Models</a>
          <a href="#">Services</a>
          <a href="#">Experience</a>
          <a href="#">Shop</a>
          <a href="#">Purchase</a>
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn hide-mobile">
            <LayoutGrid size={16} />
          </button>
          <button className="contact-btn hide-mobile">
            <Phone size={14} />
            <span>Contact Dealer</span>
          </button>
          <button className="nav-icon-btn hide-mobile">
            <Settings size={16} />
          </button>
          {/* Mobile hamburger */}
          <button className="hamburger show-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ===== MAIN ===== */}
      <main className="main">
        {/* Top info bar */}
        <div className="info-bar">
          <div className="info-left">
            <div className="title-row">
              <h1 className="car-title">Tagra-4</h1>
              <button className="dropdown-trigger"><ChevronDown size={18} /></button>
            </div>
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

        {/* Car viewport */}
        <div className="car-viewport">
          {/* Left side icons */}
          <div className="side-icons side-left">
            <SideIcon icon={<Lightbulb size={18} />} comingSoon tooltip="Headlights" />
            <SideIcon icon={<Disc3 size={18} />} comingSoon tooltip="Brakes" />
            <SideIcon icon={<Layers size={18} />} comingSoon tooltip="Trim" />
            <SideIcon icon={<Wind size={18} />} comingSoon tooltip="Exhaust" />
          </div>

          {/* Car image area */}
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

            {/* Color dots under car */}
            <div className="color-selector">
              {colorOptions.map(c => (
                <button
                  key={c.id}
                  className={`color-dot ${carColor === c.id ? 'active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setCarColor(c.id)}
                  title={c.name}
                />
              ))}
            </div>

            {/* Nav arrows */}
            <div className="car-arrows">
              <button className="arrow-btn" onClick={() => cycleColor('prev')}>
                <ChevronLeft size={18} />
              </button>
              <button className="arrow-btn" onClick={() => cycleColor('next')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="side-icons side-right">
            <SideIcon
              icon={<Car size={18} />}
              active={bodyType === 'coupe'}
              onClick={() => setBodyType('coupe')}
              tooltip="Coupe"
            />
            <SideIcon
              icon={<Sun size={18} />}
              active={bodyType === 'convertible'}
              onClick={() => setBodyType('convertible')}
              tooltip="Convertible"
            />
            <SideIcon icon={<RectangleHorizontal size={18} />} comingSoon tooltip="Spoiler" />
            <SideIcon icon={<FlipHorizontal2 size={18} />} comingSoon tooltip="Mirrors" />
          </div>
        </div>

        {/* ===== BOTTOM CARDS ===== */}
        <div className="bottom-cards">
          {/* Car Body Card */}
          <div className="config-card">
            <div className="card-head">
              <span className="card-label">Car Body</span>
              <div className="card-meta">
                <span className="card-price">+${bodyPrice.toLocaleString()}</span>
                <Settings size={14} className="card-gear" />
              </div>
            </div>
            <div className="body-options">
              <button
                className={`body-option ${bodyType === 'coupe' ? 'selected' : ''}`}
                onClick={() => setBodyType('coupe')}
              >
                <img src={carImages[carColor].coupe} alt="Coupe" />
                <span>Coupe Type</span>
              </button>
              <button
                className={`body-option ${bodyType === 'convertible' ? 'selected' : ''}`}
                onClick={() => setBodyType('convertible')}
              >
                <img src={carImages[carColor].convertible} alt="Convertible" />
                <span>Targa Type</span>
              </button>
            </div>
          </div>

          {/* Wheels Card */}
          <div className="config-card wheels-card">
            <div className="card-head">
              <span className="card-label">Wheels Type</span>
              <div className="card-meta">
                <span className="card-price">+${wheelPrice.toLocaleString()}</span>
                <Settings size={14} className="card-gear" />
              </div>
            </div>
            <div className="wheels-scroll-area">
              <div className="wheels-track" ref={wheelScrollRef}>
                {wheelOptions.map(w => (
                  <button
                    key={w.id}
                    className={`wheel-option ${wheelType === w.id ? 'selected' : ''}`}
                    onClick={() => setWheelType(w.id)}
                  >
                    {wheelType === w.id && (
                      <span className="wheel-check"><Check size={12} /></span>
                    )}
                    <img src={wheelImages[w.id]} alt={w.name} />
                    <span className="wheel-name">Zoll {w.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drive Type Card */}
          <div className="config-card">
            <div className="card-head">
              <span className="card-label">Drive Type</span>
              <div className="card-meta">
                <span className="card-price">+${drivePrice.toLocaleString()}</span>
                <Settings size={14} className="card-gear" />
              </div>
            </div>
            <div className="drive-options">
              <div className="drive-visual">
                <img
                  src={transmissionImages[driveType]}
                  alt={driveType}
                  className="drive-img"
                />
              </div>
              <div className="drive-toggle">
                <button
                  className={`drive-btn ${driveType === '2WD' ? 'active' : ''}`}
                  onClick={() => setDriveType('2WD')}
                >2WD</button>
                <button
                  className={`drive-btn ${driveType === '4WD' ? 'active' : ''}`}
                  onClick={() => setDriveType('4WD')}
                >4WD</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
