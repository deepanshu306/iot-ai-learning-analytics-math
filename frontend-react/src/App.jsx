import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  HashRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  createUser,
  fetchAdminDashboard,
  fetchDemoAccounts,
  fetchStudentDashboard,
  fetchSystemRuntime,
  fetchTeacherDashboard,
  ingestEvent,
  login,
  updateConnectorStatus
} from "./api";

const SESSION_KEY = "learning-analytics-role-session";

function readSession() {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function writeSession(session) {
  if (!session) {
    window.sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function TopicBarChart({ data, valueKey = "score", labelKey = "topic", color = "#2563eb", suffix = "%" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !data.length) {
      return;
    }

    const width = 460;
    const barHeight = 38;
    const height = data.length * barHeight + 28;
    const margin = { top: 8, right: 16, bottom: 8, left: 108 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const maxValue = Math.max(...data.map((item) => item[valueKey]), 1);
    const x = d3.scaleLinear().domain([0, maxValue]).range([margin.left, width - margin.right]);
    const y = d3
      .scaleBand()
      .domain(data.map((item) => item[labelKey]))
      .range([margin.top, height - margin.bottom])
      .padding(0.22);

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", (item) => y(item[labelKey]))
      .attr("width", (item) => x(item[valueKey]) - margin.left)
      .attr("height", y.bandwidth())
      .attr("rx", 12)
      .attr("fill", color);

    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", margin.left - 12)
      .attr("y", (item) => y(item[labelKey]) + y.bandwidth() / 2 + 5)
      .attr("text-anchor", "end")
      .attr("fill", "#1f2937")
      .style("font-size", "12px")
      .style("font-family", "Inter, sans-serif")
      .text((item) => item[labelKey]);

    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", (item) => x(item[valueKey]) - 8)
      .attr("y", (item) => y(item[labelKey]) + y.bandwidth() / 2 + 5)
      .attr("text-anchor", "end")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .text((item) => `${item[valueKey]}${suffix}`);
  }, [data, valueKey, labelKey, color, suffix]);

  return <svg ref={ref} className="chart-svg" role="img" aria-label="Bar chart" />;
}

function TrendChart({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !data.length) {
      return;
    }

    const width = 460;
    const height = 240;
    const margin = { top: 18, right: 20, bottom: 34, left: 42 };
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3
      .scalePoint()
      .domain(data.map((item) => item.label))
      .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((item) => x(item.label))
      .y((item) => y(item.score));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f97316")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (item) => x(item.label))
      .attr("cy", (item) => y(item.score))
      .attr("r", 5)
      .attr("fill", "#f97316");

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "11px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((value) => `${value}%`))
      .selectAll("text")
      .style("font-size", "11px");
  }, [data]);

  return <svg ref={ref} className="chart-svg" role="img" aria-label="Trend chart" />;
}

function StatusPill({ children, tone = "neutral" }) {
  return <span className={`status-pill tone-${tone}`}>{children}</span>;
}

function SourceChip({ source }) {
  const tone = source === "backend" ? "connected" : "pilot";
  return <StatusPill tone={tone}>Data source: {source}</StatusPill>;
}

function AppHeader({ session, onLogout }) {
  const location = useLocation();
  const links = useMemo(
    () => [
      { to: "/student", label: "Student", role: "student" },
      { to: "/teacher", label: "Teacher", role: "teacher" },
      { to: "/admin", label: "Admin", role: "admin" }
    ],
    []
  );

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Approved major project</p>
        <h1 className="app-title">Automated Learning Analytics and Personalized Feedback System for Mathematics Education</h1>
      </div>
      <div className="topbar-actions">
        <nav className="nav-links">
          {links
            .filter((item) => item.role === session.user.role)
            .map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                {item.label}
              </NavLink>
            ))}
          <a className="nav-link" href="../project-motive.html">Motive</a>
          <a className="nav-link" href="../iot-architecture.html">Architecture</a>
        </nav>
        <div className="identity-card">
          <strong>{session.user.name}</strong>
          <span>{session.user.role.toUpperCase()}</span>
          <small>{location.pathname}</small>
        </div>
        <button type="button" className="button-secondary" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

