import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useDisplays } from '../hooks/useDisplays'
import type { DisplaySlot } from '../types/dashboard'
import logo from '../assets/phinix-logo.svg'
import './CustomerPage.css'

const media = import.meta.glob('../assets/customer/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const poster = media['../assets/customer/station.jpg']
const video = media['../assets/customer/preview.mp4']
const money = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)

export default function CustomerPage() {
  const { displays } = useDisplays()
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<DisplaySlot | null>(null)
  const [step, setStep] = useState(1)
  const [slots, setSlots] = useState(1)
  const [date, setDate] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const open = (display: DisplaySlot) => {
    setSelected(display); setStep(1); setMessage(''); setSlots(1)
    dialog.current?.showModal()
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (step === 1) { setStep(2); return }
    if (!selected || !Number.isInteger(slots) || slots < 1 || slots > 100) return
    try {
      localStorage.setItem('phinix-booking-draft-v1', JSON.stringify({ displayId: selected.id, date, email, slots, durationSeconds: slots * 15 }))
      setStep(3)
    } catch { setMessage('Der Browser konnte den Entwurf nicht speichern. Bitte erlaube lokalen Speicher.') }
  }
  return <div className="customer-shell">
    <header className="customer-header">
      <Link to="/" className="customer-brand"><img src={logo} alt="" /><span>PHINIX<span>MEDIA.SCREENS</span></span></Link>
      <nav aria-label="Kundennavigation"><button onClick={() => document.getElementById('spots')?.scrollIntoView({ behavior: 'smooth' })}>Displays</button><Link to="/admin">Admin Login ↗</Link></nav>
      <span className="customer-badge">PUBLIC PREVIEW</span>
    </header>
    <main>
      <section className="customer-intro"><p className="customer-eyebrow">DEINE STADT. DEINE STORY. DEIN SCREEN.</p><h1>15 Sekunden.<br /><span>Ein bleibender Eindruck.</span></h1><div><p>Vom Bahnsteig bis zum nächsten großen Event.<br />Finde die Bühne für deine Brand.</p><p className="customer-demo">Demo: Standorte, Preise und Verfügbarkeit sind Beispieldaten.</p></div></section>
      <section id="spots" className="display-grid" aria-label="Acht Display-Standorte">
        {displays.slice(0, 8).map((display, i) => <article key={display.id} className={`display-tile tile-${i}`}>
          <div className="tile-media">
            {video ? <video controls playsInline preload="none" poster={poster} aria-label={`Demo-Video ${display.location}`}><source src={video} type="video/mp4" /></video> : poster ? <img src={poster} alt="Visualisierung eines Displays am Bahnhof" loading={i ? 'lazy' : 'eager'} /> : <div className="media-placeholder"><span>PHINIX<span>YOUR STORY HERE.</span></span><small>Medienvorschau folgt</small></div>}
            <span className="tile-label">{String(i + 1).padStart(2, '0')} / {display.mediaType.toUpperCase()}</span>
          </div>
          <div className="tile-info"><span className="customer-eyebrow">{display.city} · Demo-Standort</span><h2>{display.location}</h2><div className="tile-bottom"><span>{money(display.ratePerSlot)} <small>/ 15 Sek.</small></span><button onClick={() => open(display)} aria-label={`${display.location} auswählen`}>Spot wählen ↗</button></div></div>
        </article>)}
      </section>
      <section className="customer-steps"><div><span>01</span><h2>Deinen Spot finden.</h2><p>Bahnhof, City, Kultur oder Event: Dort, wo deine Leute sind.</p></div><div><span>02</span><h2>Deinen Moment planen.</h2><p>Wunschtermin und Anzahl der 15-Sekunden-Slots auswählen.</p></div><div><span>03</span><h2>Deine Idee festhalten.</h2><p>Speichere deinen Buchungsentwurf lokal. Die verbindliche Buchung folgt.</p></div></section>
      <section className="customer-pulse"><div><p className="customer-eyebrow">SCREEN PULSE / BEISPIELDATEN</p><h2>Dein nächster Auftritt<br />ist nur einen Spot entfernt.</h2><p>Die Live-Verfügbarkeit wird nach der Backend-Anbindung angezeigt.</p></div><svg viewBox="0 0 600 180" role="img" aria-label="Illustrativer Auslastungsverlauf, keine Live-Daten"><path d="M0 150H600 M0 90H600 M0 30H600" stroke="#ffffff15" /><path className="pulse-line" d="M0 140L55 100L110 115L170 35L230 80L290 60L350 110L410 45L470 70L535 25L600 50" fill="none" stroke="#baff66" strokeWidth="3" /></svg></section>
      <section className="customer-stories"><p className="customer-eyebrow">CITY STORIES / INSPIRATION</p><h2>Raus aus dem Feed.<br />Rein in die Stadt.</h2><div>{[['Bahnhöfe','Nächster Halt: deine Brand.'],['Innenstadt','Deine Story. Mitten im Leben.'],['Kultur','Große Ideen brauchen große Bühnen.'],['Messen & Events','Zeig dich, bevor der Vorhang fällt.']].map(([tag,title]) => <article key={tag}><p>{tag}</p><h3>{title}</h3></article>)}</div></section>
    </main>
    <footer className="customer-footer"><span>PHINIX.MEDIA.SCREENS</span><p>Konzeptvorschau · Keine verbindlichen Buchungen oder Zahlungen.</p><Link to="/admin">Zum Dashboard ↗</Link></footer>
    <dialog ref={dialog} className="booking-dialog"><button className="booking-close" aria-label="Schließen" onClick={() => dialog.current?.close()}>×</button><p className="customer-eyebrow">BUCHUNGSENTWURF · SCHRITT {step} VON 3</p><h2>{selected?.location}</h2>{step < 3 ? <form onSubmit={submit}>
      {step === 1 ? <><label>Wunschtermin<input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} /></label><label>15-Sekunden-Slots<input type="number" min="1" max="100" step="1" required value={slots} onChange={e => setSlots(Number(e.target.value))} /></label><p>{slots * 15} Sekunden · Beispielpreis {money(slots * (selected?.ratePerSlot ?? 0))}</p></> : <><p>{slots} Slots · {slots * 15} Sekunden · {date.replace('T', ' ')}</p><label>Deine E-Mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><p>Nur als Entwurf in diesem Browser gespeichert. Es wird keine Anfrage versendet und kein Display reserviert.</p><button type="button" onClick={() => setStep(1)}>Zurück</button></>}
      {message && <p role="alert">{message}</p>}<button type="submit" className="booking-next">{step === 1 ? 'Weiter →' : 'Entwurf lokal speichern'}</button>
    </form> : <div role="status"><h3>Dein Entwurf ist gespeichert.</h3><p>Deine Auswahl bleibt in diesem Browser. Für eine echte Buchung muss das Buchungsbackend noch angebunden werden.</p><button onClick={() => dialog.current?.close()}>Weitere Spots entdecken</button></div>}</dialog>
  </div>
}
