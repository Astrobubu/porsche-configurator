import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Search, Share2, ShoppingCart, RotateCcw, ChevronLeft, ChevronRight,
  Sun
} from 'lucide-react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Configuration types
type CarColor = 'silver' | 'black' | 'red' | 'blue' | 'white'
type BodyType = 'coupe' | 'convertible'
type WheelType = 'wheel1' | 'wheel2' | 'wheel3'
type DriveType = '2WD' | '4WD'
type HeadlightType = 'led' | 'standard'
type BrakeType = 'red' | 'yellow' | 'black' | 'silver'
type TreadType = 'sport' | 'allseason' | 'offroad'
type TrimType = 'carbon' | 'aluminum'

// Car images
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

const treadImages: Record<TreadType, string> = {
  sport: '/images/tread-sport.png',
  allseason: '/images/tread-allseason.png',
  offroad: '/images/tread-offroad.png'
}

const headlightImages: Record<HeadlightType, string> = {
  led: '/images/headlight-led.png',
  standard: '/images/headlight-standard.png'
}

const brakeImages: Record<BrakeType, string> = {
  red: '/images/brake-red.png',
  yellow: '/images/brake-yellow.png',
  black: '/images/brake-black.png',
  silver: '/images/brake-silver.png'
}

const trimImages: Record<TrimType, string> = {
  carbon: '/images/trim-carbon.png',
  aluminum: '/images/trim-aluminum.png'
}

// Options data
const colorOptions: { id: CarColor; name: string; hex: string }[] = [
  { id: 'silver', name: 'GT Silver', hex: '#C0C0C0' },
  { id: 'black', name: 'Jet Black', hex: '#1a1a1a' },
  { id: 'red', name: 'Carmine Red', hex: '#c41e3a' },
  { id: 'blue', name: 'Gentian Blue', hex: '#1e3a5f' },
  { id: 'white', name: 'Carrara White', hex: '#f5f5f5' }
]

const wheelOptions: { id: WheelType; name: string; price: number }[] = [
  { id: 'wheel1', name: 'Carrera Classic', price: 1800 },
  { id: 'wheel2', name: 'RS Spyder', price: 3403 },
  { id: 'wheel3', name: 'SportDesign', price: 4200 }
]

const treadOptions: { id: TreadType; name: string; price: number }[] = [
  { id: 'sport', name: 'Sport Performance', price: 800 },
  { id: 'allseason', name: 'All-Season', price: 0 },
  { id: 'offroad', name: 'All-Terrain', price: 1200 }
]

const headlightOptions: { id: HeadlightType; name: string; price: number }[] = [
  { id: 'standard', name: 'LED', price: 0 },
  { id: 'led', name: 'Matrix LED', price: 2400 }
]

const brakeOptions: { id: BrakeType; name: string; price: number }[] = [
  { id: 'silver', name: 'Silver', price: 0 },
  { id: 'red', name: 'Racing Red', price: 900 },
  { id: 'yellow', name: 'Sport Yellow', price: 900 },
  { id: 'black', name: 'Stealth Black', price: 900 }
]

const trimOptions: { id: TrimType; name: string; price: number }[] = [
  { id: 'aluminum', name: 'Brushed Alum.', price: 0 },
  { id: 'carbon', name: 'Carbon Fiber', price: 3500 }
]

// Carousel Component
interface CarouselProps<T> {
  items: T[]
  selectedId: string
  onSelect: (id: string) => void
  renderItem: (item: T, isCenter: boolean) => React.ReactNode
  getId: (item: T) => string
}

