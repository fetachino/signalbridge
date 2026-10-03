import { type CSSProperties, type ReactNode, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  AudioLines,
  Bell,
  Captions,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Contrast,
  CloudRain,
  Eye,
  Gauge,
  Info,
  LayoutGrid,
  Menu,
  MapPin,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Settings,
  Search,
  Accessibility,
  Volume2,
  Waves,
} from 'lucide-react'
import { buildDetectionTrace } from './lib/detectionPipeline'
import { usePersistentState } from './lib/usePersistentState'

type Alert = {
  id: string
  label: string
  title: string
  location: string
  issued: string
  expires: string
  confidence: number
  severity: 'critical' | 'watch' | 'info'
  summary: string
  action: string
  accent: string
  icon: typeof AlertTriangle
}

const alerts: Alert[] = [
  {
    id: 'tornado',
    label: 'TORNADO WARNING',
    title: 'Take shelter now',
    location: 'Marion County, Indiana',
    issued: '8:42 PM',
    expires: '9:30 PM',
    confidence: 94,
    severity: 'critical',
    summary: 'A tornado warning was detected in the current broadcast. The alert is active for your selected area.',
    action: 'Move indoors to a small interior room on the lowest floor, away from windows.',
    accent: '#ff6b5f',
    icon: AlertTriangle,
  },
  {
    id: 'flood',
    label: 'FLASH FLOOD WATCH',
    title: 'Prepare for rising water',
    location: 'Central Indiana',
    issued: '7:15 PM',
    expires: '11:00 PM',
    confidence: 89,
    severity: 'watch',
    summary: 'A flash flood watch was detected. Conditions may worsen quickly in low-lying areas.',
    action: 'Avoid flooded roads and move important items above floor level if water approaches.',
    accent: '#55b9e7',
    icon: CloudRain,
  },
  {
    id: 'shelter',
    label: 'COMMUNITY NOTICE',
    title: 'Cooling center open',
    location: 'Downtown Indianapolis',
    issued: '6:05 PM',
    expires: '10:00 PM',
    confidence: 97,
    severity: 'info',
    summary: 'The broadcast announced an accessible cooling center and free transportation for residents.',
    action: 'The center is open until 10 PM. Audio directions are available from the information panel.',
    accent: '#a98bff',
    icon: Info,
  },
]

const severityCopy = {
  critical: 'URGENT',
  watch: 'WATCH',
  info: 'NOTICE',
}

