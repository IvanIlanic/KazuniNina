import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
const translations = {
  en: {
    collection: "The collection",
    story: "Our craft",
    visit: "Plan your visit",
    admin: "Admin",
    title: "A little piece\nof Istria.",
    intro:
      "Traditional stone. Patient hands. A home for something special. Discover handcrafted kazuni, made to bring Istrian heritage into your everyday.",
    explore: "Explore the collection",
    eyebrow: "HANDCRAFTED IN ISTRIA",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    auction: "Auction",
    all: "All pieces",
    buy: "Reserve this kazun",
    bid: "Place a bid",
    from: "Starting at",
    current: "Highest bid",
    ends: "Bidding closes",
    empty: "New pieces are on their way.",
    emptyText:
      "Every kazun takes time and care. Check back soon for the next collection.",
    details: "Details",
    name: "Your name",
    phone: "Phone number",
    amount: "Your bid (€)",
    mode: "How would you like to receive it?",
    pickup: "Pickup",
    delivery: "Delivery",
    appointment: "Available appointment",
    choose: "Choose a date & location",
    address: "Delivery address",
    submit: "Send reservation",
    sendBid: "Submit bid",
    cancel: "Cancel",
    success:
      "Thank you! Your request has been recorded. We’ll contact you by phone.",
    bidSuccess: "Your bid has been recorded. Thank you!",
    noSlots:
      "No appointments are available for this option. Please check back soon.",
    privacy:
      "Your name and phone number are shared only with the seller to arrange your request.",
    craftTitle: "Built by hand.\nKept for generations.",
    craftBody:
      "Inspired by the dry-stone shelters of Istria, each kazun celebrates a simple tradition: carefully chosen stone, thoughtfully placed. A small landmark for your garden, home, or someone you love.",
    visitTitle: "Your kazun, your way.",
    visitText:
      "Pick up your piece or request delivery. Choose a time and location from the seller’s available calendar when you reserve.",
    footer: "A small piece of heritage. A lasting connection to Istria.",
    login: "Admin sign in",
    password: "Password",
    signIn: "Sign in",
    logout: "Sign out",
    dashboard: "Your workshop",
    listings: "Listings",
    orders: "Orders",
    bids: "Bids",
    calendar: "Availability",
    add: "Add a kazun",
    save: "Save",
    price: "Price (€)",
    description: "Description",
    photo: "Picture",
    deadline: "Auction closing time",
    newSlot: "Add an appointment",
    place: "Pickup location / delivery area",
    capacity: "Capacity",
    date: "Date & time",
    remove: "Remove",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    confirm: "Confirm",
    complete: "Complete",
    edit: "Edit",
    hidden: "Hidden",
    status: "Status",
    noRecords: "Nothing here yet.",
    back: "Back to storefront",
    auctionNote:
      "Bids are offers. The seller will contact the winning bidder after the auction closes.",
    orderNote:
      "This is a reservation request. Payment and final arrangements are agreed with the seller.",
    language: "Language",
  },
  de: {
    collection: "Die Kollektion",
    story: "Unser Handwerk",
    visit: "Besuch planen",
    admin: "Admin",
    title: "Ein kleines Stück\nIstrien.",
    intro:
      "Traditioneller Stein. Geduldige Hände. Entdecken Sie handgefertigte Kazuni, die istrisches Erbe in Ihren Alltag bringen.",
    explore: "Kollektion entdecken",
    eyebrow: "HANDGEFERTIGT IN ISTRIEN",
    available: "Verfügbar",
    reserved: "Reserviert",
    sold: "Verkauft",
    auction: "Auktion",
    all: "Alle Stücke",
    buy: "Kazun reservieren",
    bid: "Gebot abgeben",
    from: "Startpreis",
    current: "Höchstgebot",
    ends: "Auktionsende",
    empty: "Neue Stücke entstehen.",
    emptyText:
      "Jeder Kazun braucht Zeit und Sorgfalt. Schauen Sie bald wieder vorbei.",
    details: "Details",
    name: "Ihr Name",
    phone: "Telefonnummer",
    amount: "Ihr Gebot (€)",
    mode: "Wie möchten Sie ihn erhalten?",
    pickup: "Abholung",
    delivery: "Lieferung",
    appointment: "Verfügbarer Termin",
    choose: "Datum & Ort auswählen",
    address: "Lieferadresse",
    submit: "Reservierung senden",
    sendBid: "Gebot senden",
    cancel: "Abbrechen",
    success:
      "Vielen Dank! Ihre Anfrage wurde gespeichert. Wir melden uns telefonisch.",
    bidSuccess: "Ihr Gebot wurde gespeichert. Vielen Dank!",
    noSlots:
      "Aktuell sind keine Termine verfügbar. Bitte schauen Sie später wieder vorbei.",
    privacy:
      "Ihr Name und Ihre Telefonnummer werden nur dem Verkäufer für Ihre Anfrage mitgeteilt.",
    craftTitle: "Von Hand gebaut.\nFür Generationen.",
    craftBody:
      "Inspiriert von Istriens Trockensteinhütten, würdigt jeder Kazun eine einfache Tradition: sorgfältig ausgewählter und gesetzter Stein. Ein kleines Wahrzeichen für Ihren Garten, Ihr Zuhause oder einen geliebten Menschen.",
    visitTitle: "Ihr Kazun, Ihr Weg.",
    visitText:
      "Holen Sie Ihr Stück ab oder vereinbaren Sie eine Lieferung. Wählen Sie bei der Reservierung einen Termin aus dem Kalender des Verkäufers.",
    footer:
      "Ein kleines Stück Tradition. Eine bleibende Verbindung zu Istrien.",
    login: "Admin-Anmeldung",
    password: "Passwort",
    signIn: "Anmelden",
    logout: "Abmelden",
    dashboard: "Ihre Werkstatt",
    listings: "Angebote",
    orders: "Bestellungen",
    bids: "Gebote",
    calendar: "Verfügbarkeit",
    add: "Kazun hinzufügen",
    save: "Speichern",
    price: "Preis (€)",
    description: "Beschreibung",
    photo: "Bild",
    deadline: "Auktionsende",
    newSlot: "Termin hinzufügen",
    place: "Abholort / Liefergebiet",
    capacity: "Kapazität",
    date: "Datum & Uhrzeit",
    remove: "Entfernen",
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    completed: "Abgeschlossen",
    cancelled: "Storniert",
    confirm: "Bestätigen",
    complete: "Abschließen",
    edit: "Bearbeiten",
    hidden: "Versteckt",
    status: "Status",
    noRecords: "Noch keine Einträge.",
    back: "Zurück zum Shop",
    auctionNote:
      "Gebote sind Angebote. Der Verkäufer kontaktiert den Höchstbietenden nach Auktionsende.",
    orderNote:
      "Dies ist eine Reservierungsanfrage. Zahlung und weitere Details werden mit dem Verkäufer vereinbart.",
    language: "Sprache",
  },
  hr: {
    collection: "Kolekcija",
    story: "Naš zanat",
    visit: "Planirajte posjet",
    admin: "Admin",
    title: "Mali komadić\nIstre.",
    intro:
      "Tradicionalni kamen. Strpljive ruke. Otkrijte ručno izrađene kažune koji donose istarsku baštinu u vašu svakodnevicu.",
    explore: "Istražite kolekciju",
    eyebrow: "RUČNO IZRAĐENO U ISTRI",
    available: "Dostupno",
    reserved: "Rezervirano",
    sold: "Prodano",
    auction: "Aukcija",
    all: "Svi kažuni",
    buy: "Rezervirajte kažun",
    bid: "Pošaljite ponudu",
    from: "Početna cijena",
    current: "Najviša ponuda",
    ends: "Kraj aukcije",
    empty: "Novi kažuni uskoro stižu.",
    emptyText: "Svaki kažun zahtijeva vrijeme i pažnju. Posjetite nas uskoro.",
    details: "Detalji",
    name: "Vaše ime",
    phone: "Broj telefona",
    amount: "Vaša ponuda (€)",
    mode: "Kako želite preuzeti kažun?",
    pickup: "Osobno preuzimanje",
    delivery: "Dostava",
    appointment: "Dostupan termin",
    choose: "Odaberite datum i mjesto",
    address: "Adresa dostave",
    submit: "Pošaljite rezervaciju",
    sendBid: "Pošaljite ponudu",
    cancel: "Odustani",
    success:
      "Hvala! Vaš zahtjev je zabilježen. Kontaktirat ćemo vas telefonom.",
    bidSuccess: "Vaša ponuda je zabilježena. Hvala!",
    noSlots:
      "Trenutno nema dostupnih termina za ovu opciju. Pokušajte kasnije.",
    privacy:
      "Vaše ime i broj telefona dostupni su samo prodavatelju radi dogovora.",
    craftTitle: "Izrađeno rukom.\nZa generacije.",
    craftBody:
      "Nadahnut istarskim suhozidnim skloništima, svaki kažun slavi jednostavnu tradiciju: pažljivo odabran i složen kamen. Mali simbol za vaš vrt, dom ili nekoga koga volite.",
    visitTitle: "Vaš kažun, vaš izbor.",
    visitText:
      "Preuzmite svoj kažun ili zatražite dostavu. Prilikom rezervacije odaberite vrijeme i mjesto iz kalendara prodavatelja.",
    footer: "Mali komadić baštine. Trajna povezanost s Istrom.",
    login: "Prijava administratora",
    password: "Lozinka",
    signIn: "Prijava",
    logout: "Odjava",
    dashboard: "Vaša radionica",
    listings: "Kažuni",
    orders: "Narudžbe",
    bids: "Ponude",
    calendar: "Dostupnost",
    add: "Dodajte kažun",
    save: "Spremi",
    price: "Cijena (€)",
    description: "Opis",
    photo: "Slika",
    deadline: "Kraj aukcije",
    newSlot: "Dodajte termin",
    place: "Mjesto preuzimanja / područje dostave",
    capacity: "Kapacitet",
    date: "Datum i vrijeme",
    remove: "Ukloni",
    pending: "Na čekanju",
    confirmed: "Potvrđeno",
    completed: "Dovršeno",
    cancelled: "Otkazano",
    confirm: "Potvrdi",
    complete: "Dovrši",
    edit: "Uredi",
    hidden: "Skriveno",
    status: "Status",
    noRecords: "Još nema zapisa.",
    back: "Povratak u trgovinu",
    auctionNote:
      "Ponude su prijedlozi kupnje. Prodavatelj će kontaktirati najvišeg ponuđača nakon završetka aukcije.",
    orderNote:
      "Ovo je zahtjev za rezervaciju. Plaćanje i konačni dogovor vrše se s prodavateljem.",
    language: "Jezik",
  },
};
async function api(url, body, method = "POST") {
  const form = body instanceof FormData;
  const res = await fetch("/api" + url, {
    method,
    headers: form ? {} : body ? { "Content-Type": "application/json" } : {},
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw Error(data.error || "Request failed");
  return data;
}
function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 18L18 6M6 6h12v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function Kazun({ small = false }) {
  return (
    <svg
      className={small ? "kazun small" : "kazun"}
      viewBox="0 0 600 490"
      role="img"
      aria-label="Illustration of a traditional Istrian stone kazun"
    >
      <defs>
        <linearGradient id="stone" x2="1" y2="1">
          <stop stopColor="#e5d8be" />
          <stop offset="1" stopColor="#9d9985" />
        </linearGradient>
        <linearGradient id="roof" x2="0" y2="1">
          <stop stopColor="#eee2c9" />
          <stop offset="1" stopColor="#a9a28d" />
        </linearGradient>
      </defs>
      <ellipse
        cx="306"
        cy="432"
        rx="214"
        ry="29"
        fill="#122b25"
        opacity=".17"
      />
      <path
        d="M123 286Q302 237 478 286L468 415Q310 465 132 415Z"
        fill="url(#stone)"
      />
      <path
        d="M99 289Q154 226 195 171L280 76Q299 48 320 76L407 177Q452 229 501 289Q313 334 99 289"
        fill="url(#roof)"
      />
      {[125, 155, 185, 215, 245, 277].map((y, i) => (
        <path
          key={y}
          d={`M${255 - i * 25} ${y} Q300 ${y + 15} ${343 + i * 27} ${y}`}
          fill="none"
          stroke="#777f70"
          strokeWidth="3"
          opacity=".55"
        />
      ))}
      {[320, 348, 378, 405].map((y, i) => (
        <g key={y}>
          <path
            d={`M130 ${y} Q300 ${y + 35} 475 ${y}`}
            fill="none"
            stroke="#7d8473"
            strokeWidth="3"
            opacity=".55"
          />
          {[160, 220, 285, 355, 420].map((x, j) => (
            <path
              key={x}
              d={`M${x + (i % 2) * 20} ${y}l${j % 2 ? 4 : -3} 27`}
              stroke="#7d8473"
              strokeWidth="2"
              opacity=".5"
            />
          ))}
        </g>
      ))}
      <path d="M269 435V351Q299 319 329 351V439Z" fill="#293e34" />
      <path
        d="M265 432V347Q301 314 333 347V436"
        fill="none"
        stroke="#d7ceb7"
        strokeWidth="12"
      />
      <path
        d="M86 428q-20-35-9-56q23 18 13 50m-1 9q16-52 34-59q5 27-26 62"
        fill="#697b5c"
      />
      <path
        d="M500 428q-5-58 19-78q14 32-14 77m-7 6q-27-41-46-38q0 25 43 44"
        fill="#6d805e"
      />
    </svg>
  );
}
function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const t = translations[lang] || translations.en;
  const locale = { en: "en-GB", de: "de-DE", hr: "hr-HR" }[lang];
  const money = (n) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(n / 100);
  const date = (d) =>
    new Date(d).toLocaleString(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  const [catalog, setCatalog] = useState({ listings: [], slots: [] }),
    [session, setSession] = useState(false),
    [adminView, setAdminView] = useState(location.pathname === "/admin"),
    [filter, setFilter] = useState("all"),
    [modal, setModal] = useState(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [adminData, setAdminData] = useState({ orders: [], bids: [], slots: [] }),
    [tab, setTab] = useState("listings");
  async function refresh() {
    try {
      setCatalog(await api("/catalog", null, "GET"));
      const s = await api("/admin/session", null, "GET");
      setSession(s.authenticated);
      if (s.authenticated) setAdminData(await api("/admin/data", null, "GET"));
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement;
    const dialog = document.querySelector(".modal");
    const focusable = () =>
      Array.from(
        dialog.querySelectorAll(
          "button:not(:disabled),input,select,textarea,a[href]",
        ),
      );
    focusable()[0]?.focus();
    const handler = (e) => {
      if (e.key === "Escape" && !busy) setModal(null);
      if (e.key === "Tab") {
        const items = focusable(),
          first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [modal, busy]);
  async function action(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function open(m) {
    setModal(m);
    setError("");
    setNotice("");
  }
  function route(admin) {
    setAdminView(admin);
    history.pushState({}, "", admin ? "/admin" : "/");
    setError("");
  }
  useEffect(() => {
    const f = () => setAdminView(location.pathname === "/admin");
    window.addEventListener("popstate", f);
    return () => window.removeEventListener("popstate", f);
  }, []);

  const publicListings = catalog.listings.filter((l) => l.status !== "hidden");
  return (
    <>
      <header>
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            route(false);
          }}
        >
          <span className="brand-mark">⌂</span>
          <span>
            KAZUNI <b>NINA</b>
            <small>ISTRIA · CROATIA</small>
          </span>
        </a>
        <nav>
          <a href="#collection" onClick={() => route(false)}>
            {t.collection}
          </a>
          <a href="#craft" onClick={() => route(false)}>
            {t.story}
          </a>
          <a href="#visit" onClick={() => route(false)}>
            {t.visit}
          </a>
        </nav>
        <div className="nav-end">
          <select
            aria-label={t.language}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="hr">HR</option>
          </select>
          <button className="admin-link" onClick={() => route(!adminView)}>
            {adminView ? t.back : t.admin} <Arrow />
          </button>
        </div>
      </header>
      {error && !modal && (
        <div className="error global" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}
      {!adminView ? (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span /> {t.eyebrow}
              </div>
              <h1>{t.title}</h1>
              <p>{t.intro}</p>
              <a className="button" href="#collection">
                {t.explore} <Arrow />
              </a>
              <div className="hero-note">
                <span>✧</span> Kamen. Tradicija. Istra.
              </div>
            </div>
            <div className="hero-art">
              <div className="sun" />
              <Kazun />
              <div className="art-caption">
                <span>01 / ISTARSKI KAŽUN</span>
                <span>Made with care, made to stay.</span>
              </div>
              <div className="round-seal">
                RUČNI RAD
                <br />
                <b>✧</b>
                <br />
                HANDMADE
              </div>
            </div>
          </section>
          <div className="ribbon">
            <span>Natural stone</span>
            <i>✧</i>
            <span>Istrian heritage</span>
            <i>✧</i>
            <span>Made by hand</span>
            <i>✧</i>
            <span>One of a kind</span>
          </div>
          <section id="collection" className="collection">
            <div className="section-top">
              <div>
                <div className="eyebrow">PIECES WITH A STORY</div>
                <h2>
                  {t.collection}
                  <span>.</span>
                </h2>
              </div>
              <p>
                {publicListings.length.toString().padStart(2, "0")} / KAZUNI
              </p>
            </div>
            <div className="filters">
              {["all", "available", "auction", "sold"].map((f) => (
                <button
                  key={f}
                  className={filter === f ? "active" : ""}
                  onClick={() => setFilter(f)}
                >
                  {t[f]}
                </button>
              ))}
            </div>
            <div className="grid">
              {publicListings
                .filter(
                  (l) =>
                    filter === "all" ||
                    (filter === "auction"
                      ? l.auction
                      : l.status === filter && !l.auction),
                )
                .map((l) => (
                  <article className="card" key={l.id}>
                    <button
                      className="card-image"
                      onClick={() => open({ kind: "customer", listing: l })}
                    >
                      <img src={l.image} alt={l.name} loading="lazy" />
                      <span className={"badge " + l.status}>
                        {l.auction ? t.auction : t[l.status]}
                      </span>
                      <span className="image-arrow">
                        <Arrow />
                      </span>
                    </button>
                    <div className="card-meta">
                      <span>
                        {l.auction
                          ? t.from
                          : "KAŽUN / " + String(l.id).padStart(2, "0")}
                      </span>
                      <span>{money(l.price)}</span>
                    </div>
                    <h3>
                      <button
                        onClick={() => open({ kind: "customer", listing: l })}
                      >
                        {l.name}
                      </button>
                    </h3>
                    <p>{l.description}</p>
                    {!!l.auction && (
                      <div className="bid-meta">
                        {t.current}: {money(l.highestBid)} · {l.bidCount}{" "}
                        {t.bids.toLowerCase()}
                        <br />
                        {t.ends}: {date(l.ends)}
                      </div>
                    )}
                  </article>
                ))}
            </div>
            {!publicListings.filter(
              (l) =>
                filter === "all" ||
                (filter === "auction"
                  ? l.auction
                  : l.status === filter && !l.auction),
            ).length && (
              <div className="empty">
                <Kazun small />
                <h3>{t.empty}</h3>
                <p>{t.emptyText}</p>
              </div>
            )}
          </section>
          <section id="craft" className="craft">
            <div className="craft-image">
              <Kazun />
              <span>THE BEAUTY IS IN THE DETAILS.</span>
            </div>
            <div className="craft-copy">
              <div className="eyebrow">ROOTED IN TRADITION</div>
              <h2>{t.craftTitle}</h2>
              <p>{t.craftBody}</p>
              <span className="signature">Kazuni Nina</span>
            </div>
          </section>
          <section id="visit" className="visit">
            <span className="eyebrow">FROM OUR HANDS TO YOUR HOME</span>
            <h2>{t.visitTitle}</h2>
            <p>{t.visitText}</p>
            <a href="#collection" className="button">
              {t.explore} <Arrow />
            </a>
          </section>
        </main>
      ) : (
        <main className="admin-main">
          {!session ? (
            <section className="login-panel">
              <div className="eyebrow">KAZUNI NINA</div>
              <h2>{t.login}</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action(async () => {
                    await api("/admin/login", { password: f.get("password") });
                  });
                }}
              >
                <Field label={t.password}>
                  <input
                    type="password"
                    name="password"
                    required
                    maxLength="256"
                    autoComplete="current-password"
                  />
                </Field>
                <button className="button" disabled={busy}>
                  {t.signIn}
                </button>
              </form>
            </section>
          ) : (
            <>
              <div className="section-top">
                <div>
                  <div className="eyebrow">ADMIN</div>
                  <h2>{t.dashboard}</h2>
                </div>
                <button
                  onClick={() => action(async () => api("/admin/logout", {}))}
                >
                  {t.logout}
                </button>
              </div>
              <div className="stats">
                <div>
                  <b>
                    {
                      catalog.listings.filter((l) => l.status === "available")
                        .length
                    }
                  </b>
                  {t.available}
                </div>
                <div>
                  <b>
                    {
                      adminData.orders.filter((o) => o.status === "pending")
                        .length
                    }
                  </b>
                  {t.pending}
                </div>
                <div>
                  <b>{adminData.bids.length}</b>
                  {t.bids}
                </div>
              </div>
              <div className="filters">
                {["listings", "orders", "bids", "calendar"].map((x) => (
                  <button
                    className={tab === x ? "active" : ""}
                    key={x}
                    onClick={() => setTab(x)}
                  >
                    {t[x]}
                  </button>
                ))}
              </div>
              {tab === "listings" && (
                <>
                  <button
                    className="button"
                    onClick={() => open({ kind: "listing" })}
                  >
                    + {t.add}
                  </button>
                  <div className="admin-list">
                    {catalog.listings.map((l) => (
                      <div className="admin-row" key={l.id}>
                        <img src={l.image} alt="" />
                        <div>
                          <h3>{l.name}</h3>
                          <p>
                            {money(l.price)} ·{" "}
                            {l.auction ? t.auction : t[l.status]}
                          </p>
                        </div>
                        <button
                          onClick={() => open({ kind: "listing", listing: l })}
                        >
                          {t.edit}
                        </button>
                        <select
                          aria-label={t.status}
                          value={l.status}
                          onChange={(e) =>
                            action(() =>
                              api(
                                "/admin/listings/" + l.id,
                                { status: e.target.value },
                                "PATCH",
                              ),
                            )
                          }
                        >
                          {["available", "reserved", "sold", "hidden"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {t[s]}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === "calendar" && (
                <>
                  <button
                    className="button"
                    onClick={() => open({ kind: "slot" })}
                  >
                    + {t.newSlot}
                  </button>
                  <div className="admin-list">
                    {adminData.slots.map((s) => (
                      <div className="admin-row" key={s.id}>
                        <div className="date-icon">▦</div>
                        <div>
                          <h3>{date(s.date)}</h3>
                          <p>
                            {t[s.mode]} · {s.place} · {t.capacity}: {s.capacity}
                          </p>
                        </div>
                        <button
                          disabled={busy}
                          onClick={() =>
                            action(() =>
                              api("/admin/slots/" + s.id, null, "DELETE"),
                            )
                          }
                        >
                          {t.remove}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === "orders" && (
                <div className="records">
                  {adminData.orders.map((o) => (
                    <article key={o.id}>
                      <span className="badge">{t[o.status]}</span>
                      <h3>
                        #{o.id} · {o.listingName}
                      </h3>
                      <p>
                        {o.name} ·{" "}
                        <a href={"tel:" + o.phone.replace(/[^+\d]/g, "")}>
                          {o.phone}
                        </a>
                      </p>
                      <p>
                        {t[o.mode]} · {date(o.date)} · {o.place}
                      </p>
                      {o.address && <p>{o.address}</p>}
                      {!["cancelled", "completed"].includes(o.status) && (
                        <div className="row-actions">
                          {o.status === "pending" && (
                            <button
                              disabled={busy}
                              onClick={() =>
                                action(() =>
                                  api(
                                    "/admin/orders/" + o.id,
                                    { status: "confirmed" },
                                    "PATCH",
                                  ),
                                )
                              }
                            >
                              {t.confirm}
                            </button>
                          )}
                          <button
                            disabled={busy}
                            onClick={() =>
                              action(() =>
                                api(
                                  "/admin/orders/" + o.id,
                                  { status: "completed" },
                                  "PATCH",
                                ),
                              )
                            }
                          >
                            {t.complete}
                          </button>
                          <button
                            disabled={busy}
                            onClick={() =>
                              action(() =>
                                api(
                                  "/admin/orders/" + o.id,
                                  { status: "cancelled" },
                                  "PATCH",
                                ),
                              )
                            }
                          >
                            {t.cancel}
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                  {!adminData.orders.length && <p>{t.noRecords}</p>}
                </div>
              )}
              {tab === "bids" && (
                <div className="records">
                  {adminData.bids.map((b) => (
                    <article key={b.id}>
                      <div className="card-meta">
                        <span>{b.listingName}</span>
                        <strong>{money(b.amount)}</strong>
                      </div>
                      <h3>{b.name}</h3>
                      <p>
                        <a href={"tel:" + b.phone.replace(/[^+\d]/g, "")}>
                          {b.phone}
                        </a>{" "}
                        · {date(b.created + "Z")}
                      </p>
                    </article>
                  ))}
                  {!adminData.bids.length && <p>{t.noRecords}</p>}
                </div>
              )}
            </>
          )}
        </main>
      )}
      <footer>
        <div className="brand">
          KAZUNI <b>NINA</b>
        </div>
        <p>{t.footer}</p>
        <span>© {new Date().getFullYear()} Kazuni Nina</span>
      </footer>
      {modal && (
        <div
          className="overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !busy) setModal(null);
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              className="close"
              aria-label={t.cancel}
              disabled={busy}
              onClick={() => setModal(null)}
            >
              ×
            </button>
            <h2 id="modal-title">
              {modal.kind === "customer"
                ? modal.listing.name
                : modal.kind === "slot"
                  ? t.newSlot
                  : modal.listing
                    ? t.edit
                    : t.add}
            </h2>
            {error && (
              <div role="alert" className="error">
                {error}
              </div>
            )}
            {modal.kind === "customer" ? (
              <CustomerForm
                listing={modal.listing}
                {...{
                  t,
                  date,
                  money,
                  Field,
                  api,
                  action,
                  busy,
                  catalog,
                  setModal,
                  setNotice,
                }}
              />
            ) : modal.kind === "slot" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action(async () => {
                    await api("/admin/slots", {
                      date: new Date(f.get("date")).toISOString(),
                      place: f.get("place"),
                      mode: f.get("mode"),
                      capacity: Number(f.get("capacity")),
                    });
                    setModal(null);
                  });
                }}
              >
                <Field label={t.date}>
                  <input type="datetime-local" name="date" required />
                </Field>
                <Field label={t.place}>
                  <input name="place" required maxLength="200" />
                </Field>
                <Field label={t.mode}>
                  <select name="mode">
                    <option value="pickup">{t.pickup}</option>
                    <option value="delivery">{t.delivery}</option>
                  </select>
                </Field>
                <Field label={t.capacity}>
                  <input
                    name="capacity"
                    type="number"
                    defaultValue="1"
                    min="1"
                    max="100"
                    required
                  />
                </Field>
                <button className="button" disabled={busy}>
                  {t.save}
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action(async () => {
                    let image = modal.listing?.image;
                    if (!modal.listing || f.get("image")?.size) {
                      const upload = new FormData();
                      upload.append("image", f.get("image"));
                      image = (await api("/admin/upload", upload)).url;
                    }
                    const body = {
                      name: f.get("name"),
                      description: f.get("description"),
                      price: Math.round(Number(f.get("price")) * 100),
                      image,
                      auction: f.get("auction") === "on",
                      ends: f.get("ends")
                        ? new Date(f.get("ends")).toISOString()
                        : null,
                    };
                    await api(
                      "/admin/listings" +
                        (modal.listing ? "/" + modal.listing.id : ""),
                      body,
                      modal.listing ? "PATCH" : "POST",
                    );
                    setModal(null);
                  });
                }}
              >
                <Field label={t.name}>
                  <input
                    name="name"
                    required
                    maxLength="100"
                    defaultValue={modal.listing?.name}
                  />
                </Field>
                <Field label={t.description}>
                  <textarea
                    name="description"
                    required
                    maxLength="3000"
                    defaultValue={modal.listing?.description}
                  />
                </Field>
                <Field label={t.price}>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    defaultValue={
                      modal.listing ? modal.listing.price / 100 : undefined
                    }
                  />
                </Field>
                <Field label={t.photo}>
                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required={!modal.listing}
                  />
                </Field>
                {!modal.listing && (
                  <>
                    <label className="check">
                      <input name="auction" type="checkbox" />
                      {t.auction}
                    </label>
                    <Field label={t.deadline}>
                      <input name="ends" type="datetime-local" />
                    </Field>
                  </>
                )}
                <button className="button" disabled={busy}>
                  {busy ? "…" : t.save}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
function CustomerForm({
  listing: l,
  t,
  date,
  money,
  Field,
  api,
  action,
  busy,
  catalog,
  setModal,
  setNotice,
}) {
  const [mode, setMode] = useState("pickup");
  const slots = catalog.slots.filter((s) => s.mode === mode);
  const open =
    l.status === "available" && (!l.auction || Date.parse(l.ends) > Date.now());
  return (
    <>
      <img className="detail-image" src={l.image} alt={l.name} />
      <p className="description">{l.description}</p>
      <div className="detail-price">
        {money(l.price)}{" "}
        {!!l.auction && (
          <small>
            {t.current}: {money(l.highestBid)}
            <br />
            {t.ends}: {date(l.ends)}
          </small>
        )}
      </div>
      {open ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            action(async () => {
              await api(l.auction ? "/bids" : "/orders", {
                listingId: l.id,
                name: f.get("name"),
                phone: f.get("phone"),
                amount: Math.round(Number(f.get("amount")) * 100),
                slotId: Number(f.get("slotId")),
                address: f.get("address") || "",
              });
              setModal(null);
              setNotice(l.auction ? t.bidSuccess : t.success);
            });
          }}
        >
          <div className="form-row">
            <Field label={t.name}>
              <input name="name" required maxLength="100" autoComplete="name" />
            </Field>
            <Field label={t.phone}>
              <input
                name="phone"
                type="tel"
                required
                maxLength="30"
                autoComplete="tel"
              />
            </Field>
          </div>
          {l.auction ? (
            <Field label={t.amount}>
              <input
                name="amount"
                type="number"
                step="0.01"
                min={Math.max(l.price, l.highestBid + 1) / 100}
                required
              />
            </Field>
          ) : (
            <>
              <Field label={t.mode}>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="pickup">{t.pickup}</option>
                  <option value="delivery">{t.delivery}</option>
                </select>
              </Field>
              <Field label={t.appointment}>
                <select key={mode} name="slotId" required defaultValue="">
                  <option value="" disabled>
                    {t.choose}
                  </option>
                  {slots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {date(s.date)} · {s.place}
                    </option>
                  ))}
                </select>
              </Field>
              {!slots.length && <p className="error">{t.noSlots}</p>}
              {mode === "delivery" && (
                <Field label={t.address}>
                  <textarea
                    name="address"
                    required
                    maxLength="500"
                    autoComplete="street-address"
                  />
                </Field>
              )}
            </>
          )}
          <p className="fineprint">{l.auction ? t.auctionNote : t.orderNote}</p>
          <p className="fineprint">{t.privacy}</p>
          <button
            className="button full"
            disabled={busy || (!l.auction && !slots.length)}
          >
            {busy ? "…" : l.auction ? t.sendBid : t.submit} <Arrow />
          </button>
        </form>
      ) : (
        <p className="closed">
          {l.auction && l.status === "available"
            ? t.ends + ": " + date(l.ends)
            : t[l.status]}
        </p>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
