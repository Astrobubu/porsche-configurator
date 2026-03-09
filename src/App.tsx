import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft, ChevronRight, Check,
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

// Generic 3-item carousel: center = full, sides = dimmed
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

  const prev = () => {
    const newIdx = idx > 0 ? idx - 1 : items.length - 1
    onSelect(getId(items[newIdx]))
  }
  const next = () => {
    const newIdx = idx < items.length - 1 ? idx + 1 : 0
    onSelect(getId(items[newIdx]))
  }

  return (
    <div className="opt-carousel">
      <button className="opt-arrow" onClick={prev}><ChevronLeft size={16} /></button>
      <div className="opt-track">
        {items.map((item, i) => {
          const isCenter = i === idx
          const isLeft = i === (idx - 1 + items.length) % items.length
          const isRight = i === (idx + 1) % items.length

          if (!isCenter && !isLeft && !isRight) return null

          return (
            <div
              key={getId(item)}
              className={`opt-item ${isCenter ? 'center' : 'side'} ${isLeft ? 'left' : ''} ${isRight ? 'right' : ''}`}
              onClick={() => !isCenter && onSelect(getId(item))}
            >
              {isCenter && <span className="opt-check"><Check size={10} /></span>}
              {renderItem(item, isCenter ? 'center' : 'side')}
            </div>
          )
        })}
      </div>
      <button className="opt-arrow" onClick={next}><ChevronRight size={16} /></button>
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

  return (
    <div className="app">
      {/* ===== NAVIGATION ===== */}
      <nav className="nav">
        <div className="nav-left">
          <img src="/images/porsche-logo.png" alt="Porsche" className="porsche-logo" />
        </div>

        <div className={`nav-center ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#" className="nav-pill active">Models</a>
          <a href="#">Services</a>
          <a href="#">Experience</a>
          <a href="#">Shop</a>
          <a href="#">Purchase</a>
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn hide-mobile"><LayoutGrid size={16} /></button>
          <button className="contact-btn hide-mobile">
            <Phone size={14} />
            <span>Contact Dealer</span>
          </button>
          <button className="nav-icon-btn hide-mobile"><Settings size={16} /></button>
          <button className="hamburger show-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ===== MAIN — NO SCROLL ===== */}
      <main className="main">
        {/* Top info bar */}
        <div className="info-bar">
          <div className="info-left">
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

        {/* Car viewport */}
        <div className="car-viewport">
          {/* Left side icons */}
          <div className="side-icons side-left">
            <SideIcon icon={<Lightbulb size={18} />} comingSoon tooltip="Headlights" />
            <SideIcon icon={<Disc3 size={18} />} comingSoon tooltip="Brakes" />
            <SideIcon icon={<Layers size={18} />} comingSoon tooltip="Trim" />
            <SideIcon icon={<Wind size={18} />} comingSoon tooltip="Exhaust" />
          </div>

          {/* Car image */}
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

          {/* Right side icons */}
          <div className="side-icons side-right">
            <SideIcon icon={<Car size={18} />} active={bodyType === 'coupe'} onClick={() => setBodyType('coupe')} tooltip="Coupe" />
            <SideIcon icon={<Sun size={18} />} active={bodyType === 'convertible'} onClick={() => setBodyType('convertible')} tooltip="Convertible" />
            <SideIcon icon={<RectangleHorizontal size={18} />} comingSoon tooltip="Spoiler" />
            <SideIcon icon={<FlipHorizontal2 size={18} />} comingSoon tooltip="Mirrors" />
          </div>
        </div>

        {/* ===== BOTTOM CARDS — CAROUSEL STYLE ===== */}
        <div className="bottom-cards">
          {/* Car Body */}
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

          {/* Wheels */}
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

          {/* Paint Color */}
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
                <div className="color-thumb">
                  <div className="color-swatch" style={{ background: item.hex }} />
                  {state === 'center' && <span className="opt-name">{item.name}</span>}
                </div>
              )}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