function App() {
  const [screen, setScreen] = useState<'home' | 'monitor' | 'history' | 'settings'>('monitor')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [spoken, setSpoken] = useState(false)
  const [largeText, setLargeText] = usePersistentState('signalbridge.largeText', false)
  const [highContrast, setHighContrast] = usePersistentState('signalbridge.highContrast', false)
  const [captions, setCaptions] = usePersistentState('signalbridge.captions', true)
  const [autoRead, setAutoRead] = usePersistentState('signalbridge.autoRead', false)
  const [reducedMotion, setReducedMotion] = usePersistentState('signalbridge.reducedMotion', false)
  const [scanState, setScanState] = useState<'ready' | 'scanning'>('ready')
  const [showDetails, setShowDetails] = useState(true)
  const alert = alerts[selected]
  const Icon = alert.icon

  const detection = useMemo(() => buildDetectionTrace(alert), [alert])

  function speakAlert() {
    setSpoken(true)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(`${alert.label}. ${alert.title}. ${alert.action}`)
      utterance.rate = 0.92
      window.speechSynthesis.speak(utterance)
    }
  }

  function reset() {
    setSelected(0)
    setPlaying(true)
    setSpoken(false)
    setLargeText(false)
    setShowDetails(true)
    setHighContrast(false)
    setCaptions(true)
    setAutoRead(false)
    setReducedMotion(false)
    setScanState('ready')
  }

  function scanFrame() {
    if (scanState === 'scanning') return
    setScanState('scanning')
    window.setTimeout(() => setScanState('ready'), 700)
  }

  const appClass = [largeText ? 'large-type' : '', highContrast ? 'high-contrast' : '', reducedMotion ? 'reduced-motion' : ''].filter(Boolean).join(' ')

  return (
    <main className={`app ${appClass}`}>
      <header className="topbar">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation"><Menu size={21} /></button>
        <div className="brand-lockup">
          <div className="brand-mark"><Waves size={22} strokeWidth={2.5} /></div>
          <div>
            <div className="brand-name">SIGNALBRIDGE</div>
            <div className="brand-subtitle">FIRE TV ACCESSIBILITY LAYER</div>
          </div>
        </div>
        <div className="top-status"><span className="live-dot" /> Broadcast monitor active <span className="divider" /> Indianapolis, IN</div>
        <button className="top-action" onClick={() => setScreen('history')}><Bell size={16} /> 3 alerts</button>
        <button className="top-action" onClick={() => setScreen('settings')}><Settings size={16} /> Preferences</button>
        <button className="icon-button" onClick={reset} aria-label="Reset demo"><RotateCcw size={18} /></button>
      </header>

      <nav className={menuOpen ? 'tv-nav open' : 'tv-nav'} aria-label="Primary navigation">
        <button className={screen === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => { setScreen('home'); setMenuOpen(false) }}><LayoutGrid size={17} /> Home</button>
        <button className={screen === 'monitor' ? 'nav-item active' : 'nav-item'} onClick={() => { setScreen('monitor'); setMenuOpen(false) }}><Radio size={17} /> Live monitor <span className="nav-live" /></button>
        <button className={screen === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => { setScreen('history'); setMenuOpen(false) }}><Bell size={17} /> Alert history</button>
        <button className={screen === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => { setScreen('settings'); setMenuOpen(false) }}><Settings size={17} /> Accessibility</button>
        <div className="nav-spacer" />
        <span className="nav-hint">Use the remote to explore</span>
      </nav>

      <section className="home-screen" style={{ display: screen === 'home' ? 'block' : 'none' }}>
        <div className="home-hero">
          <div className="home-hero-copy"><span className="eyebrow">YOUR SAFETY LAYER</span><h1>Never miss the message behind the message.</h1><p>SignalBridge turns fast, visual broadcast alerts into calm, actionable guidance designed for the living room.</p><button className="primary-action home-cta" onClick={() => setScreen('monitor')}>Open live monitor <ArrowUpRight size={17} /></button></div>
          <div className="home-hero-art"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><div className="hero-signal"><Waves size={40} /><span>ALERT<br />READY</span></div><div className="hero-chip chip-top"><ShieldCheck size={14} /> Source verified</div><div className="hero-chip chip-bottom"><Volume2 size={14} /> Spoken guidance</div></div>
        </div>
        <div className="home-metrics"><div><Gauge size={18} /><strong>98.4%</strong><span>signal readability</span></div><div><Accessibility size={18} /><strong>3 modes</strong><span>visual, caption, voice</span></div><div><CheckCircle2 size={18} /><strong>Verified</strong><span>source-aware guidance</span></div></div>
        <div className="home-section-heading"><div><span className="eyebrow">SIGNALBRIDGE LIBRARY</span><h2>Designed around real moments</h2></div><button className="subtle-button" onClick={() => setScreen('history')}>View all <ChevronRight size={14} /></button></div>
        <div className="home-rail">{alerts.map((item, index) => { const ItemIcon = item.icon; return <button className="feature-card" key={item.id} onClick={() => { setSelected(index); setScreen('monitor') }}><span className="feature-icon" style={{ color: item.accent }}><ItemIcon size={24} /></span><span className="feature-kicker">{severityCopy[item.severity]}</span><strong>{item.title}</strong><small>{item.location}</small><span className="feature-arrow"><ArrowUpRight size={16} /></span></button> })}</div>
      </section>

      <section className="settings-screen" style={{ display: screen === 'settings' ? 'block' : 'none' }}>
        <div className="settings-hero"><div><span className="eyebrow">ACCESSIBILITY CONTROL CENTER</span><h1>Make every alert easier to understand.</h1><p>Choose how SignalBridge presents information on your TV. Changes apply immediately to the demo.</p></div><div className="settings-hero-icon"><Accessibility size={42} /></div></div>
        <div className="settings-layout">
          <div className="settings-card"><div className="settings-card-heading"><div><span className="eyebrow">PRESENTATION</span><h2>Display and audio</h2></div><span className="settings-state">LIVE PREVIEW</span></div>
            <SettingRow icon={<Eye size={18} />} title="Large text" description="Increase labels and guidance text across the experience." enabled={largeText} onToggle={() => setLargeText(!largeText)} />
            <SettingRow icon={<Contrast size={18} />} title="High contrast" description="Strengthen borders and color separation for low-vision viewing." enabled={highContrast} onToggle={() => setHighContrast(!highContrast)} />
            <SettingRow icon={<Captions size={18} />} title="Broadcast captions" description="Keep detected on-screen speech visible below the video feed." enabled={captions} onToggle={() => setCaptions(!captions)} />
            <SettingRow icon={<Volume2 size={18} />} title="Read urgent alerts aloud" description="Automatically speak critical guidance when a new alert is detected." enabled={autoRead} onToggle={() => setAutoRead(!autoRead)} />
            <SettingRow icon={<Radio size={18} />} title="Reduce motion" description="Remove animated radar and transition effects." enabled={reducedMotion} onToggle={() => setReducedMotion(!reducedMotion)} />
          </div>
          <div className="settings-card preview-card"><div className="settings-card-heading"><div><span className="eyebrow">DESIGN PRINCIPLE</span><h2>Explain the signal</h2></div><ShieldCheck size={22} color="#6ee7e0" /></div><div className="principle-list"><div><span>01</span><b>Make urgency obvious</b><p>Severity, timing, and the recommended next step appear together.</p></div><div><span>02</span><b>Show the evidence</b><p>Detection stages and confidence stay visible instead of becoming a black box.</p></div><div><span>03</span><b>Respect the viewer</b><p>Voice, captions, high contrast, and large type are first-class controls.</p></div></div><button className="primary-action" onClick={() => setScreen('monitor')}>Preview live monitor <ArrowUpRight size={17} /></button></div>
        </div>
      </section>

      <section className="history-screen" style={{ display: screen === 'history' ? 'block' : 'none' }}>
        <div className="history-hero"><div><span className="eyebrow">ALERT HISTORY</span><h1>Your household signal log</h1><p>Review what SignalBridge saw, what it recommended, and why it trusted the source.</p></div><div className="history-stat"><strong>03</strong><span>alerts today</span></div></div>
        <div className="history-full-grid">{alerts.map((item, index) => { const ItemIcon = item.icon; return <button className="history-full-card" key={item.id} onClick={() => { setSelected(index); setScreen('monitor') }}><span className="history-full-icon" style={{ color: item.accent }}><ItemIcon size={22} /></span><span className="history-full-copy"><span className="feature-kicker">{severityCopy[item.severity]} · {item.issued}</span><strong>{item.label}</strong><small>{item.location}</small><p>{item.action}</p></span><ChevronRight size={19} /></button> })}</div>
      </section>

      <section className={screen === 'monitor' ? 'hero-grid' : 'hero-grid hidden-screen'}>
        <div className="video-card">
          <div className="video-toolbar">
            <span className="live-pill"><Radio size={14} /> LIVE FEED</span>
            <span className="feed-name">WISH 8 WEATHER DESK</span>
            <span className="feed-time">20:42:18</span>
          </div>
          <div className="broadcast-scene">
            <div className="scene-grid" />
            <div className="weather-bug"><span>WISH 8</span><b>WEATHER</b></div>
            <div className="radar-orb"><div className="radar-sweep" /><span>LIVE RADAR</span></div>
            <div className="broadcast-copy"><span>SEVERE WEATHER UPDATE</span><strong>Stay alert. Conditions changing.</strong></div>
            {showDetails && <div className="detected-box"><span>OpenCV detection region</span><i /></div>}
            {captions && <div className="caption-strip">...a warning has been issued for Marion County and surrounding areas...</div>}
          </div>
          <div className="video-controls">
            <button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause feed' : 'Play feed'}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
            <div className="timeline"><span className="timeline-fill" /><span className="timeline-thumb" /></div>
            <span className="control-label">Alert scan {playing ? 'running' : 'paused'}</span>
            <button className="scan-button" onClick={scanFrame} disabled={scanState === 'scanning'}><Search size={13} /> {scanState === 'scanning' ? 'Scanning frame' : 'Scan frame'}</button>
            <button className="subtle-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide' : 'Show'} overlay</button>
          </div>
        </div>

        <div className="alert-card" style={{ '--accent': alert.accent } as CSSProperties}>
          <div className="alert-card-head"><span className="status-kicker"><span className="pulse" /> DETECTED {severityCopy[alert.severity]}</span><span className="confidence"><ShieldCheck size={14} /> {alert.confidence}% confident</span></div>
          <div className="alert-icon"><Icon size={30} /></div>
          <div className="alert-label">{alert.label}</div>
          <h1>{alert.title}</h1>
          <p className="summary">{alert.summary}</p>
          <div className="location-line"><MapPin size={16} /> {alert.location} <span className="bullet">•</span> Issued {alert.issued}</div>
          <div className="action-box"><span className="action-label">RECOMMENDED ACTION</span><p>{alert.action}</p></div>
          <div className="card-actions">
            <button className="primary-action" onClick={speakAlert}><Volume2 size={18} /> {spoken ? 'Playing guidance' : 'Read this aloud'}</button>
            <button className={largeText ? 'secondary-action active' : 'secondary-action'} onClick={() => setLargeText(!largeText)}><Eye size={17} /> Large text</button>
          </div>
          <div className="alert-meta"><span>Valid until {alert.expires}</span><span className="verified"><Check size={14} /> Source verified</span></div>
        </div>
      </section>

      <section className={screen === 'monitor' ? 'lower-grid' : 'lower-grid hidden-screen'}>
        <div className="panel detection-panel">
          <div className="panel-heading"><div><span className="eyebrow">TRANSPARENT AI</span><h2>Detection trace</h2></div><span className="processing" aria-live="polite"><Sparkles size={14} /> {scanState === 'scanning' ? 'Scanning frame' : 'Ready for next frame'}</span></div>
          <div className="trace-flow">{detection.stages.map((stage, index) => <span className="trace-step" key={stage.label}><span className={`trace-node ${stage.status}`}>{stage.label}</span>{index < detection.stages.length - 1 && <span className={stage.status === 'pending' ? 'trace-line' : 'trace-line active'} />}</span>)}</div>
          <div className="trace-table">{detection.evidence.map((row) => <div className="trace-row" key={row.name}><span>{row.name}</span><b>{row.result}</b><em>{row.confidence}</em></div>)}</div>
          <p className="panel-note"><CircleHelp size={14} /> {detection.explanation} SignalBridge shows its evidence so viewers can decide whether to trust the guidance.</p>
        </div>
        <div className="panel history-panel">
          <div className="panel-heading"><div><span className="eyebrow">ALERT HISTORY</span><h2>Recent detections</h2></div><span className="count-badge">{alerts.length} today</span></div>
          <div className="history-list">{alerts.map((item, index) => { const ItemIcon = item.icon; return <button className={index === selected ? 'history-item selected' : 'history-item'} key={item.id} onClick={() => { setSelected(index); setSpoken(false) }}><span className="history-icon" style={{ color: item.accent }}><ItemIcon size={16} /></span><span className="history-text"><b>{item.label}</b><small>{item.location}</small></span><span className="history-time">{item.issued}</span><ChevronRight size={16} /></button> })}</div>
        </div>
      </section>

      <footer className="footer"><span><AudioLines size={15} /> Designed for low vision, older adults, and viewers who need information explained clearly.</span><span className="footer-right">SignalBridge prototype <span className="divider" /> v0.1.0</span></footer>
    </main>
  )
}

function SettingRow({ icon, title, description, enabled, onToggle }: { icon: ReactNode; title: string; description: string; enabled: boolean; onToggle: () => void }) {
  return <div className="setting-row"><span className="setting-icon">{icon}</span><span className="setting-copy"><b>{title}</b><small>{description}</small></span><button className={enabled ? 'toggle on' : 'toggle'} onClick={onToggle} aria-pressed={enabled} aria-label={`${title}: ${enabled ? 'on' : 'off'}`}><span /></button></div>
}

export default App
