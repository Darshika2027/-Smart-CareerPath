import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";

function Icon({ name, size = 22 }) {
  const icons = {
    cap: <><path d="m2 10 10-5 10 5-10 5-10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /><path d="M22 10v6" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M2 12s3.5-7 10-7c2 0 3.8.7 5.3 1.7M22 12s-3.5 7-10 7c-2 0-3.8-.7-5.3-1.7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    spark: <path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.spark}
    </svg>
  );
}

function App() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email || !form.password || !form.confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !passwordRules.length ||
      !passwordRules.uppercase ||
      !passwordRules.number
    ) {
      setError("Please meet all password requirements.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: {
            display_name: fullName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message?.toLowerCase().includes("already registered")) {
          throw new Error("An account with this email already exists. Please sign in instead.");
        }
        throw signUpError;
      }

      if (!data.user) {
        throw new Error("Account creation failed. Please try again.");
      }

      if (data.user.identities?.length === 0) {
        throw new Error("An account with this email may already exist. Please use another email.");
      }

      if (data.session) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, display_name, role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError || !profile || profile.role !== "Student") {
          await supabase.auth.signOut();
          throw new Error(
            "Your account was created, but your student profile could not be verified. Please contact the administrator."
          );
        }

        setSuccess("Your student account has been created successfully!");
      } else {
        setSuccess(
          "Registration received! Please check your email and verify your email address to activate your student account."
        );
      }

      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="registration-page">
      <section className="welcome-panel">
        <div className="brand">
          <div className="brand-icon">
            <Icon name="cap" size={34} />
          </div>
          <div className="brand-name">
            <span>Smart</span>
            <strong>CareerPath</strong>
          </div>
        </div>

        <div className="brand-tagline">
          Learn <span>•</span> Improve <span>•</span> Grow
        </div>

        <div className="welcome-content">
          <div className="welcome-label">
            <Icon name="spark" size={16} />
            YOUR FUTURE STARTS HERE
          </div>

          <h1>
            Discover your
            <br />
            potential.
            <br />
            <span>Build your future.</span>
          </h1>

          <p className="welcome-description">
            Take the first step towards your dream career. Explore
            opportunities, improve your skills and prepare for exciting
            opportunities.
          </p>

          <div className="welcome-features">
            <div className="welcome-feature">
              <div className="feature-icon feature-blue">
                <Icon name="target" size={25} />
              </div>
              <div>
                <strong>Discover Career Paths</strong>
                <span>Explore opportunities that suit you.</span>
              </div>
            </div>

            <div className="welcome-feature">
              <div className="feature-icon feature-green">
                <Icon name="book" size={25} />
              </div>
              <div>
                <strong>Improve Your Skills</strong>
                <span>Build skills for your future career.</span>
              </div>
            </div>

            <div className="welcome-feature">
              <div className="feature-icon feature-purple">
                <Icon name="star" size={25} />
              </div>
              <div>
                <strong>Prepare for Internships</strong>
                <span>Get ready for your next opportunity.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="student-illustration">
          <div className="illustration-circle circle-one" />
          <div className="illustration-circle circle-two" />

          <img
            src="/student-pair.png"
            alt="Two students preparing for their future careers"
            className="student-pair-image"
          />
        </div>

<div className="welcome-footer">
          <span />
          YOUR JOURNEY. YOUR FUTURE
          <span />
        </div>
      </section>

      <section className="form-panel">
        <div className="form-decoration decoration-one" />
        <div className="form-decoration decoration-two" />

        <div className="form-container">
          <div className="form-heading">
            <div className="form-tag">
              <Icon name="user" size={19} />
              STUDENT REGISTRATION
            </div>

            <h2>
              Create your <span>account</span>
            </h2>

            <p>
              Join <strong>Smart CareerPath</strong> and take the next step
              towards your career.
            </p>
          </div>

          {error && (
            <div className="feedback feedback-error" role="alert">
              <strong>Registration unsuccessful</strong>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="feedback feedback-success" role="status">
              <strong>Registration information</strong>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Icon name="user" size={25} />
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Icon name="mail" size={25} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your university or personal email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Icon name="lock" size={25} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="visibility-button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={25} />
                </button>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Icon name="lock" size={25} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="visibility-button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  <Icon
                    name={showConfirmPassword ? "eyeOff" : "eye"}
                    size={25}
                  />
                </button>
              </div>
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <span className="field-error">
                    Passwords do not match.
                  </span>
                )}
            </div>

            <div className="password-rules">
              <div className={passwordRules.length ? "rule-valid" : ""}>
                <span className="rule-check">
                  <Icon name="check" size={13} />
                </span>
                8+ characters
              </div>
              <div className={passwordRules.uppercase ? "rule-valid" : ""}>
                <span className="rule-check">
                  <Icon name="check" size={13} />
                </span>
                Uppercase letter
              </div>
              <div className={passwordRules.number ? "rule-valid" : ""}>
                <span className="rule-check">
                  <Icon name="check" size={13} />
                </span>
                Number
              </div>
            </div>

            <button
              className="submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Student Account"}
              {!loading && <Icon name="arrow" size={23} />}
            </button>
          </form>

          <div className="form-security">
            <span className="security-line" />
            <Icon name="shield" size={21} />
            <span>Your information is securely protected</span>
            <span className="security-line" />
          </div>

          <p className="form-bottom">
            © 2026 Smart CareerPath. <strong>Learn • Improve • Grow</strong>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
