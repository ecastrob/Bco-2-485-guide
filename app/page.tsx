"use client";

import { useMemo, useState } from "react";

type Guide = {
  id: string; title: string; section: string; summary: string; time: string; updated: string;
  status: "source-verified" | "draft" | "unit-reviewed"; sourceNote?: string;
  before: string[]; steps: { title: string; text: string; expect?: string; link?: { label: string; href: string }; links?: { label: string; href: string }[] }[];
  problems: string[]; official: { label: string; href: string }[];
  helpful?: { label: string; href: string }[];
};

const statusDetails = {
  "source-verified": { label: "Source-verified", short: "Source-verified" },
  draft: { label: "Draft — pending verification", short: "Draft" },
  "unit-reviewed": { label: "Unit-reviewed", short: "Unit-reviewed" },
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
    id: "avd", title: "Set up and access Army AVD", section: "access", time: "15–25 min + training", updated: "23 Aug 2026", status: "source-verified",
    summary: "Request access, connect with Windows App, and use the Army virtual desktop from a Windows or macOS computer.",
    sourceNote: "Compared against the Army IPPS-A AVD instructions dated 23 July 2026, Army AVS baseline-access guidance, Army NETCOM guidance, and current Microsoft Azure Government client guidance.",
    before: ["Active Army 365 @army.mil account", "CAC, PIN, and working CAC reader", "Access to JKO and Army AVS/ICAM"],
    steps: [
      { title: "Complete Cyber Awareness and the Army IT agreement", text: "Before requesting AVD access, make sure your Cyber Awareness Challenge training is current. Open JKO, sign in, and search for the current Cyber Awareness Challenge course; save the completion certificate. Then open Army AVS/ICAM, review and sign the Army IT User Agreement or Authorized Use Policy, submit it through the required approval chain, and confirm that it shows as current. Follow your unit's instructions if it assigns the training through Army ATIS instead of JKO.", expect: "A current Cyber Awareness completion certificate and a completed Army IT agreement/AUP in AVS/ICAM.", links: [{ label: "Open JKO training portal", href: "https://jko.jten.mil/" }, { label: "Open Army AVS/ICAM", href: "https://iga.army.mil/" }] },
      { title: "Choose the right access method", text: "Use Windows App when you need the full experience, including CAC redirection to sites inside AVD or S/MIME email. The government web client is a fallback for basic access, but it does not pass your local smart card into the virtual session.", expect: "Recommended: Windows App on Windows or macOS." },
      { title: "Request Army AVD access", text: "On a CAC-capable computer, open the Army Microsoft MyAccess package. Select Continue, acknowledge the terms, and submit the request. Dual-persona users must complete enrollment separately for each persona they intend to use.", expect: "MyAccess shows that the request was submitted or that access is already assigned.", link: { label: "Open official AVD enrollment", href: "https://myaccess.microsoft.us/@armyeitaas.onmicrosoft.us#/access-packages/b0a616f3-d77c-4f2d-bbb1-5d1bb9c5d709" } },
      { title: "Allow time for provisioning", text: "Army guidance says access is normally created in about 15 minutes and a confirmation is sent to your Army email. No action is required in that email. If the desktop does not appear after about 30 minutes, refresh the client before contacting support.", expect: "Your Army365 AVD resources become available after provisioning." },
      { title: "Install Windows App", text: "Install Microsoft Windows App on your personal Windows or macOS computer. Some Army instructions still call the client Microsoft Remote Desktop; Microsoft has replaced that older client with Windows App for new use.", expect: "The installed application is named Windows App.", link: { label: "Get Windows App for Windows", href: "https://apps.microsoft.com/detail/9N1F85V9T8BN" } },
      { title: "Sign in or add the Army workspace", text: "Open Windows App and sign in with your full @army.mil address. If your Army desktops do not populate automatically, select Add Workspace and enter rdweb.wvd.azure.us. If the client requires the full feed URL, use https://rdweb.wvd.azure.us/api/arm/feeddiscovery.", expect: "An Army365 AVD desktop card appears in Windows App." },
      { title: "Authenticate with your CAC", text: "Insert your CAC, select the Certificate for PIV Authentication, and enter your PIN. Do not choose the email-signing certificate. On macOS, smart-card redirection must be enabled for CAC use inside the virtual desktop.", expect: "CAC authentication completes without a certificate or PIN error." },
      { title: "Connect to the closest desktop", text: "Open the Army365 AVD desktop closest to your location. Depending on the current client, the choices may appear as East/West or Virginia/Arizona. Read and accept the Department of Defense warning banner.", expect: "A Windows 11 Army virtual desktop opens." },
      { title: "Verify the session", text: "Confirm that Army 365 services open. If you used Windows App, test one CAC-enabled site you need inside AVD. Sign out of the virtual desktop when finished; closing only the app window can leave the session running.", expect: "Army 365 works and, when required, the CAC is visible inside the session." },
      { title: "Use the browser only as a fallback", text: "If you cannot install Windows App and only need basic access, open the Army Azure Government web client in Microsoft Edge. Sign in with your full @army.mil address and CAC, then select the closest desktop. Use Windows App instead for downstream CAC-enabled sites or encrypted email.", expect: "The virtual desktop opens in a browser tab with limited device redirection.", link: { label: "Open Army AVD web client", href: "https://client.wvd.azure.us/arm/webclient/index.html" } },
    ],
    problems: ["No desktop appears: confirm the MyAccess entitlement, wait at least 15 minutes, then sign out of Windows App and reopen it.", "CAC certificate is missing or rejected: reconnect the reader, reinsert the CAC, and select Certificate for PIV Authentication—not the email-signing certificate.", "CAC works at sign-in but not inside AVD on a Mac: open the desktop resource settings and confirm Smart cards is enabled under Devices & Audio redirection.", "Two Army personas: each persona needs its own enrollment and workspace. Unsubscribe from the current workspace before switching personas on a shared client.", "Still blocked: contact the Army Enterprise Service Desk at 1-866-335-2769 or use your unit S6 support process."],
    official: [
      { label: "Army IPPS-A AVD instructions — July 2026", href: "https://ipps-a.army.mil/Portals/129/Documents/IPPSA_Hypori_AVD%20Instructions_20260723.pdf" },
      { label: "Army AVS baseline-access guidance", href: "https://www.army.mil/article/284831/army_training_and_certification_tracking_system_sunsetting_may_1_replaced_by_streamlined_account_validation_system" },
      { label: "JKO training portal", href: "https://jko.jten.mil/" },
      { label: "Army AVS/ICAM", href: "https://iga.army.mil/" },
      { label: "Army NETCOM AVD information", href: "https://www.netcom.army.mil/Public/Resource-Types/Information/TechNet25/" },
      { label: "Microsoft: connect with Windows App", href: "https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps" },
      { label: "Microsoft: Azure Government client transition", href: "https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/connect-windows-cloud-services" },
      { label: "Army Enterprise Service Desk", href: "https://www.aesmp.army.mil" },
    ],
    helpful: [
      { label: "MilitaryCAC AVD troubleshooting", href: "https://www.militarycac.com/avd.htm" },
      { label: "ArmyLinks AVD registration overview", href: "https://armylinks.com/posts/army-enterprise-azure-virtual-desktop-registration/" },
    ],
  },
  {
    id: "adobe", title: "Set Adobe as the default PDF app", section: "access", time: "3 min", updated: "Pending", status: "draft", summary: "Open Army PDF forms in Acrobat by default instead of the browser.", before: ["Adobe Acrobat installed", "Windows computer", "A sample PDF file"],
    steps: [{ title: "Find a PDF", text: "Locate any PDF file in File Explorer." }, { title: "Open file properties", text: "Right-click the file, select Properties, then find the Opens with setting." }, { title: "Choose Adobe Acrobat", text: "Select Change, choose Adobe Acrobat, and confirm with OK." }, { title: "Verify", text: "Double-click the PDF. It should now open in Acrobat, where you can use certificate and signature tools." }],
    problems: ["If Acrobat is not listed, install or request the approved Acrobat application first.", "A browser can still open PDF links; download the file to use the default application."], official: [],
  },
  {
    id: "sign-pdf", title: "Digitally sign a PDF", section: "access", time: "5 min", updated: "Pending", status: "draft", summary: "Use your CAC certificate to sign a completed PDF form in Adobe Acrobat.", before: ["PDF opened in Acrobat", "CAC reader connected", "Required fields completed before signing"],
    steps: [{ title: "Open the form in Acrobat", text: "Do not sign a document while it is still open inside a web browser." }, { title: "Select the signature field", text: "Click the designated signature block and choose the CAC certificate required by the form." }, { title: "Enter your PIN", text: "Enter the CAC PIN only in the certificate prompt. Never type it into a document field." }, { title: "Save a signed copy", text: "Use Save As with a clear file name. Reopen the saved file to confirm the signature is present." }],
    problems: ["If the signature field is locked, confirm the form is complete and not already signed by a later signer.", "If the CAC prompt does not appear, close Acrobat and reconnect the CAC reader."], official: [],
  },
  {
    id: "ippsa", title: "Access IPPS-A", section: "personnel", time: "7 min", updated: "Pending", status: "draft", summary: "Open IPPS-A securely and review your personnel information.", before: ["Army network, AVD, or approved access path", "CAC and PIN", "Current browser"],
    steps: [{ title: "Use an approved access path", text: "From a personal computer, use AVD. From government equipment, use the authorized NIPR or VPN path." }, { title: "Open IPPS-A", text: "Navigate to IPPS-A and select the CAC login option." }, { title: "Select the correct certificate", text: "Choose the PIV Authentication certificate, then enter your PIN." }, { title: "Review your profile", text: "Start with your Soldier Talent Profile and verify basic information before submitting an action." }],
    problems: ["Access or role errors usually require unit S1 or IPPS-A support—not repeated login attempts.", "If using a personal device, confirm you are inside AVD."], official: [{ label: "Open IPPS-A", href: "https://my.ippsa.army.mil" }],
  },
  {
    id: "ncoer", title: "Access EES and sign an NCOER", section: "evaluations", time: "6 min", updated: "Pending", status: "draft", summary: "Review the evaluation carefully, sign with CAC, and verify completion.", before: ["CAC access", "Evaluation assigned and ready for your signature", "Time to review every entry"],
    steps: [{ title: "Open EES", text: "Use the Evaluation Entry System from an approved Army access path." }, { title: "Review the evaluation", text: "Confirm administrative information, rating period, duty description, and narrative comments before signing." }, { title: "Select the proper certificate", text: "Use the PIV Authentication certificate when prompted by the system." }, { title: "Sign and verify", text: "Complete the signature action and verify the evaluation status changed as expected." }],
    problems: ["Do not sign an evaluation you have not reviewed.", "If the evaluation is unavailable or incorrect, contact the rater, senior rater, or unit S1."], official: [],
  },
  {
    id: "dts", title: "Create a DTS authorization", section: "travel", time: "10 min", updated: "Pending", status: "draft", summary: "Start travel correctly and send the authorization through your unit’s routing process.", before: ["Unit travel instructions", "Approved travel dates and location", "Correct line of accounting and routing guidance"],
    steps: [{ title: "Create an authorization", text: "Open DTS, choose Create New Document, and select Authorization." }, { title: "Enter itinerary and reservations", text: "Enter only the travel that your unit has authorized. Keep receipts and supporting documents." }, { title: "Review expenses", text: "Check transportation, lodging, rental car, and per diem against unit instructions." }, { title: "Sign and submit", text: "Digitally sign the authorization and send it through the assigned routing list." }],
    problems: ["Do not guess a line of accounting or routing official—ask the ODTA or unit travel point of contact.", "A returned document normally includes reviewer comments; correct the listed issue before resubmitting."], official: [{ label: "Open DTS", href: "https://dtsproweb.defensetravel.osd.mil" }],
  },
  {
    id: "armypubs", title: "Find current Army regulations and forms", section: "forms", time: "4 min", updated: "Pending", status: "draft", summary: "Use Army Publishing Directorate to find the current version—not a random search result.", before: ["Regulation, pamphlet, or form number when available", "Internet access", "Adobe Acrobat for downloadable PDFs"],
    steps: [{ title: "Open Army Publishing Directorate", text: "Start with the official Army Publishing Directorate website." }, { title: "Search by number first", text: "Search for the exact AR, DA PAM, ATP, ADP, or form number before searching by title." }, { title: "Confirm status and date", text: "Check that the publication or form is current before using it." }, { title: "Download from the official source", text: "Use the official PDF and save it with a meaningful file name." }],
    problems: ["Avoid unofficial copies when an official version is available.", "If a form is missing, verify whether it was replaced, revised, or rescinded."], official: [{ label: "Army Publishing Directorate", href: "https://armypubs.army.mil" }],
  },
  {
    id: "counseling", title: "Complete a developmental counseling", section: "leader", time: "9 min", updated: "Pending", status: "draft", summary: "Prepare a clear DA Form 4856 counseling with actionable expectations and follow-up.", before: ["Purpose of counseling", "Relevant facts and standards", "Private setting and time for discussion"],
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
      <header className="article-header"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open guide menu">☰</button><div className="breadcrumbs"><span>{active ? sections.find((section) => section.id === active.section)?.title : "Guide Library"}</span><b>/</b><strong>{active?.title ?? "All Guides"}</strong></div><div className="article-actions">{active ? <><span className={`status-pill status-${active.status}`}>{statusDetails[active.status].label}</span>{active.updated !== "Pending" && <span className="checked-date">Checked {active.updated}</span>}</> : <span>{guides.length} guides · {sections.length} sections</span>}{active && <button onClick={() => window.print()}>▣ Print</button>}</div></header>
      {active ? <article className="article-content">
          <div className="article-main">
            <button className="back-to-library" onClick={selectAllGuides}>← All guides</button>
            <span className="article-eyebrow">HOW-TO GUIDE</span><h1>{active.title}</h1><p className="article-summary">{active.summary}</p>
            <section className={`source-status source-status-${active.status}`} aria-label="Guide source status"><div><span className={`status-pill status-${active.status}`}>{statusDetails[active.status].label}</span>{active.updated !== "Pending" && <small>Sources checked {active.updated}</small>}</div><p>{active.sourceNote ?? "This guide is a working draft. Confirm the process against current official guidance and unit procedures before relying on it."}</p></section>
            <section className="before-card" id="before"><div className="before-title"><span>!</span><h2>Before you begin</h2></div><div className="before-items">{active.before.map((item) => <div key={item}><span>◌</span>{item}</div>)}</div></section>
            <section className="steps" id="steps">{active.steps.map((step, index) => <div className="step" key={step.title}><div className="step-number">{index + 1}</div><div className="step-copy"><h2>{step.title}</h2><p>{step.text}</p>{(step.links ?? (step.link ? [step.link] : [])).length > 0 && <div className="step-links">{(step.links ?? (step.link ? [step.link] : [])).map((link) => <a className="official-link" key={link.label} href={link.href} target="_blank" rel="noreferrer">↗ {link.label}</a>)}</div>}</div>{step.expect ? <div className="step-expect"><strong>WHAT YOU SHOULD SEE</strong><span>{step.expect}</span></div> : <div className="screen-placeholder" aria-label={`Visual pending for step ${index + 1}`}><span>VISUAL PENDING</span><i></i><i></i><i></i></div>}</div>)}</section>
            <section className="problems" id="problems"><div className="problem-heading"><span>!</span><h2>Common problems</h2></div><ul>{active.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></section>
            <section className="official-sources" id="sources"><h2>Official resources</h2>{active.official.length ? <div>{active.official.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<span>↗</span></a>)}</div> : <p>Official sources have not yet been attached to this draft. Use current Army and local command guidance before completing the task.</p>}{active.helpful?.length ? <div className="helpful-sources"><h3>Additional help — nonofficial</h3><p>These independent sites can help with troubleshooting, but Army and Microsoft sources take precedence.</p><div>{active.helpful.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<span>↗</span></a>)}</div></div> : null}</section>
            <footer className="article-footer"><strong>B Co 2-485 Soldier Guide</strong><p>Unofficial reference. Official Army guidance, local command policy, and the current version of every system take precedence.</p><small>This site does not collect or store information.</small></footer>
          </div>
          <aside className="on-page"><strong>ON THIS PAGE</strong><a href="#before">Before you begin</a><a href="#steps">Instructions</a><a href="#problems">Common problems</a><a href="#sources">Sources</a><button onClick={selectAllGuides}>Browse all guides →</button></aside>
        </article> : <article className="library-page">
          <div className="library-intro"><span className="article-eyebrow">GUIDE LIBRARY</span><h1>All Guides</h1><p>Find the task you need, follow the steps, and use the official resource links when provided.</p><div className="reference-banner"><span>i</span><div><strong>Unit reference—not an official Army publication</strong><small>Always follow current Army guidance and local command policy.</small></div></div></div>
          <label className="library-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by task, system, or topic" aria-label="Search the guide library" />{query && <button onClick={() => setQuery("")} aria-label="Clear search">Clear</button>}</label>
          <div className="library-stats"><div><strong>{filtered.length}</strong><span>{query ? "matching guides" : "available guides"}</span></div><div><strong>{guides.filter((guide) => guide.status === "source-verified").length}</strong><span>source-verified guide</span></div><div><strong>No login</strong><span>no information stored</span></div></div>
          <div className="guide-groups">{sections.map((section) => {
            const children = filtered.filter((guide) => guide.section === section.id);
            if (!children.length) return null;
            return <section className="guide-group" key={section.id}><div className="group-heading"><span>{section.icon}</span><div><h2>{section.title}</h2><small>{children.length} {children.length === 1 ? "guide" : "guides"}</small></div></div><div className="guide-cards">{children.map((guide) => <button className="guide-card" key={guide.id} onClick={() => selectGuide(guide.id)}><div><span className={`status-pill card-status status-${guide.status}`}>{statusDetails[guide.status].short}</span><h3>{guide.title}</h3><p>{guide.summary}</p></div><footer><span>{guide.time}</span>{guide.updated !== "Pending" && <span>Checked {guide.updated}</span>}<b>Open guide →</b></footer></button>)}</div></section>;
          })}</div>
          {!filtered.length && <div className="empty-results"><strong>No guides match “{query}”</strong><p>Try a system name such as AVD, IPPS-A, DTS, PDF, or NCOER.</p><button onClick={() => setQuery("")}>Clear search</button></div>}
          <footer className="article-footer library-footer"><strong>B Co 2-485 Soldier Guide</strong><p>Administrative, digital-access, and readiness resources for Soldiers and leaders.</p><small>This site does not collect or store information.</small></footer>
        </article>}
    </section>
  </main>;
}
