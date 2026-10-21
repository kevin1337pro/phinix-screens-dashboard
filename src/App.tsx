import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import phinixLogoLight from './assets/phinix-logo.svg'
import phinixLogoDark from './assets/phinix-logo.svg'
import menuLogoLight from './assets/Logo_Phinix_media_neu_black.svg'
import menuLogoDark from './assets/Logo_Phinix_media_neu_black.svg'
import AuthGate from './components/AuthGate'
import DisplayUtilizationChart from './components/DisplayUtilizationChart'
import ThemeToggle from './components/ThemeToggle'
import UtilizationDetail from './components/UtilizationDetail'
import { quickLinks } from './data/quickLinks'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import { useDisplayUtilization } from './hooks/useDisplayUtilization'
import { useExtensions } from './hooks/useExtensions'
import { useNews } from './hooks/useNews'
import { getInitials } from './utils/text'
import type {
  CommentThread,
  DisplayUtilizationPoint,
  ExtensionStatus,
  NewsArticle,
  QuickLink as QuickLinkType,
} from './types/dashboard'
import './App.css'

const statusLabel: Record<ExtensionStatus, string> = {
  enabled: 'ENABLED',
  disabled: 'DISABLED',
  maintenance: 'MAINTENANCE',
}

const statusClass: Record<ExtensionStatus, string> = {
  enabled: 'status-pill status-enabled',
  disabled: 'status-pill status-disabled',
  maintenance: 'status-pill status-maintenance',
}

const agentCatalog = [
  {
    id: 'voice',
    title: 'Voice Agents',
    description: 'Telefonische und sprachgesteuerte Interfaces für Stores, Infopoints und Hotline-Automation.',
    agents: [
      { name: 'VoxBerlin', status: 'active', channel: 'Digital Signage Hotline', uptime: '99.9%', locale: 'DE/EN' },
      { name: 'Aurora Stage', status: 'active', channel: 'Stage Announcements', uptime: '99.4%', locale: 'EN' },
      { name: 'EchoLite', status: 'inactive', channel: 'Info-Terminal Sprachausgabe', uptime: '—', locale: 'DE' },
    ],
  },
  {
    id: 'chat',
    title: 'Chat Agents',
    description: 'Conversational Bots für Kundenservice, Moderation und Live-Support.',
    agents: [
      { name: 'Phinix Concierge', status: 'active', channel: 'Webchat & In-App', uptime: '98.7%', locale: 'DE/EN' },
      { name: 'ReplyKit', status: 'inactive', channel: 'Discord Community', uptime: '—', locale: 'DE' },
      { name: 'Support Desk', status: 'active', channel: 'Interne Helpdesk-Plattform', uptime: '99.1%', locale: 'EN' },
    ],
  },
  {
    id: 'work',
    title: 'Work Agents',
    description: 'Automatisierungen für interne Workflows, Scheduling und Content Ops.',
    agents: [
      { name: 'SchedulePilot', status: 'active', channel: 'Bildschirmplanung', uptime: '99.5%', locale: 'DE' },
      { name: 'AssetMason', status: 'inactive', channel: 'Asset-Qualitätsprüfung', uptime: '—', locale: 'EN' },
      { name: 'OpsFlow', status: 'active', channel: 'Kampagnen Rollouts', uptime: '97.8%', locale: 'DE/EN' },
    ],
  },
]

const livekitResources = [
  {
    name: 'LiveKit Cloud Console',
    description: 'Verwalte Sessions, Aufzeichnungen und Egress für deine Broadcasts.',
    href: 'https://cloud.livekit.io/',
  },
  {
    name: 'Real-Time APIs',
    description: 'Nutze die WebRTC & Data Pipeline APIs, um Agents live zu schalten.',
    href: 'https://docs.livekit.io/realtime/',
  },
  {
    name: 'LiveKit Agents SDK',
    description: 'Open-Source Toolkit zur Orchestrierung eigener Media Agents.',
    href: 'https://github.com/livekit/agents',
  },
]