function Carousel<T>({ items, selectedId, onSelect, renderItem, getId }: CarouselProps<T>) {
  const selectedIndex = items.findIndex(item => getId(item) === selectedId)
  
  return (
    <div className="carousel-container">
      <button 
        className="carousel-nav carousel-prev"
        onClick={() => {
          const newIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1
          onSelect(getId(items[newIndex]))
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="carousel-track">
        {items.map((item, index) => {
          const isCenter = index === selectedIndex
          const isLeft = index === (selectedIndex - 1 + items.length) % items.length
          const isRight = index === (selectedIndex + 1) % items.length
          
          if (!isCenter && !isLeft && !isRight) return null
          
          return (
            <div
              key={getId(item)}
              className={`carousel-item ${isCenter ? 'center' : ''} ${isLeft ? 'left' : ''} ${isRight ? 'right' : ''}`}
              onClick={() => !isCenter && onSelect(getId(item))}
            >
              {renderItem(item, isCenter)}
            </div>
          )
        })}
      </div>
      
      <button 
        className="carousel-nav carousel-next"
        onClick={() => {
          const newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0
          onSelect(getId(items[newIndex]))
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function App() {
  // Configuration state
  const [carColor, setCarColor] = useState<CarColor>('silver')
  const [bodyType, setBodyType] = useState<BodyType>('coupe')
  const [wheelType, setWheelType] = useState<WheelType>('wheel2')
  const [driveType, setDriveType] = useState<DriveType>('4WD')
  const [treadType, setTreadType] = useState<TreadType>('sport')
  const [headlightType, setHeadlightType] = useState<HeadlightType>('led')
  const [brakeType, setBrakeType] = useState<BrakeType>('red')
  const [trimType, setTrimType] = useState<TrimType>('carbon')
  
  // UI state
  const [cartItems, setCartItems] = useState(0)
  const [notification, setNotification] = useState<string | null>(null)

  // Circular transition state
  const [displayedImage, setDisplayedImage] = useState(carImages[carColor][bodyType])
  const [incomingImage, setIncomingImage] = useState<string | null>(null)
  const [transitionKey, setTransitionKey] = useState(0)

  const targetImage = carImages[carColor][bodyType]

  useEffect(() => {
    if (targetImage !== displayedImage && !incomingImage) {
      // Preload the new image before starting transition
      const img = new Image()
      img.src = targetImage
      img.onload = () => {
        setIncomingImage(targetImage)
        setTransitionKey(k => k + 1)
      }
      // If already cached, onload fires synchronously or very fast
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
  
  // Price calculation
  const basePrice = 276000
  const accessoryPrice = 4350
  const wheelPrice = wheelOptions.find(w => w.id === wheelType)?.price || 0
  const drivePrice = driveType === '4WD' ? 1800 : 0
  const bodyPrice = bodyType === 'convertible' ? 3500 : 0
  const treadPrice = treadOptions.find(t => t.id === treadType)?.price || 0
  const headlightPrice = headlightOptions.find(h => h.id === headlightType)?.price || 0
  const brakePrice = brakeOptions.find(b => b.id === brakeType)?.price || 0
  const trimPrice = trimOptions.find(t => t.id === trimType)?.price || 0
  const totalPrice = basePrice + accessoryPrice + wheelPrice + drivePrice + bodyPrice + treadPrice + headlightPrice + brakePrice + trimPrice

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const addToCart = () => {
    setCartItems(prev => prev + 1)
    showNotification('Added to cart!')
  }

  const resetConfig = () => {
    setCarColor('silver')
    setBodyType('coupe')
    setWheelType('wheel2')
    setDriveType('4WD')
    setTreadType('sport')
    setHeadlightType('led')
    setBrakeType('red')
    setTrimType('carbon')
    showNotification('Reset to default')
  }

  const shareConfig = () => {
    showNotification('Link copied!')
  }

  // Refs for scroll animations
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
      )
    }, mainRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="app">
      {/* Notification */}
      {notification && (
        <div className="notification">
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <img src="/images/porsche-logo.png" alt="Porsche" className="porsche-logo" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }} />
          <span className="logo-text">PORSCHE</span>
        </div>
        
        <div className="nav-links">
          <a href="#">Models</a>
          <a href="#">Services</a>
          <a href="#">Experience</a>
          <a href="#">Shop</a>
        </div>
        
        <div className="nav-right">
          <button className="nav-btn"><Search className="w-4 h-4" /></button>
          <button className="nav-btn" onClick={shareConfig}><Share2 className="w-4 h-4" /></button>
          <button className="nav-btn cart-btn" onClick={addToCart}>
            <ShoppingCart className="w-4 h-4" />
            {cartItems > 0 && <span className="cart-badge">{cartItems}</span>}
          </button>
        </div>
      </nav>

      {/* Main Configurator */}
      <main className="configurator">
        {/* Left Controls */}
        <div className="side-controls left">
          <div className="control-group coming-soon-overlay">
            <span className="control-label">Headlights</span>
            <Carousel
              items={headlightOptions}
              selectedId={headlightType}
              onSelect={(id) => setHeadlightType(id as HeadlightType)}
              getId={(item) => item.id}
              renderItem={(item, isCenter) => (
                <div className="headlight-preview">
                  <img src={headlightImages[item.id]} alt={item.name} />
                  {isCenter && <span className="item-label">{item.name}</span>}
                </div>
              )}
            />
          </div>
          
          <div className="control-group coming-soon-overlay">
            <span className="control-label">Brakes</span>
            <Carousel
              items={brakeOptions}
              selectedId={brakeType}
              onSelect={(id) => setBrakeType(id as BrakeType)}
              getId={(item) => item.id}
              renderItem={(item, isCenter) => (
                <div className="brake-preview">
                  <img src={brakeImages[item.id]} alt={item.name} />
                  {isCenter && <span className="item-label">{item.name}</span>}
                </div>
              )}
            />
          </div>
          
          <div className="control-group small coming-soon-overlay">
            <span className="control-label">Trim</span>
            <div className="mini-selector">
              {trimOptions.map(opt => (
                <button
                  key={opt.id}
                  className={`mini-btn ${trimType === opt.id ? 'active' : ''}`}
                  onClick={() => setTrimType(opt.id)}
                >
                  <img src={trimImages[opt.id]} alt={opt.name} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="control-group small coming-soon-overlay">
            <span className="control-label">Exhaust</span>
            <div className="mini-selector">
              <button className="mini-btn active">
                <img src="/images/exhaust-sport.png" alt="Sport" />
              </button>
            </div>
          </div>
        </div>

        {/* Center - Car Display */}
        <div className="car-display">
          <div className="car-info">
            <h1 className="car-name">Tagra-4</h1>
            <p className="car-subtitle">911 Carrera — Personal Edition</p>
            <div className="car-specs">
              <span className="spec-badge" style={{ backgroundColor: colorOptions.find(c => c.id === carColor)?.hex }}></span>
              <span>{colorOptions.find(c => c.id === carColor)?.name}</span>
              <span className="divider">|</span>
              <span>{bodyType === 'coupe' ? 'Coupe' : 'Convertible'}</span>
            </div>
          </div>
          
          <div className="car-image-container">
            <div className="car-image-wrapper">
              <img
                src={displayedImage}
                alt="Porsche 911"
                className="car-image"
              />
              {incomingImage && (
                <img
                  key={transitionKey}
                  src={incomingImage}
                  alt="Porsche 911"
                  className="car-image-enter"
                />
              )}
            </div>
          </div>
          
          <div className="price-display">
            <span className="price">${totalPrice.toLocaleString()}</span>
            <span className="accessories">+ ${accessoryPrice.toLocaleString()} accessories</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="side-controls right">
          <div className="control-group">
            <span className="control-label">Roof</span>
            <button 
              className={`toggle-btn ${bodyType === 'convertible' ? 'active' : ''}`}
              onClick={() => setBodyType(bodyType === 'coupe' ? 'convertible' : 'coupe')}
            >
              <Sun className="w-5 h-5" />
              <span>{bodyType === 'convertible' ? 'Open' : 'Closed'}</span>
            </button>
          </div>
          
          <div className="control-group small coming-soon-overlay">
            <span className="control-label">Spoiler</span>
            <div className="mini-selector">
              <button className="mini-btn active">
                <img src="/images/spoiler-active.png" alt="Active" />
              </button>
            </div>
          </div>
          
          <div className="control-group small coming-soon-overlay">
            <span className="control-label">Mirrors</span>
            <div className="mini-selector">
              <button className="mini-btn active">
                <img src="/images/mirror-carbon.png" alt="Carbon" />
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <span className="control-label">Actions</span>
            <div className="action-buttons">
              <button className="action-btn" onClick={resetConfig}>
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="action-btn primary" onClick={addToCart}>
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Cards - Carousel Style */}
        <div className="bottom-cards">
          {/* Wheels Card */}
          <div className="config-card">
            <div className="card-header">
              <span className="card-title">Wheels</span>
              <span className="card-price">+${wheelPrice.toLocaleString()}</span>
            </div>
            <Carousel
              items={wheelOptions}
              selectedId={wheelType}
              onSelect={(id) => setWheelType(id as WheelType)}
              getId={(item) => item.id}
              renderItem={(item, isCenter) => (
                <div className="wheel-preview">
                  <img src={wheelImages[item.id]} alt={item.name} />
                  {isCenter && <span className="item-label">{item.name}</span>}
                </div>
              )}
            />
          </div>

          {/* Drive Type Card */}
          <div className="config-card drive-card">
            <div className="card-header">
              <span className="card-title">Drive System</span>
              <span className="card-price">+${drivePrice.toLocaleString()}</span>
            </div>
            <div className="drive-selector">
              <button 
                className={`drive-option ${driveType === '2WD' ? 'active' : ''}`}
                onClick={() => setDriveType('2WD')}
              >
                <img src={transmissionImages['2WD']} alt="2WD" />
                <span className="drive-label">2WD</span>
              </button>
              <button 
                className={`drive-option ${driveType === '4WD' ? 'active' : ''}`}
                onClick={() => setDriveType('4WD')}
              >
                <img src={transmissionImages['4WD']} alt="4WD" />
                <span className="drive-label">4WD</span>
              </button>
            </div>
          </div>

          {/* Treads Card */}
          <div className="config-card">
            <div className="card-header">
              <span className="card-title">Tire Tread</span>
              <span className="card-price">+${treadPrice.toLocaleString()}</span>
            </div>
            <Carousel
              items={treadOptions}
              selectedId={treadType}
              onSelect={(id) => setTreadType(id as TreadType)}
              getId={(item) => item.id}
              renderItem={(item, isCenter) => (
                <div className="tread-preview">
                  <img src={treadImages[item.id]} alt={item.name} />
                  {isCenter && <span className="item-label">{item.name}</span>}
                </div>
              )}
            />
          </div>

          {/* Color Card */}
          <div className="config-card color-card">
            <div className="card-header">
              <span className="card-title">Paint</span>
            </div>
            <div className="color-grid">
              {colorOptions.map(color => (
                <button
                  key={color.id}
                  className={`color-btn ${carColor === color.id ? 'active' : ''}`}
                  onClick={() => setCarColor(color.id)}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