function MetricGrid({ items }) {
  return (
    <section className="kpi-grid">
      {items.map((item) => (
        <article key={item.label} className="kpi-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}

function ServiceGrid({ services }) {
  return (
    <div className="service-grid">
      {services.map((service) => (
        <article key={service.name} className="service-card">
          <h3>{service.name}</h3>
          <p className="service-stack">{service.stack}</p>
          <p>{service.purpose}</p>
          <StatusPill tone={service.status === "active" || service.mode === "dashboard" ? "connected" : "pilot"}>
            {service.mode}
          </StatusPill>
        </article>
      ))}
    </div>
  );
}

function ProtectedRoute({ session, role, children }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  if (session.user.role !== role) {
    return <Navigate to={`/${session.user.role}`} replace />;
  }
  return children;
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDemoAccounts().then(setDemoAccounts);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("Signing in...");
    const payload = await login(form.email, form.password);
    if (!payload) {
      setMessage("Invalid email or password.");
      return;
    }
    onLogin(payload);
    navigate(`/${payload.user.role}`, { replace: true });
  }

  return (
    <main className="app-shell">
      <section className="login-shell">
        <div className="hero hero-login">
          <div>
            <p className="eyebrow">Role-based access</p>
            <h1>Login to Student, Teacher, or Admin workspace.</h1>
            <p className="lead">
              This version includes role-based login, dedicated student, teacher, and admin pages,
              Flask service integration, and a clearly justified simulated Kafka and Cassandra
              workflow when backend services are unavailable.
            </p>
            <div className="hero-links">
              <a href="../project-motive.html">Project Motive</a>
              <a href="../iot-architecture.html">System Architecture</a>
              <a href="https://github.com/deepanshu306/iot-ai-learning-analytics-math">GitHub Repository</a>
            </div>
          </div>
          <div className="hero-stack">
            <span>Student feedback page</span>
            <span>Teacher analytics page</span>
            <span>Admin management page</span>
            <span>Flask services</span>
            <span>Kafka/Cassandra simulation</span>
          </div>
        </div>

        <section className="panel auth-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sign in</p>
              <h2>Role-based demo access</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>
            <button type="submit" className="button-primary">Enter workspace</button>
          </form>
          <p className="status-text">{message || "Use one of the seeded accounts below."}</p>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Demo accounts</p>
              <h2>Available seeded users</h2>
            </div>
          </div>
          <div className="card-grid">
            {demoAccounts.map((account) => (
              <article key={account.email} className="role-card">
                <div className="role-card-head">
                  <strong>{account.name}</strong>
                  <StatusPill tone={account.role === "admin" ? "critical" : account.role === "teacher" ? "connected" : "pilot"}>
                    {account.role}
                  </StatusPill>
                </div>
                <p>{account.email}</p>
                <p>Password: <code>{account.password}</code></p>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setForm({ email: account.email, password: account.password })}
                >
                  Use this account
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function StudentPage({ session, onLogout }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchStudentDashboard(session.user.studentId).then(setDashboard);
  }, [session.user.studentId]);

  if (!dashboard?.summary || !dashboard?.feedback) {
    return <main className="app-shell"><p>Loading student dashboard...</p></main>;
  }

  const summary = dashboard.summary;
  const feedback = dashboard.feedback;

  return (
    <main className="app-shell">
      <AppHeader session={session} onLogout={onLogout} />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Student personalized feedback page</p>
          <h2>Review topic mastery, recent activity, and next-step recommendations.</h2>
        </div>
        <SourceChip source={dashboard.source} />
      </section>

      <MetricGrid
        items={[
          { label: "Average score", value: `${summary.averageScore}%` },
          { label: "Latest score", value: `${summary.latestScore}%` },
          { label: "Average time", value: `${summary.averageTimeMinutes} min` },
          { label: "Completion rate", value: `${summary.completionRate}%` }
        ]}
      />

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Topic mastery</p>
              <h2>Mathematics chapter performance</h2>
            </div>
          </div>
          <TopicBarChart data={summary.topicMastery} />
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Performance trend</p>
              <h2>Assessment progression</h2>
            </div>
          </div>
          <TrendChart data={summary.trend} />
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Personalized feedback</p>
              <h2>Recommended learning path</h2>
            </div>
          </div>
          <ul className="feedback-list">
            {feedback.studentFeedback.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="pathway">
            {summary.recommendedPath.map((item) => (
              <span key={item} className="path-chip">{item}</span>
            ))}
          </div>
          <div className="meta-row">
            {summary.sources.map((source) => (
              <StatusPill key={source} tone="connected">{source}</StatusPill>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pipeline mode</p>
              <h2>Messaging and storage workflow</h2>
            </div>
          </div>
          <div className="stack-info">
            <article className="stack-card">
              <strong>{dashboard.pipeline.messaging.technology}</strong>
              <StatusPill tone={dashboard.pipeline.messaging.mode === "configured" ? "connected" : "pilot"}>
                {dashboard.pipeline.messaging.mode}
              </StatusPill>
              <p>{dashboard.pipeline.messaging.detail}</p>
            </article>
            <article className="stack-card">
              <strong>{dashboard.pipeline.storage.technology}</strong>
              <StatusPill tone={dashboard.pipeline.storage.mode === "configured" ? "connected" : "pilot"}>
                {dashboard.pipeline.storage.mode}
              </StatusPill>
              <p>{dashboard.pipeline.storage.detail}</p>
            </article>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recent activity</p>
            <h2>Learning events for {summary.student.name}</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Platform</th>
                <th>Topic</th>
                <th>Score</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentEvents.map((event) => (
                <tr key={event.eventId}>
                  <td>{event.timestamp.slice(0, 10)}</td>
                  <td>{event.platform}</td>
                  <td>{event.topic}</td>
                  <td>{event.scorePct}%</td>
                  <td>{event.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function TeacherPage({ session, onLogout }) {
  const [selectedStudentId, setSelectedStudentId] = useState("stu-001");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchTeacherDashboard(selectedStudentId).then(setDashboard);
  }, [selectedStudentId]);

  if (!dashboard?.overview || !dashboard?.selectedStudent || !dashboard?.selectedFeedback) {
    return <main className="app-shell"><p>Loading teacher dashboard...</p></main>;
  }

  const overview = dashboard.overview;
  const selectedStudent = dashboard.selectedStudent;

  return (
    <main className="app-shell">
      <AppHeader session={session} onLogout={onLogout} />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Teacher analytics page</p>
          <h2>Monitor class trends and drill into individual student performance.</h2>
        </div>
        <SourceChip source={dashboard.source} />
      </section>

      <MetricGrid
        items={[
          { label: "Total students", value: overview.totalStudents },
          { label: "Class average", value: `${overview.averageScore}%` },
          { label: "High-risk students", value: overview.highRiskStudents },
          { label: "Connected LMS", value: overview.connectorsOnline }
        ]}
      />

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Topic heatmap</p>
              <h2>Class-wide topic strength</h2>
            </div>
          </div>
          <TopicBarChart data={overview.topicHeatmap} />
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Risk distribution</p>
              <h2>Class segmentation</h2>
            </div>
          </div>
          <TopicBarChart data={overview.distribution} valueKey="count" labelKey="label" color="#f97316" suffix="" />
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">Student drill-down</p>
              <h2>Selected learner insight</h2>
            </div>
            <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
              {overview.studentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="student-summary">
            <div>
              <strong>{selectedStudent.student.name}</strong>
              <span>Risk level</span>
              <p className={`risk risk-${selectedStudent.riskLevel}`}>{selectedStudent.riskLevel}</p>
            </div>
            <div>
              <span>Average score</span>
              <strong>{selectedStudent.averageScore}%</strong>
            </div>
            <div>
              <span>Latest score</span>
              <strong>{selectedStudent.latestScore}%</strong>
            </div>
            <div>
              <span>Average time</span>
              <strong>{selectedStudent.averageTimeMinutes} min</strong>
            </div>
          </div>
          <ul className="feedback-list">
            {dashboard.selectedFeedback.instructorFeedback.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Connector health</p>
              <h2>LMS integration status</h2>
            </div>
          </div>
          <div className="connector-list">
            {dashboard.connectors.map((connector) => (
              <div key={connector.name} className="connector-row">
                <strong>{connector.name}</strong>
                <StatusPill tone={connector.status === "connected" ? "connected" : "pilot"}>
                  {connector.status}
                </StatusPill>
                <small>{connector.syncFrequency}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Student comparison</p>
            <h2>Class snapshot table</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Average score</th>
                <th>Latest score</th>
                <th>Risk level</th>
              </tr>
            </thead>
            <tbody>
              {overview.studentSnapshots.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.name}</td>
                  <td>{student.averageScore}%</td>
                  <td>{student.latestScore}%</td>
                  <td>{student.riskLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function AdminPage({ session, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [runtime, setRuntime] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    gradeLevel: "B.Tech Final Year",
    lmsUserId: ""
  });
  const [eventForm, setEventForm] = useState({
    studentId: "stu-001",
    platform: "Moodle",
    topic: "Algebra",
    subtopic: "Linear Equations",
    scorePct: 75,
    difficulty: "medium",
    timeSpentMin: 18,
    completionRate: 1,
    hintsUsed: 1,
    timestamp: new Date().toISOString()
  });

  async function refresh() {
    const [adminPayload, runtimePayload] = await Promise.all([fetchAdminDashboard(), fetchSystemRuntime()]);
    setDashboard(adminPayload);
    setRuntime(runtimePayload);
  }

  useEffect(() => {
    refresh();
  }, []);

  if (!dashboard?.counts || !runtime?.pipeline) {
    return <main className="app-shell"><p>Loading admin dashboard...</p></main>;
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    try {
      await createUser(userForm);
      setStatusMessage("User created successfully.");
      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "student",
        gradeLevel: "B.Tech Final Year",
        lmsUserId: ""
      });
      await refresh();
    } catch (error) {
      setStatusMessage(`Unable to create user: ${error.message}`);
    }
  }

  async function handleConnectorUpdate(name, status) {
    await updateConnectorStatus(name, {
      status,
      lastSync: new Date().toISOString()
    });
    setStatusMessage(`Connector ${name} updated to ${status}.`);
    await refresh();
  }

  async function handleIngestEvent(event) {
    event.preventDefault();
    await ingestEvent(eventForm);
    setStatusMessage("Learning event ingested through the current pipeline mode.");
    setEventForm((current) => ({
      ...current,
      timestamp: new Date().toISOString()
    }));
    await refresh();
  }

  return (
    <main className="app-shell">
      <AppHeader session={session} onLogout={onLogout} />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Admin management page</p>
          <h2>Manage users, connectors, and simulated learning-event ingestion.</h2>
        </div>
        <SourceChip source={dashboard.source} />
      </section>

      <MetricGrid
        items={[
          { label: "Total users", value: dashboard.counts.users },
          { label: "Students", value: dashboard.counts.students },
          { label: "Teachers", value: dashboard.counts.teachers },
          { label: "Events tracked", value: dashboard.counts.events }
        ]}
      />

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Runtime modes</p>
              <h2>Kafka and Cassandra implementation state</h2>
            </div>
          </div>
          <div className="stack-info">
            <article className="stack-card">
              <strong>{runtime.pipeline.messaging.technology}</strong>
              <StatusPill tone={runtime.pipeline.messaging.mode === "configured" ? "connected" : "pilot"}>
                {runtime.pipeline.messaging.mode}
              </StatusPill>
              <p>{runtime.pipeline.messaging.detail}</p>
            </article>
            <article className="stack-card">
              <strong>{runtime.pipeline.storage.technology}</strong>
              <StatusPill tone={runtime.pipeline.storage.mode === "configured" ? "connected" : "pilot"}>
                {runtime.pipeline.storage.mode}
              </StatusPill>
              <p>{runtime.pipeline.storage.detail}</p>
            </article>
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Service topology</p>
              <h2>Current implementation services</h2>
            </div>
          </div>
          <ServiceGrid services={runtime.services} />
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Create user</p>
              <h2>Add a runtime account</h2>
            </div>
          </div>
          <form className="form-grid compact" onSubmit={handleCreateUser}>
            <label>
              <span>Name</span>
              <input value={userForm.name} onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={userForm.email} onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} required />
            </label>
            <label>
              <span>Password</span>
              <input value={userForm.password} onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))} required />
            </label>
            <label>
              <span>Role</span>
              <select value={userForm.role} onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            {userForm.role === "student" ? (
              <>
                <label>
                  <span>Grade level</span>
                  <input value={userForm.gradeLevel} onChange={(event) => setUserForm((current) => ({ ...current, gradeLevel: event.target.value }))} />
                </label>
                <label>
                  <span>LMS user ID</span>
                  <input value={userForm.lmsUserId} onChange={(event) => setUserForm((current) => ({ ...current, lmsUserId: event.target.value }))} />
                </label>
              </>
            ) : null}
            <button type="submit" className="button-primary">Create user</button>
          </form>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Simulate event</p>
              <h2>Send a learning event through the collector</h2>
            </div>
          </div>
          <form className="form-grid compact" onSubmit={handleIngestEvent}>
            <label>
              <span>Student</span>
              <select value={eventForm.studentId} onChange={(event) => setEventForm((current) => ({ ...current, studentId: event.target.value }))}>
                {dashboard.users
                  .filter((user) => user.role === "student" && user.studentId)
                  .map((user) => (
                    <option key={user.id} value={user.studentId}>{user.name}</option>
                  ))}
              </select>
            </label>
            <label>
              <span>Platform</span>
              <input value={eventForm.platform} onChange={(event) => setEventForm((current) => ({ ...current, platform: event.target.value }))} />
            </label>
            <label>
              <span>Topic</span>
              <input value={eventForm.topic} onChange={(event) => setEventForm((current) => ({ ...current, topic: event.target.value }))} />
            </label>
            <label>
              <span>Subtopic</span>
              <input value={eventForm.subtopic} onChange={(event) => setEventForm((current) => ({ ...current, subtopic: event.target.value }))} />
            </label>
            <label>
              <span>Score %</span>
              <input type="number" min="0" max="100" value={eventForm.scorePct} onChange={(event) => setEventForm((current) => ({ ...current, scorePct: event.target.value }))} />
            </label>
            <label>
              <span>Difficulty</span>
              <select value={eventForm.difficulty} onChange={(event) => setEventForm((current) => ({ ...current, difficulty: event.target.value }))}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label>
              <span>Time spent (min)</span>
              <input type="number" min="1" value={eventForm.timeSpentMin} onChange={(event) => setEventForm((current) => ({ ...current, timeSpentMin: event.target.value }))} />
            </label>
            <label>
              <span>Completion rate</span>
              <input type="number" min="0" max="1" step="0.1" value={eventForm.completionRate} onChange={(event) => setEventForm((current) => ({ ...current, completionRate: event.target.value }))} />
            </label>
            <label>
              <span>Hints used</span>
              <input type="number" min="0" value={eventForm.hintsUsed} onChange={(event) => setEventForm((current) => ({ ...current, hintsUsed: event.target.value }))} />
            </label>
            <button type="submit" className="button-primary">Ingest event</button>
          </form>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Connector controls</p>
            <h2>Update LMS connector status</h2>
          </div>
        </div>
        <div className="connector-list">
          {dashboard.connectors.map((connector) => (
            <div key={connector.name} className="connector-row admin-row">
              <div>
                <strong>{connector.name}</strong>
                <small>{connector.syncFrequency}</small>
              </div>
              <StatusPill tone={connector.status === "connected" ? "connected" : "pilot"}>
                {connector.status}
              </StatusPill>
              <div className="inline-actions">
                <button type="button" className="button-secondary" onClick={() => handleConnectorUpdate(connector.name, "connected")}>
                  Set connected
                </button>
                <button type="button" className="button-secondary" onClick={() => handleConnectorUpdate(connector.name, "pilot")}>
                  Set pilot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Runtime users</p>
              <h2>Accounts available in the system</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent events</p>
              <h2>Latest ingested learning activity</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Topic</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentEvents.map((event) => (
                  <tr key={event.eventId}>
                    <td>{event.timestamp.slice(0, 10)}</td>
                    <td>{event.studentId}</td>
                    <td>{event.topic}</td>
                    <td>{event.scorePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <p className="status-text">{statusMessage}</p>
    </main>
  );
}

function RoleRouter() {
  const navigate = useNavigate();
  const [session, setSession] = useState(readSession);

  function handleLogin(payload) {
    setSession(payload);
    writeSession(payload);
  }

  function handleLogout() {
    setSession(null);
    writeSession(null);
    navigate("/login", { replace: true });
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={session ? `/${session.user.role}` : "/login"} replace />} />
      <Route path="/login" element={session ? <Navigate to={`/${session.user.role}`} replace /> : <LoginPage onLogin={handleLogin} />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute session={session} role="student">
            <StudentPage session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute session={session} role="teacher">
            <TeacherPage session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute session={session} role="admin">
            <AdminPage session={session} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <RoleRouter />
    </HashRouter>
  );
}
