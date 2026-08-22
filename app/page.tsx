"use client";

import { useMemo, useState } from "react";

type Guide = {
  id: string; title: string; section: string; summary: string; time: string; updated: string;
  before: string[]; steps: { title: string; text: string; link?: { label: string; href: string } }[];
  problems: string[]; official: { label: string; href: string }[];
};

const sections = [
  { id: "access", title: "Access & Setup", icon: "⌘" },
  { id: "personnel", title: "IPPS-A & Personnel", icon: "◎" },
  { id: "evaluations", title: "Evaluations & NCOERs", icon: "✓" },
  { id: "travel", title: "DTS & Travel", icon: "↗" },
  { id: "forms", title: "Forms & Publications", icon: "▤" },
  { id: "leader", title: "Leader Tools", icon: "◇" },
];

const guides: Guide[] = [
  {
    id: "avd", title: "Access Army AVD", section: "access", time: "8 min", updated: "Aug 2026",
    summary: "Enroll, install Windows App, and connect to the Army virtual desktop.",
    before: ["Active @army.mil account", "CAC, PIN, and working CAC reader", "Personal Windows or macOS computer"],
    steps: [
      { title: "Request access", text: "From a CAC-capable computer, request Army AVD access through the Army Microsoft MyAccess package. Accept the terms and submit the request.", link: { label: "Open AVD enrollment", href: "https://myaccess.microsoft.us/@armyeitaas.onmicrosoft.us#/access-packages/b0a616f3-d77c-4f2d-bbb1-5d1bb9c5d709" } },
      { title: "Install Windows App", text: "After access is provisioned, install Windows App on your personal computer. This is the current client for new Windows installations.", link: { label: "Get Windows App", href: "https://apps.microsoft.com/detail/9N1F85V9T8BN" } },
      { title: "Sign in with your Army account", text: "Open Windows App, select Sign in, enter your full @army.mil address, choose the PIV Authentication certificate, and enter your CAC PIN." },
      { title: "Connect to a desktop", text: "Select Army365 AVD – Virginia or Arizona, choosing the closest available location. Accept the DoD warning banner to open the virtual desktop." },
    ],
    problems: ["No desktop appears: wait 15–30 minutes after enrollment, then sign out and reopen Windows App.", "CAC certificate missing: reconnect the reader and select PIV Authentication—not email signing.", "Still blocked: contact AESD or your unit S6."],
    official: [{ label: "Army AVD setup guide", href: "https://ipps-a.army.mil/Portals/129/Documents/IPPSA_Hypori_AVD%20Instructions_20260723.pdf" }, { label: "Army Enterprise Service Desk", href: "https://www.aesmp.army.mil" }],
  },
  {
    id: "adobe", title: "Set Adobe as the default PDF app", section: "access", time: "3 min", updated: "Aug 2026", summary: "Open Army PDF forms in Acrobat by default instead of the browser.", before: ["Adobe Acrobat installed", "Windows computer", "A sample PDF file"],
    steps: [{ title: "Find a PDF", text: "Locate any PDF file in File Explorer." }, { title: "Open file properties", text: "Right-click the file, select Properties, then find the Opens with setting." }, { title: "Choose Adobe Acrobat", text: "Select Change, choose Adobe Acrobat, and confirm with OK." }, { title: "Verify", text: "Double-click the PDF. It should now open in Acrobat, where you can use certificate and signature tools." }],
    problems: ["If Acrobat is not listed, install or request the approved Acrobat application first.", "A browser can still open PDF links; download the file to use the default application."], official: [],
  },
  {
    id: "sign-pdf", title: "Digitally sign a PDF", section: "access", time: "5 min", updated: "Aug 2026", summary: "Use your CAC certificate to sign a completed PDF form in Adobe Acrobat.", before: ["PDF opened in Acrobat", "CAC reader connected", "Required fields completed before signing"],
    steps: [{ title: "Open the form in Acrobat", text: "Do not sign a document while it is still open inside a web browser." }, { title: "Select the signature field", text: "Click the designated signature block and choose the CAC certificate required by the form." }, { title: "Enter your PIN", text: "Enter the CAC PIN only in the certificate prompt. Never type it into a document field." }, { title: "Save a signed copy", text: "Use Save As with a clear file name. Reopen the saved file to confirm the signature is present." }],
    problems: ["If the signature field is locked, confirm the form is complete and not already signed by a later signer.", "If the CAC prompt does not appear, close Acrobat and reconnect the CAC reader."], official: [],
  },
  {
    id: "ippsa", title: "Access IPPS-A", section: "personnel", time: "7 min", updated: "Aug 2026", summary: "Open IPPS-A securely and review your personnel information.", before: ["Army network, AVD, or approved access path", "CAC and PIN", "Current browser"],
    steps: [{ title: "Use an approved access path", text: "From a personal computer, use AVD. From government equipment, use the authorized NIPR or VPN path." }, { title: "Open IPPS-A", text: "Navigate to IPPS-A and select the CAC login option." }, { title: "Select the correct certificate", text: "Choose the PIV Authentication certificate, then enter your PIN." }, { title: "Review your profile", text: "Start with your Soldier Talent Profile and verify basic information before submitting an action." }],
    problems: ["Access or role errors usually require unit S1 or IPPS-A support—not repeated login attempts.", "If using a personal device, confirm you are inside AVD."], official: [{ label: "Open IPPS-A", href: "https://my.ippsa.army.mil" }],
  },
  {
    id: "ncoer", title: "Access EES and sign an NCOER", section: "evaluations", time: "6 min", updated: "Aug 2026", summary: "Review the evaluation carefully, sign with CAC, and verify completion.", before: ["CAC access", "Evaluation assigned and ready for your signature", "Time to review every entry"],
    steps: [{ title: "Open EES", text: "Use the Evaluation Entry System from an approved Army access path." }, { title: "Review the evaluation", text: "Confirm administrative information, rating period, duty description, and narrative comments before signing." }, { title: "Select the proper certificate", text: "Use the PIV Authentication certificate when prompted by the system." }, { title: "Sign and verify", text: "Complete the signature action and verify the evaluation status changed as expected." }],
    problems: ["Do not sign an evaluation you have not reviewed.", "If the evaluation is unavailable or incorrect, contact the rater, senior rater, or unit S1."], official: [],
  },
  {
    id: "dts", title: "Create a DTS authorization", section: "travel", time: "10 min", updated: "Aug 2026", summary: "Start travel correctly and send the authorization through your unit’s routing process.", before: ["Unit travel instructions", "Approved travel dates and location", "Correct line of accounting and routing guidance"],
    steps: [{ title: "Create an authorization", text: "Open DTS, choose Create New Document, and select Authorization." }, { title: "Enter itinerary and reservations", text: "Enter only the travel that your unit has authorized. Keep receipts and supporting documents." }, { title: "Review expenses", text: "Check transportation, lodging, rental car, and per diem against unit instructions." }, { title: "Sign and submit", text: "Digitally sign the authorization and send it through the assigned routing list." }],
    problems: ["Do not guess a line of accounting or routing official—ask the ODTA or unit travel point of contact.", "A returned document normally includes reviewer comments; correct the listed issue before resubmitting."], official: [{ label: "Open DTS", href: "https://dtsproweb.defensetravel.osd.mil" }],
  },
  {
    id: "armypubs", title: "Find current Army regulations and forms", section: "forms", time: "4 min", updated: "Aug 2026", summary: "Use Army Publishing Directorate to find the current version—not a random search result.", before: ["Regulation, pamphlet, or form number when available", "Internet access", "Adobe Acrobat for downloadable PDFs"],
    steps: [{ title: "Open Army Publishing Directorate", text: "Start with the official Army Publishing Directorate website." }, { title: "Search by number first", text: "Search for the exact AR, DA PAM, ATP, ADP, or form number before searching by title." }, { title: "Confirm status and date", text: "Check that the publication or form is current before using it." }, { title: "Download from the official source", text: "Use the official PDF and save it with a meaningful file name." }],
    problems: ["Avoid unofficial copies when an official version is available.", "If a form is missing, verify whether it was replaced, revised, or rescinded."], official: [{ label: "Army Publishing Directorate", href: "https://armypubs.army.mil" }],
  },
  {
    id: "counseling", title: "Complete a developmental counseling", section: "leader", time: "9 min", updated: "Aug 2026", summary: "Prepare a clear DA Form 4856 counseling with actionable expectations and follow-up.", before: ["Purpose of counseling", "Relevant facts and standards", "Private setting and time for discussion"],
    steps: [{ title: "Identify the counseling type", text: "State whether the counseling is event-oriented, performance, professional growth, or another appropriate category." }, { title: "Document the key discussion", text: "Use clear facts, expectations, and standards. Avoid vague language and unsupported conclusions." }, { title: "Create a plan of action", text: "Include specific actions, a realistic timeline, and who is responsible for each action." }, { title: "Conduct and document follow-up", text: "Discuss the counseling with the Soldier and schedule follow-up when needed." }],
    problems: ["A form is not a substitute for the actual counseling conversation.", "For adverse or complex issues, use current command policy and seek leader or legal guidance as appropriate."], official: [],
  },
];

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(["access"]);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const active = activeId ? guides.find((guide) => guide.id === activeId) ?? null : null;
  const filtered = useMemo(() => guides.filter((guide) => `${guide.title} ${guide.section}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const selectGuide = (id: string) => { setActiveId(id); setMenuOpen(false); const section = guides.find((guide) => guide.id === id)?.section; if (section && !openSections.includes(section)) setOpenSections((current) => [...current, section]); };
  const selectAllGuides = () => { setActiveId(null); setQuery(""); setOpenSections(sections.map((section) => section.id)); setMenuOpen(false); };
  const toggleSection = (id: string) => setOpenSections((current) => current.includes(id) ? current.filter((section) => section !== id) : [...current, id]);

  return <main className="app-shell">
    <aside className={menuOpen ? "sidebar mobile-open" : "sidebar"} aria-label="Guide navigation">
      <div className="sidebar-brand"><span className="brand-block">B</span><div><strong>B Co 2-485</strong><small>Soldier Guide</small></div><button className="collapse-button" onClick={() => setMenuOpen(false)} aria-label="Collapse guide menu">‹</button></div>
      <p className="sidebar-tagline">Administrative, digital-access, and readiness resources</p>
      <label className="sidebar-search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setActiveId(null); }} placeholder="Search guides" aria-label="Search all guides" /></label>
      <nav className="guide-nav">
        <button className={activeId ? "all-guides" : "all-guides active"} onClick={selectAllGuides}><span>▦</span>All Guides <b>{guides.length}</b></button>
        {sections.map((section) => {
          const children = filtered.filter((guide) => guide.section === section.id);
          const isOpen = openSections.includes(section.id) || query.length > 0;
          return <div className="nav-section" key={section.id}>
            <button className={active?.section === section.id ? "nav-section-button section-active" : "nav-section-button"} onClick={() => toggleSection(section.id)} aria-expanded={isOpen}><span className="nav-icon">{section.icon}</span><span>{section.title}</span><b>{isOpen ? "⌄" : "›"}</b></button>
            {isOpen && <div className="sub-guides">{children.map((guide) => <button key={guide.id} onClick={() => selectGuide(guide.id)} className={activeId === guide.id ? "sub-guide selected" : "sub-guide"}>{guide.title}</button>)}{children.length === 0 && <span className="no-guide">No matches</span>}</div>}
          </div>;
        })}
      </nav>
      <div className="sidebar-bottom"><span className="green-dot"></span><div><strong>Reference only</strong><small>Official guidance takes precedence.</small></div></div>
    </aside>

    <section className="article-shell">
      <header className="article-header"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open guide menu">☰</button><div className="breadcrumbs"><span>{active ? sections.find((section) => section.id === active.section)?.title : "Guide Library"}</span><b>/</b><strong>{active?.title ?? "All Guides"}</strong></div><div className="article-actions"><span>{active ? `Last verified: ${active.updated}` : `${guides.length} guides · ${sections.length} sections`}</span>{active && <button onClick={() => window.print()}>▣ Print</button>}</div></header>
      {active ? <article className="article-content">
          <div className="article-main">
            <button className="back-to-library" onClick={selectAllGuides}>← All guides</button>
            <span className="article-eyebrow">HOW-TO GUIDE</span><h1>{active.title}</h1><p className="article-summary">{active.summary}</p>
            <section className="before-card" id="before"><div className="before-title"><span>!</span><h2>Before you begin</h2></div><div className="before-items">{active.before.map((item) => <div key={item}><span>◌</span>{item}</div>)}</div></section>
            <section className="steps" id="steps">{active.steps.map((step, index) => <div className="step" key={step.title}><div className="step-number">{index + 1}</div><div className="step-copy"><h2>{step.title}</h2><p>{step.text}</p>{step.link && <a className="official-link" href={step.link.href} target="_blank" rel="noreferrer">↗ {step.link.label}</a>}</div><div className="screen-placeholder" aria-label={`Illustration placeholder for step ${index + 1}`}><span>STEP {index + 1}</span><i></i><i></i><i></i></div></div>)}</section>
            <section className="problems" id="problems"><div className="problem-heading"><span>!</span><h2>Common problems</h2></div><ul>{active.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></section>
            <section className="official-sources" id="sources"><h2>Official resources</h2>{active.official.length ? <div>{active.official.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<span>↗</span></a>)}</div> : <p>Use current Army and local command guidance for this task. Add unit-approved links here as they are verified.</p>}</section>
            <footer className="article-footer"><strong>B Co 2-485 Soldier Guide</strong><p>Unofficial reference. Official Army guidance, local command policy, and the current version of every system take precedence.</p><small>This site does not collect or store information.</small></footer>
          </div>
          <aside className="on-page"><strong>ON THIS PAGE</strong><a href="#before">Before you begin</a><a href="#steps">Instructions</a><a href="#problems">Common problems</a><a href="#sources">Official resources</a><button onClick={selectAllGuides}>Browse all guides →</button></aside>
        </article> : <article className="library-page">
          <div className="library-intro"><span className="article-eyebrow">GUIDE LIBRARY</span><h1>All Guides</h1><p>Find the task you need, follow the steps, and use the official resource links when provided.</p><div className="reference-banner"><span>i</span><div><strong>Unit reference—not an official Army publication</strong><small>Always follow current Army guidance and local command policy.</small></div></div></div>
          <label className="library-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by task, system, or topic" aria-label="Search the guide library" />{query && <button onClick={() => setQuery("")} aria-label="Clear search">Clear</button>}</label>
          <div className="library-stats"><div><strong>{filtered.length}</strong><span>{query ? "matching guides" : "available guides"}</span></div><div><strong>{sections.length}</strong><span>task sections</span></div><div><strong>No login</strong><span>no information stored</span></div></div>
          <div className="guide-groups">{sections.map((section) => {
            const children = filtered.filter((guide) => guide.section === section.id);
            if (!children.length) return null;
            return <section className="guide-group" key={section.id}><div className="group-heading"><span>{section.icon}</span><div><h2>{section.title}</h2><small>{children.length} {children.length === 1 ? "guide" : "guides"}</small></div></div><div className="guide-cards">{children.map((guide) => <button className="guide-card" key={guide.id} onClick={() => selectGuide(guide.id)}><div><h3>{guide.title}</h3><p>{guide.summary}</p></div><footer><span>{guide.time}</span><span>Verified {guide.updated}</span><b>Open guide →</b></footer></button>)}</div></section>;
          })}</div>
          {!filtered.length && <div className="empty-results"><strong>No guides match “{query}”</strong><p>Try a system name such as AVD, IPPS-A, DTS, PDF, or NCOER.</p><button onClick={() => setQuery("")}>Clear search</button></div>}
          <footer className="article-footer library-footer"><strong>B Co 2-485 Soldier Guide</strong><p>Administrative, digital-access, and readiness resources for Soldiers and leaders.</p><small>This site does not collect or store information.</small></footer>
        </article>}
    </section>
  </main>;
}
