import { useEffect, useState } from 'react'
import {
  ChevronLeft, ChevronRight,
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

function App() {
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
          <a href="#" className="nav-pill active">Models</a>
          <a href="#">Services</a>
          <a href="#">Experience</a>
          <a href="#">Shop</a>
          <a href="#">Purchase</a>
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
      <main className="main">
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

        {/* ===== BOTTOM CARDS ===== */}
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

          {/* Paint Color — uses car images instead of swatches */}
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
      </main>
    </div>
  )
}

export default App
