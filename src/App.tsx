import { type CSSProperties, useMemo, useState } from 'react'
import {
  AlertTriangle,
  AudioLines,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Eye,
  Info,
  MapPin,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  Waves,
} from 'lucide-react'

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
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [spoken, setSpoken] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const alert = alerts[selected]
  const Icon = alert.icon

  const detectionRows = useMemo(
    () => [
      ['Text region', 'Detected', '98%'],
      ['Alert symbol', alert.severity === 'critical' ? 'Matched' : 'Classified', `${alert.confidence}%`],
      ['Location match', 'Marion County', '91%'],
    ],
    [alert],
  )

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
  }

  return (
    <main className={largeText ? 'app large-type' : 'app'}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Waves size={22} strokeWidth={2.5} /></div>
          <div>
            <div className="brand-name">SIGNALBRIDGE</div>
            <div className="brand-subtitle">FIRE TV ACCESSIBILITY LAYER</div>
          </div>
        </div>
        <div className="top-status"><span className="live-dot" /> Broadcast monitor active <span className="divider" /> Indianapolis, IN</div>
        <button className="icon-button" onClick={reset} aria-label="Reset demo"><RotateCcw size={18} /></button>
      </header>

      <section className="hero-grid">
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
            <div className="detected-box"><span>OpenCV detection region</span><i /></div>
            <div className="caption-strip">...a warning has been issued for Marion County and surrounding areas...</div>
          </div>
          <div className="video-controls">
            <button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause feed' : 'Play feed'}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
            <div className="timeline"><span className="timeline-fill" /><span className="timeline-thumb" /></div>
            <span className="control-label">Alert scan {playing ? 'running' : 'paused'}</span>
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

      <section className="lower-grid">
        <div className="panel detection-panel">
          <div className="panel-heading"><div><span className="eyebrow">TRANSPARENT AI</span><h2>Detection trace</h2></div><span className="processing"><Sparkles size={14} /> Processing in real time</span></div>
          <div className="trace-flow"><span className="trace-node done">Frame</span><span className="trace-line active" /><span className="trace-node done">Text</span><span className="trace-line active" /><span className="trace-node done">Classify</span><span className="trace-line" /><span className="trace-node current">Guide</span></div>
          <div className="trace-table">{detectionRows.map(([name, result, value]) => <div className="trace-row" key={name}><span>{name}</span><b>{result}</b><em>{value}</em></div>)}</div>
          <p className="panel-note"><CircleHelp size={14} /> SignalBridge shows its evidence so viewers can decide whether to trust the guidance.</p>
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

export default App
