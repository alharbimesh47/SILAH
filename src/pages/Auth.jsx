import { useState } from "react";
import { api } from "../utils/api";

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", role: "member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingMsg, setPendingMsg] = useState("");

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await api.post("/auth/login", loginData);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    onAuthSuccess(res.data);
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    setError("");

    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await api.post("/auth/signup", signupData);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    // Show pending message instead of logging in
    setPendingMsg("Account created! Please wait for admin approval before logging in.");
    setMode("login");
  }

  if (pendingMsg) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">SILAH</div>
          <h1 className="auth-title">Account Pending</h1>
          <p className="auth-subtitle">{pendingMsg}</p>
          <button className="auth-submit-btn" onClick={() => setPendingMsg("")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">SILAH</div>
        <h1 className="auth-title">Family Portal Access</h1>
        <p className="auth-subtitle">
          {mode === "login" ? "Log in to access your family portal" : "Create a new account to join the family portal"}
        </p>

        <div className="auth-toggle">
          <button type="button" className={mode === "login" ? "auth-tab active-auth-tab" : "auth-tab"}
            onClick={() => { setMode("login"); setError(""); }}>Log In</button>
          <button type="button" className={mode === "signup" ? "auth-tab active-auth-tab" : "auth-tab"}
            onClick={() => { setMode("signup"); setError(""); }}>Sign Up</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}