const competitionFeeds = [
  {
    id: 'stroeer',
    label: 'Ströer',
    updates: [
      {
        time: '07:30',
        headline: 'Neue Programmatic Deals in Frankfurt',
        note: 'BlackWidow knappst sich die Overnight Reports und meldet, dass Ströer 12 neue Retail Deals mit FMCG Marken gestartet hat.',
        response:
          'Empfehlung: LiveKit Stage Ads mit Preissprung am Nachmittag vorbereiten und Retail-Case-Study via Screens pushen.',
      },
      {
        time: '19:45',
        headline: 'Digitale City-Light Tests in Köln',
        note: 'Abend-Analyse: Ströer testet AR-Interaktionen für das Nightlife-Segment.',
        response:
          'Antwort: Phinix Pop-Up Spots mit Live-QR bauen und Influencer-Kooperation für das Wochenende planen.',
      },
    ],
  },
  {
    id: 'amscreen',
    label: 'Amscreen',
    updates: [
      {
        time: '08:15',
        headline: 'Healthcare-Rollout in UK',
        note: 'BlackWidow meldet Amscreen Expansion in Wartezimmer-Netzwerke mit Fokus auf Gesundheitskampagnen.',
        response:
          'Empfehlung: Eigene Health-Vertical Daten aktualisieren und LiveKit-Expertenrunde für Pharma Partner organisieren.',
      },
      {
        time: '20:05',
        headline: 'Dynamic Pricing Pilot',
        note: 'Abends Launch eines dynamischen Pricings in Tankstellen-Netzen beobachtet.',
        response:
          'Antwort: Phinix Pricing Taskforce zusammenrufen und unser Burst-Pricing als Case für bestehende Kunden anbieten.',
      },
    ],
  },
  {
    id: 'jcdecaux',
    label: 'JCDecaux',
    updates: [
      {
        time: '07:45',
        headline: 'Airport Media Offensive',
        note: 'BlackWidow berichtet über großformatige DOOH-Installationen mit Luxusmarken an europäischen Airports.',
        response:
          'Empfehlung: Eigene Airport-Cluster analysieren und Showcase für Premiumkunden vorbereiten.',
      },
      {
        time: '21:00',
        headline: 'Sustainability KPI Push',
        note: 'Abendlicher Report: JCDecaux kommuniziert CO₂-Reporting in Echtzeit für öffentliche Auftraggeber.',
        response:
          'Antwort: LiveKit Dashboard um ESG Widget erweitern und in morgiger Kundenmail hervorheben.',
      },
    ],
  },
  {
    id: 'hygh',
    label: 'HYGH',
    updates: [
      {
        time: '07:20',
        headline: 'Creator Campaign Drops',
        note: 'BlackWidow sieht verstärkte Kooperationen mit Creator-Studios für hyperlokale Kampagnen.',
        response:
          'Empfehlung: Eigene Creator-Pipeline checken und LiveKit Rooms für Co-Creation Sessions freigeben.',
      },
      {
        time: '18:55',
        headline: 'Neue Self-Service Slots',
        note: 'HYGH erweitert Self-Service Buchungsoptionen für SMBs mit Wochenend-Paketen.',
        response:
          'Antwort: Weekend-Starter-Kit auf Screens platzieren und automatisierte Onboarding-Mails vorbereiten.',
      },
    ],
  },
]

