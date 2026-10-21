# Phinix.Media.Screens

Öffentliche Konzept-Demo für Digital-Signage-Displays und Admin-Dashboard.

Live: https://kevin1337pro.github.io/phinix-screens-dashboard/

## Lokal starten

Node.js 22.12 oder neuer. `npm ci` und `npm run dev`.
Produktionsbuild: `npm run build`.

## Seiten

- `#/`: öffentliche Display-Übersicht mit acht Beispielstandorten und einem lokalen Buchungsentwurf in drei Schritten.
- `#/admin`: Admin-Anmeldung. Online ausschließlich über eine konfigurierte Appwrite-Instanz.

Standorte, Preise, News, Agenten und Diagramme sind Demo-Inhalte. Die Kundenbuchung speichert nur den letzten Entwurf im lokalen Browser-Speicher. Es gibt keine Reservierung, Zahlung, E-Mail oder Medienübertragung. Nicht verfügbare Originalmedien werden als Platzhalter gekennzeichnet.

## Appwrite

`.env.example` nach `.env.local` kopieren und die öffentlichen Projekt-/Collection-IDs eintragen. Keine API-Schlüssel oder echten Passwörter in VITE-Variablen hinterlegen: Sie werden Teil des Browser-Bundles.

Die Live-Demo enthält keine Appwrite-Konfiguration. Vor der produktiven Anbindung müssen Collection-Berechtigungen serverseitig eingerichtet werden: Adminrechte ausschließlich serverseitig vergeben, Profildaten nicht für Rollenänderungen durch Nutzer freigeben und Schreibrechte auf News/Displays auf Admins beschränken. Die UI allein ist keine Zugriffskontrolle. Neue Registrierungen erhalten ausschließlich die Gastrolle.

Optionale lokale Demo-Zugangsdaten können in `.env.local` gesetzt werden. Dieser Zugang ist im Produktionsbuild deaktiviert.

## Veröffentlichung

GitHub Pages verwendet den Branch `gh-pages`. Der Quellcode liegt auf `main`. Nach Änderungen `npm ci && npm run build` ausführen und den Inhalt von `dist` auf `gh-pages` veröffentlichen. Hash-Routing ermöglicht direkte Unterseiten ohne Server-Rewrites.
