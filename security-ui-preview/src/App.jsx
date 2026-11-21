import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Code2,
  Database,
  FileCheck2,
  FileText,
  GraduationCap,
  Home,
  KeyRound,
  LayoutDashboard,
  Lock,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  MonitorCheck,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import studentPhoto from "./assets/security-student.jpg";
import heroArt from "./assets/security-hero.jpg";

// IMPORTANT: The screenshot numbers and green states are SAMPLE UI DATA ONLY.
// This frontend does NOT validate Supabase Auth, RLS, sessions or any NFR.
const PREVIEW_STATS = [
  {
    label: "Authenticated Users",
    value: "128",
    note: "+12%",
    tone: "blue",
    icon: UsersRound,
    fill: 78,
  },
  {
    label: "Protected Records",
    value: "4,560",
    note: "",
    tone: "green",
    icon: ShieldCheck,
    fill: 89,
  },
  {
    label: "Security Tests",
    value: "17 / 17",
    note: "",
    tone: "purple",
    icon: Database,
    fill: 86,
  },
  {
    label: "System Security",
    value: "Healthy",
    note: "",
    tone: "amber",
    icon: LockKeyhole,
    fill: null,
  },
];

const NAVIGATION = [
  { label: "Dashboard", icon: Home },
  { label: "My Profile & Skills", icon: UserRound },
  { label: "Career Path", icon: BriefcaseBusiness },
  { label: "Internships", icon: LayoutDashboard },
  { label: "Skill Matching", icon: Target },
  { label: "Learning Resources", icon: BookOpen },
  { label: "Roadmap", icon: MapPin },
  { label: "Security & Access", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

const SECURITY_PANELS = [
  {
    title: "Authentication",
    icon: LockKeyhole,
    rows: [
      { label: "Supabase Authentication", status: "Active" },
      { label: "Secure Login & Registration", status: "Active" },
      { label: "Session Management", status: "Active" },
      { label: "Protected Routes", status: "Active" },
    ],
  },
  {
    title: "Student Data Protection",
    icon: Database,
    rows: [
      { label: "Row Level Security (RLS)", status: "Enabled" },
      { label: "Profile Data Isolation", status: "Enabled" },
      { label: "Skills Data Access Control", status: "Enabled" },
      { label: "Career Goal Data Control", status: "Enabled" },
    ],
  },
  {
    title: "Role & Access",
    icon: UsersRound,
    rows: [
      { label: "Student Role (Default)", status: "Enforced" },
      { label: "Administrator Role (Restricted)", status: "Protected" },
      { label: "Role Escalation Prevention", status: "Active" },
      { label: "Unauthorized Access Blocking", status: "Active" },
    ],
  },
];

const VERIFICATIONS = [
  {
    id: "NT-01",
    label: "Authentication Security",
    detail: "Check protected routes and requests.",
  },
  {
    id: "NT-02",
    label: "Data Access Control (RLS)",
    detail: "Verify isolation between different student accounts.",
  },
  {
    id: "NT-04",
    label: "Secure Credentials & HTTPS",
    detail: "Review credential handling and transport security.",
  },
  {
    id: "NT-05",
    label: "Secret Configuration",
    detail: "Confirm privileged keys are absent from the frontend.",
  },
];

const MODAL_TEXT = {
  Authentication: {
    lead: "This section describes the authentication controls planned under SCP-25.",
    items: [
      "Use Supabase Auth for registration, login and logout.",
      "Require a valid session for protected application routes.",
      "Handle expired or invalid sessions safely.",
      "Do not store passwords in custom frontend or database fields.",
    ],
  },
  "Student Data Protection": {
    lead: "Actual student privacy must be enforced by Supabase Row Level Security (RLS).",
    items: [
      "Student A must not read or edit Student B’s profile.",
      "Apply ownership policies to student skills and career goals.",
      "Test database requests directly—not just hidden UI buttons.",
      "Keep historical roadmap progress private to its owner.",
    ],
  },
  "Role & Access": {
    lead: "A secure role is assigned and verified by trusted services, not by editable frontend fields.",
    items: [
      "New public accounts must receive only the Student role.",
      "Students must not be able to elevate their own role.",
      "Implement Administrator authorization in the shared SCP-26 security layer.",
      "Never trust a React-only check to protect privileged data.",
    ],
  },
  "Security Verification": {
    lead: "The results shown in the visual preview are placeholders—not executed security tests.",
    items: VERIFICATIONS.map((test) => `${test.id}: ${test.detail}`),
  },
  "Manage Access Policies": {
    lead: "Access policies cannot be changed safely from this student-facing demo page.",
    items: [
      "Implement and review policies in Supabase using authorized tools.",
      "Keep database changes in reviewed SQL migrations or your team’s approved process.",
      "Test with at least two different student accounts.",
      "Never place a service-role secret in React frontend code.",
    ],
  },
  "View Security Test Results": {
    lead: "Connect real test evidence before displaying a Passed result in production.",
    items: VERIFICATIONS.map(
      (test) =>
        `${test.id} — ${test.label}: Not executed in this UI-only demo.`,
    ),
  },
  "Review Access Logs": {
    lead: "This frontend preview does not collect or display real access logs.",
    items: [
      "Use the approved Supabase dashboard or trusted backend for logging.",
      "Avoid logging passwords, access tokens or other secrets.",
      "Restrict security logs to authorized personnel.",
    ],
  },
  "Security Settings": {
    lead: "Only visual settings are available in this frontend preview.",
    items: [
      "Authentication and RLS configuration belong in the Supabase project.",
      "Protected routes must also check the current authenticated session.",
      "Actual Administrator configuration requires trusted role-based authorization.",
    ],
  },
};

function StatusPill({ children }) {
  return <span className="status-pill">{children}</span>;
}

function SectionTitle({ icon: Icon, title, onClick }) {
  return (
    <div className="section-heading">
      <div className="section-name">
        <Icon size={24} strokeWidth={2.5} aria-hidden="true" />
        <h2>{title}</h2>
      </div>
      <button type="button" className="text-action" onClick={onClick}>
        View Details <ArrowRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

function SecurityPanel({ panel, onDetails }) {
  return (
    <section className="panel security-panel">
      <SectionTitle
        icon={panel.icon}
        title={panel.title}
        onClick={() => onDetails(panel.title)}
      />
      <div className="control-list">
        {panel.rows.map((row) => (
          <div className="control-row" key={row.label}>
            <CheckCircle2
              className="control-check"
              size={20}
              fill="currentColor"
              aria-hidden="true"
            />
            <span className="control-label">{row.label}</span>
            <StatusPill>{row.status}</StatusPill>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className="stat-card">
      <div className={`stat-icon ${stat.tone}`}>
        <Icon size={29} strokeWidth={2.4} aria-hidden="true" />
      </div>
      <div className="stat-info">
        <div className="stat-name">{stat.label}</div>
        {stat.label === "System Security" ? (
          <div className="health-value">
            <CheckCircle2 size={17} fill="currentColor" aria-hidden="true" />{" "}
            {stat.value}
          </div>
        ) : (
          <div className="stat-value-row">
            <strong>{stat.value}</strong>
            {stat.note && <span className="stat-rise">↑ {stat.note}</span>}
          </div>
        )}
        {stat.fill != null && (
          <div className="stat-progress" aria-hidden="true">
            <span
              className={`bar ${stat.tone}`}
              style={{ width: `${stat.fill}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="brand">
      <GraduationCap size={48} strokeWidth={1.8} aria-hidden="true" />
      <div className="brand-text">
        <strong>
          Smart
          <br />
          CareerPath
        </strong>
        <span>Learn · Improve · Grow</span>
      </div>
    </div>
  );
}

function Modal({ modal, onClose }) {
  useEffect(() => {
    if (!modal) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, onClose]);

  if (!modal) return null;
  const info = MODAL_TEXT[modal] ?? {
    lead: "This is a single-page UI preview for the SCP-25 Security & Access feature.",
    items: [
      `The ${modal} page belongs to another Smart CareerPath feature.`,
      "Connect this navigation item to the relevant page when the team integrates modules.",
      "Do not treat this demo as a real authenticated user session.",
    ],
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        <div className="modal-top">
          <div>
            <span className="eyebrow">SMART CAREERPATH · UI PREVIEW</span>
            <h2 id="modal-heading">{modal}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        <p className="modal-lead">{info.lead}</p>
        <ul className="modal-list">
          {info.items.map((item, index) => (
            <li key={index}>
              <Check size={17} aria-hidden="true" /> <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="modal-foot">
          <span>
            <ShieldAlert size={15} aria-hidden="true" /> Sample UI only — no
            live data
          </span>
          <button type="button" className="primary-small" onClick={onClose}>
            Got it
          </button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [modal, setModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const searchResults = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    if (!query) return [];
    return [
      "Authentication",
      "Student Data Protection",
      "Role & Access",
      "Security Verification",
      "Manage Access Policies",
      "Security Settings",
    ]
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 6);
  }, [searchText]);

  const openInfo = (name) => {
    setModal(name);
    setMobileMenuOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  return (
    <div className="app-shell">
      <button
        type="button"
        aria-label="Close mobile sidebar"
        className={`mobile-scrim ${mobileMenuOpen ? "visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <Brand />
        <nav className="main-navigation">
          {NAVIGATION.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`nav-item ${label === "Security & Access" ? "active" : ""}`}
              aria-current={label === "Security & Access" ? "page" : undefined}
              onClick={() =>
                label === "Security & Access"
                  ? setMobileMenuOpen(false)
                  : openInfo(label)
              }
            >
              <Icon
                size={23}
                strokeWidth={label === "Security & Access" ? 2.7 : 2.35}
                aria-hidden="true"
              />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            type="button"
            className="logout-button"
            onClick={() => openInfo("Logout")}
          >
            <LogOut size={23} aria-hidden="true" /> Logout
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button
            type="button"
            className="hamburger"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={26} />
          </button>
          <div className="search-wrap">
            <Search size={24} strokeWidth={2.1} aria-hidden="true" />
            <input
              aria-label="Search dashboard panels"
              type="search"
              placeholder="Search internships, skills, or resources..."
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
            />
            {searchOpen && searchText.trim() && (
              <div
                className="search-results"
                role="listbox"
                aria-label="Dashboard search results"
              >
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected="false"
                      key={result}
                      onClick={() => {
                        setSearchText("");
                        openInfo(result);
                      }}
                    >
                      <Search size={15} aria-hidden="true" />
                      {result}
                    </button>
                  ))
                ) : (
                  <div className="no-results">
                    No security panels match “{searchText}”. Other pages are not
                    connected yet.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="header-right">
            <span
              className="preview-label"
              title="Numbers and statuses are sample data"
            >
              DEMO PREVIEW
            </span>
            <div className="pop-anchor">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                className="notification-button"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell size={26} />
                <span className="notification-count">2</span>
              </button>
              {notificationOpen && (
                <div className="header-popover notification-popover">
                  <strong>Notifications</strong>
                  <p>
                    These are example notifications for the UI preview. Live
                    notifications are not connected.
                  </p>
                  <button
                    type="button"
                    onClick={() => openInfo("Notifications")}
                  >
                    View demo details
                  </button>
                </div>
              )}
            </div>
            <div className="pop-anchor">
              <button
                type="button"
                className="user-profile"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
              >
                <img src={studentPhoto} alt="Example student avatar" />
                <span>
                  <strong>Sanduni Nawanjana</strong>
                  <small>IT Undergraduate</small>
                </span>
                <ChevronDown size={18} />
              </button>
              {profileOpen && (
                <div className="header-popover profile-popover">
                  <strong>Example account</strong>
                  <p>Preview user — not connected to Supabase Auth.</p>
                  <button
                    type="button"
                    onClick={() => openInfo("My Profile & Skills")}
                  >
                    Profile preview
                  </button>
                  <button type="button" onClick={() => openInfo("Logout")}>
                    Logout demo info
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <section
            className="hero-banner"
            aria-label="Security and Access overview"
          >
            <div className="hero-copy">
              <div className="hero-heading">
                <ShieldCheck
                  className="hero-shield"
                  size={53}
                  fill="currentColor"
                  strokeWidth={2.1}
                  aria-hidden="true"
                />
                <h1>Security &amp; Access</h1>
              </div>
              <p>
                Authentication, access control and student data protection
                <br className="desktop-break" /> for a safe and trusted learning
                experience.
              </p>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <img src={heroArt} alt="" />
            </div>
          </section>

          <div className="preview-alert" role="note">
            <ShieldAlert size={17} aria-hidden="true" />
            <span>
              <strong>UI demonstration:</strong> All counts, statuses and test
              results below are example data. Real security requires Supabase
              Authentication, database RLS and executed tests.
            </span>
          </div>

          <section className="stats-grid" aria-label="Example security metrics">
            {PREVIEW_STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </section>

          <div className="details-grid">
            {SECURITY_PANELS.map((panel) => (
              <SecurityPanel
                key={panel.title}
                panel={panel}
                onDetails={openInfo}
              />
            ))}
          </div>

          <div className="bottom-grid">
            <section className="panel verification-panel">
              <SectionTitle
                icon={ShieldCheck}
                title="Security Verification"
                onClick={() => openInfo("Security Verification")}
              />
              <div className="verification-body">
                <div className="donut-wrap">
                  <div className="donut">
                    <div className="donut-center">
                      <strong>100%</strong>
                      <span>Sample Tests Passed</span>
                    </div>
                  </div>
                </div>
                <div className="verification-list">
                  {VERIFICATIONS.map(({ id, label }) => (
                    <div key={id} className="verification-row">
                      <CheckCircle2
                        size={19}
                        className="control-check"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <span>
                        {id}: {label}
                      </span>
                      <StatusPill>Sample</StatusPill>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="panel quick-panel">
              <div className="section-heading">
                <div className="section-name">
                  <Zap size={25} fill="currentColor" aria-hidden="true" />
                  <h2>Quick Actions</h2>
                </div>
              </div>
              <div className="quick-grid">
                <button
                  type="button"
                  className="quick-action navy"
                  onClick={() => openInfo("Manage Access Policies")}
                >
                  <KeyRound size={33} aria-hidden="true" />
                  <span>
                    Manage Access
                    <br />
                    Policies
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="quick-action emerald"
                  onClick={() => openInfo("View Security Test Results")}
                >
                  <ShieldCheck size={33} aria-hidden="true" />
                  <span>
                    View Security
                    <br />
                    Test Results
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="quick-action violet"
                  onClick={() => openInfo("Review Access Logs")}
                >
                  <FileText size={33} aria-hidden="true" />
                  <span>
                    Review Access
                    <br />
                    Logs
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="quick-action yellow"
                  onClick={() => openInfo("Security Settings")}
                >
                  <Settings size={33} aria-hidden="true" />
                  <span>Security Settings</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </section>
          </div>
          <footer className="dashboard-footer">
            Smart CareerPath · SCP-25 Security &amp; Access UI Concept ·
            Frontend demonstration only
          </footer>
        </main>
      </div>
      <Modal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

export default App;