const QuickLaunch = () => (
  <nav className="quick-launch" aria-label="Quick launch">
    <div className="quick-lights" aria-hidden>
      <span className="quick-light online" />
      <span className="quick-light standby" />
    </div>
    <ul className="quick-links">
      {quickLinks.map((link: QuickLinkType) => (
        <li key={link.id}>
          <a
            className={`quick-link tone-${link.tone ?? 'outline'}`}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer noopener' : undefined}
            title={link.label}
          >
            <span aria-hidden className="quick-icon">{link.icon}</span>
            <span className="sr-only">{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
    <div className="quick-footer">
      <span className="quick-mark">PM</span>
      <span className="quick-more" aria-hidden>
        •••
      </span>
    </div>
  </nav>
)

const Sidebar = () => {
  const { profile, role, logout } = useAuth()
  const { theme } = useTheme()
  const menuLogo = theme === 'dark' ? menuLogoDark : menuLogoLight
  const [menuOpen, setMenuOpen] = useState(false)
  const menuItems = [
    { id: 'profile', label: 'Profil', action: () => setMenuOpen(false) },
    { id: 'preferences', label: 'Einstellungen', action: () => setMenuOpen(false) },
    { id: 'logout', label: 'Logout', action: () => logout() },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <img src={menuLogo} alt="Phinix Media" className="brand-logo-menu" />
        </div>
      </div>
      <div className="sidebar-env">
        <span className="sidebar-env-icon" aria-hidden />
        <div>
          <div className="sidebar-env-name">firstdb</div>
          <div className="sidebar-env-sub">Development</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <a className="nav-item active" href="#dashboard">
          <span className="nav-icon nav-icon-dashboard" aria-hidden />
          Dashboard
        </a>
        <a className="nav-item" href="#studio">
          <span className="nav-icon nav-icon-studio" aria-hidden />
          Extensions Studio
        </a>
        <a className="nav-item" href="#agents">
          <span className="nav-icon nav-icon-accelerate" aria-hidden />
          Agents
        </a>
        <a className="nav-item" href="#backups">
          <span className="nav-icon nav-icon-backups" aria-hidden />
          Backups &amp; History
        </a>
        <a className="nav-item" href="#api">
          <span className="nav-icon nav-icon-keys" aria-hidden />
          API Keys
        </a>
        <a className="nav-item" href="#settings">
          <span className="nav-icon nav-icon-settings" aria-hidden />
          Settings
        </a>
        <a className="nav-item" href="#news">
          <span className="nav-icon nav-icon-news" aria-hidden />
          Newsroom
        </a>
      </nav>
      <div className={`sidebar-footer ${menuOpen ? 'menu-open' : ''}`}>
        <button type="button" className="profile-trigger" onClick={() => setMenuOpen((prev) => !prev)}>
          <span className="nav-icon nav-icon-user" aria-hidden />
          <div>
            <div className="user-name">{profile?.name ?? 'Phinix Admin'}</div>
            <div className="user-role">{role ? role.toUpperCase() : 'Workspace Owner'}</div>
          </div>
        </button>
        <div className="profile-menu" aria-hidden={!menuOpen}>
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="profile-menu-item"
              style={{ '--i': index } as CSSProperties}
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

interface DashboardContentProps {
  onOpenUtilization: () => void
  utilizationData: DisplayUtilizationPoint[]
  news: NewsArticle[]
  onRequestCreate: () => void
  onAddComment: (articleId: string, comment: CommentThread) => void
  canModerate: boolean
}

const DashboardContent = ({
  onOpenUtilization,
  utilizationData,
  news,
  onRequestCreate,
  onAddComment,
  canModerate,
}: DashboardContentProps) => {
  const { extensions } = useExtensions()
  const { theme } = useTheme()
  const brandLogo = theme === 'dark' ? phinixLogoDark : phinixLogoLight

  return (
    <div className="main">
      <div className="announcement">
        Manage all Phinix.Media.Screens extensions from one place. Explore the new deploy features.
      </div>
      <header className="topbar">
        <div className="topbar-brand">
          <img src={brandLogo} className="brand-logo" alt="Phinix.Media.Screens" />
          <div className="breadcrumbs">
            <span className="breadcrumb-app">Phinix Screens</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-env">Admin</span>
          </div>
        </div>
        <div className="topbar-actions">
          <ThemeToggle />
          <button className="tone-button">Invite Collaborator</button>
          <div className="region-pill">
            <span className="region-swatch" aria-hidden>
              DE
            </span>
            Europe (Frankfurt)
          </div>
        </div>
      </header>

      <main className="content">
        <DisplayUtilizationChart data={utilizationData} onOpenDetail={onOpenUtilization} />

        <section id="dashboard" className="grid">
          {extensions.map((extension) => (
            <article key={extension.id} className="card">
              <header className="card-header">
                <div>
                  <div className="card-title">{extension.name}</div>
                  <div className="card-sub">{extension.vendor}</div>
                </div>
                <span className={statusClass[extension.status]}>{statusLabel[extension.status]}</span>
              </header>
              <p className="card-description">{extension.description}</p>
              <div className="metric">
                <div className="metric-value">{extension.metricValue}</div>
                <div className="metric-label">{extension.metricLabel}</div>
                <div className="metric-hint">{extension.metricHint}</div>
              </div>
              <footer className="card-footer">
                <button className="tone-button ghost">{extension.ctaLabel}</button>
              </footer>
            </article>
          ))}
        </section>

        <section id="studio" className="section-block">
          <header className="section-header">
            <div>
              <h2>Extensions Studio</h2>
              <p>Entwickle, teste und publiziere neue Erweiterungen für Phinix Screens.</p>
            </div>
            <button className="tone-button ghost">Open Studio</button>
          </header>
          <p className="section-body">
            Versionierte Pipelines und automatische QA-Tore helfen dir, Änderungen sicher in Produktion zu bringen. Verknüpfe Appwrite Collections oder LiveKit Rooms direkt mit deinen Builds.
          </p>
        </section>

        <AgentsShowcase />
        <LivekitToolkit />

        <section id="accelerators" className="section-block">
          <header className="section-header">
            <div>
              <h2>Accelerators</h2>
              <p>Boost deine Deployments mit skalierenden Caches und Edge Workern.</p>
            </div>
            <button className="tone-button ghost">Manage Accelerators</button>
          </header>
          <p className="section-body">
            Aktiviere Burst-Kapazitäten, verfolge Cache-Hitrates und optimiere die Latenz deiner LiveKit Streams in Echtzeit.
          </p>
        </section>

        <section id="backups" className="section-block">
          <header className="section-header">
            <div>
              <h2>Backups &amp; History</h2>
              <p>Rolle Releases gezielt zurück oder spiele Snapshots auf Staging ein.</p>
            </div>
            <button className="tone-button ghost">View Timeline</button>
          </header>
          <p className="section-body">
            Tägliche Backups liegen verschlüsselt in der EU-Region. Vergleiche Schema-Änderungen und stelle gelöschte Datensätze granular wieder her.
          </p>
        </section>

        <section id="api" className="section-block">
          <header className="section-header">
            <div>
              <h2>API Keys</h2>
              <p>Verwalte Zugriffstoken für Apps, Automationen und Integrationen.</p>
            </div>
            <button className="tone-button ghost">Rotate Key</button>
          </header>
          <p className="section-body">
            Signierte Tokens werden automatisch rotiert und unterstützen konfigurierbare Rollen inklusive fein-granularer Appwrite-Permissions.
          </p>
        </section>

        <section id="settings" className="section-block">
          <header className="section-header">
            <div>
              <h2>Settings</h2>
              <p>Kontrolliere Sicherheitsregeln, Workspaces und Benachrichtigungen.</p>
            </div>
            <button className="tone-button ghost">Edit Settings</button>
          </header>
          <p className="section-body">
            Verknüpfe Identity Provider, richte LiveKit Webhooks ein und definiere Eskalationsketten für Betriebsereignisse.
          </p>
        </section>

        <section className="secondary">
          <article className="summary-card">
            <div className="summary-header">
              <div>
                <div className="summary-title">Activity Overview</div>
                <div className="summary-hint">Last 7 days across all enabled extensions</div>
              </div>
              <button className="tone-button ghost">View Insights</button>
            </div>
            <ul className="summary-list">
              <li>
                <span>Appwrite Sync</span>
                <span className="summary-value">5 Deploys</span>
              </li>
              <li>
                <span>LiveKit Channels</span>
                <span className="summary-value">98% Uptime</span>
              </li>
              <li>
                <span>Appwrite Webhooks</span>
                <span className="summary-value">0 Failures</span>
              </li>
            </ul>
          </article>
        </section>

        <NewsPortal
          news={news}
          onRequestCreate={onRequestCreate}
          onAddComment={onAddComment}
          canModerate={canModerate}
        />
        <CompetitionSection />
      </main>
    </div>
  )
}

const AgentsShowcase = () => (
  <section id="agents" className="agents-section">
    <header className="section-header">
      <div>
        <h2>Agents Landscape</h2>
        <p>Überblick über aktive und inaktive Phinix Agents für Voice, Chat und Workflows.</p>
      </div>
    </header>
    <div className="agents-grid">
      {agentCatalog.map((group) => (
        <article key={group.id} className="card agent-card">
          <header className="agent-card-header">
            <h3>{group.title}</h3>
            <p>{group.description}</p>
          </header>
          <ul className="agent-list">
            {group.agents.map((agent) => (
              <li key={agent.name} className={`agent-list-item agent-${agent.status}`}>
                <div>
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-channel">{agent.channel}</span>
                </div>
                <div className="agent-meta">
                  <span>{agent.locale}</span>
                  <span>{agent.uptime}</span>
                  <span className="agent-status-pill">{agent.status === 'active' ? 'Aktiv' : 'Inaktiv'}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
)

const LivekitToolkit = () => (
  <section className="section-block livekit-resources">
    <header className="section-header">
      <div>
        <h2>LiveKit Tooling</h2>
        <p>Wissenswertes und weiterführende Ressourcen rund um LiveKit-Integrationen.</p>
      </div>
    </header>
    <ul className="resource-list">
      {livekitResources.map((resource) => (
        <li key={resource.href} className="resource-item">
          <div>
            <h3>{resource.name}</h3>
            <p>{resource.description}</p>
          </div>
          <a className="tone-button ghost" href={resource.href} target="_blank" rel="noreferrer noopener">
            Mehr erfahren
          </a>
        </li>
      ))}
    </ul>
  </section>
)

interface NewsPortalProps {
  news: NewsArticle[]
  onRequestCreate: () => void
  onAddComment: (articleId: string, comment: CommentThread) => void
  canModerate: boolean
}

const NewsPortal = ({ news, onRequestCreate, onAddComment, canModerate }: NewsPortalProps) => {
  const [activeArticle, setActiveArticle] = useState<string>('')
  const { profile } = useAuth()

  return (
    <section id="news" className="news-portal">
      <header className="section-header">
        <div>
          <h2>Phinix Newsroom</h2>
          <p>Updates, Deployments und Kommentare aus dem Team.</p>
        </div>
        {canModerate && (
          <button className="tone-button ghost" type="button" onClick={onRequestCreate}>
            Beitrag erstellen
          </button>
        )}
      </header>
      <div className="news-grid">
        {news.map((article) => (
          <article key={article.id} className="news-card">
            <div className="news-meta">
              <span className="news-tag">{article.tag}</span>
              <span className="news-time">{article.updatedAt}</span>
            </div>
            <h3 className="news-title">{article.title}</h3>
            <p className="news-summary">{article.summary}</p>
            <footer className="news-comments">
              {canModerate && (
                <WordpressComposer
                  key={`composer-${article.id}-${profile?.name ?? 'anon'}`}
                  visible={activeArticle === article.id}
                  onToggle={() => setActiveArticle((prev) => (prev === article.id ? '' : article.id))}
                  onSubmit={(body) => {
                    if (!body.trim()) return
                    onAddComment(article.id, {
                      author: profile?.name ?? 'Phinix Admin',
                      role: 'Admin',
                      body,
                      timestamp: 'gerade eben',
                    })
                    setActiveArticle('')
                  }}
                  canModerate={canModerate}
                />
              )}
              <ul>
                {article.comments.map((comment) => (
                  <li key={`${article.id}-${comment.author}-${comment.timestamp}`} className="comment">
                    <span className="comment-avatar" aria-hidden>
                      {getInitials(comment.author)}
                    </span>
                    <div className="comment-body">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-role">{comment.role}</span>
                        <span className="comment-time">{comment.timestamp}</span>
                      </div>
                      <p>{comment.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}

interface WordpressComposerProps {
  visible: boolean
  onToggle: () => void
  onSubmit: (body: string) => void
  canModerate: boolean
}

const WordpressComposer = ({ visible, onToggle, onSubmit, canModerate }: WordpressComposerProps) => {
  const [content, setContent] = useState('')

  return (
    <div className="wp-composer">
      <button type="button" className="composer-toggle" onClick={onToggle}>
        {visible ? 'Schließen' : 'Kommentar verfassen'}
      </button>
      {visible && (
        <div className="composer-panel">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={canModerate ? 'Schreibe deine Antwort…' : 'Kommentar abgeben (Gast)'}
          />
          <div className="composer-actions">
            <button
              type="button"
              className="tone-button"
              onClick={() => {
                onSubmit(content)
                setContent('')
              }}
            >
              Kommentar posten
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface NewsComposerProps {
  onCreate: (article: NewsArticle) => void
  onClose: () => void
  authorName: string
}

const NewsComposer = ({ onCreate, onClose, authorName }: NewsComposerProps) => {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('Update')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')

  const submit = () => {
    if (!title.trim() || !summary.trim()) {
      return
    }

    const timestamp = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

    onCreate({
      id: `${Date.now()}`,
      title,
      tag,
      summary,
      updatedAt: timestamp,
      comments: [
        {
          author: authorName,
          role: 'Admin',
          body: body || 'Neuer Beitrag wurde veröffentlicht.',
          timestamp: timestamp,
        },
      ],
    })
    onClose()
    setTitle('')
    setSummary('')
    setBody('')
  }

  return (
    <div className="composer-overlay">
      <div className="composer-modal">
        <header>
          <h2>Neuen Beitrag erstellen</h2>
          <button type="button" onClick={onClose} className="composer-close">
            ×
          </button>
        </header>
        <div className="composer-body">
          <label>
            Titel
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Headline" />
          </label>
          <label>
            Kategorie
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="Update">Update</option>
              <option value="Incident">Incident</option>
              <option value="Announcement">Announcement</option>
              <option value="Insight">Insight</option>
            </select>
          </label>
          <label>
            Kurzbeschreibung
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Zusammenfassung" />
          </label>
          <label>
            Inhalt / Kommentar
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="WordPress-ähnlicher RichText (vereinfacht)."
              rows={6}
            />
          </label>
        </div>
        <footer className="composer-footer">
          <button type="button" className="tone-button ghost" onClick={onClose}>
            Abbrechen
          </button>
          <button type="button" className="tone-button" onClick={submit}>
            Beitrag veröffentlichen
          </button>
        </footer>
      </div>
    </div>
  )
}

const FloatingCreateButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className="floating-create" onClick={onClick}>
    +
  </button>
)

const CompetitionSection = () => {
  const [active, setActive] = useState(competitionFeeds[0]?.id ?? '')
  const activeFeed = competitionFeeds.find((feed) => feed.id === active) ?? competitionFeeds[0]

  if (!activeFeed) {
    return null
  }

  return (
    <section className="competition-section">
      <header className="section-header">
        <div>
          <h2>Konkurrenz-Insights</h2>
          <p>BlackWidow überwacht den Markt und liefert zweimal täglich Handlungsempfehlungen.</p>
        </div>
      </header>
      <div className="competition-tabs">
        {competitionFeeds.map((feed) => (
          <button
            key={feed.id}
            type="button"
            className={`competition-tab ${feed.id === active ? 'active' : ''}`}
            onClick={() => setActive(feed.id)}
          >
            {feed.label}
          </button>
        ))}
      </div>
      <div className="competition-feed">
        {activeFeed.updates.map((update) => (
          <article key={`${activeFeed.id}-${update.time}`} className="competition-entry">
            <header>
              <span className="entry-time">{update.time} Uhr</span>
              <h3>{update.headline}</h3>
            </header>
            <p className="entry-note">{update.note}</p>
            <p className="entry-response">{update.response}</p>
            <div className="entry-agent">
              <span className="agent-avatar">BW</span>
              <div>
                <strong>BlackWidow</strong>
                <span>Strategic Media Agent</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const Dashboard = () => {
  const [view, setView] = useState<'overview' | 'utilization'>('overview')
  const { points: utilizationData } = useDisplayUtilization()
  const { profile, role } = useAuth()
  const { articles } = useNews()
  const [newsEntries, setNewsEntries] = useState<NewsArticle[]>(articles)
  const [showComposer, setShowComposer] = useState(false)

  useEffect(() => {
    setNewsEntries(articles)
  }, [articles])

  const handleAddComment = (articleId: string, comment: CommentThread) => {
    setNewsEntries((prev) =>
      prev.map((article) =>
        article.id === articleId
          ? { ...article, comments: [comment, ...article.comments] }
          : article,
      ),
    )
  }

  const handleCreateNews = (article: NewsArticle) => {
    setNewsEntries((prev) => [article, ...prev])
  }

  const canModerate = role === 'admin'

  return (
    <div className={`app-shell ${view === 'utilization' ? 'detail-active' : ''}`}>
      <QuickLaunch />
      <Sidebar />
      {view === 'overview' ? (
        <DashboardContent
          onOpenUtilization={() => setView('utilization')}
          utilizationData={utilizationData}
          news={newsEntries}
          onRequestCreate={() => setShowComposer(true)}
          onAddComment={handleAddComment}
          canModerate={canModerate}
        />
      ) : (
        <UtilizationDetail data={utilizationData} onBack={() => setView('overview')} />
      )}
      {canModerate && <FloatingCreateButton onClick={() => setShowComposer(true)} />}
      {showComposer && (
        <NewsComposer
          authorName={profile?.name ?? 'Phinix Admin'}
          onCreate={handleCreateNews}
          onClose={() => setShowComposer(false)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  )
}

export default App
