import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

import { loadDashboard, loadFeedback, loadStudent } from "./api";

function TopicBarChart({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !data.length) {
      return;
    }

    const width = 420;
    const barHeight = 34;
    const height = data.length * barHeight + 28;
    const margin = { top: 8, right: 16, bottom: 8, left: 96 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const y = d3
      .scaleBand()
      .domain(data.map((item) => item.topic))
      .range([margin.top, height - margin.bottom])
      .padding(0.22);

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", (item) => y(item.topic))
      .attr("width", (item) => x(item.score) - margin.left)
      .attr("height", y.bandwidth())
      .attr("rx", 12)
      .attr("fill", "#2563eb");

    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", margin.left - 12)
      .attr("y", (item) => y(item.topic) + y.bandwidth() / 2 + 5)
      .attr("text-anchor", "end")
      .attr("fill", "#1f2937")
      .style("font-size", "12px")
      .style("font-family", "Inter, sans-serif")
      .text((item) => item.topic);

    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", (item) => x(item.score) - 8)
      .attr("y", (item) => y(item.topic) + y.bandwidth() / 2 + 5)
      .attr("text-anchor", "end")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .text((item) => `${item.score}%`);
  }, [data]);

  return <svg ref={ref} className="chart-svg" role="img" aria-label="Topic mastery chart" />;
}

function TrendChart({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !data.length) {
      return;
    }

    const width = 420;
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

  return <svg ref={ref} className="chart-svg" role="img" aria-label="Performance trend chart" />;
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("stu-001");

  useEffect(() => {
    loadDashboard(selectedStudentId).then(setDashboard);
  }, [selectedStudentId]);

  useEffect(() => {
    async function refreshStudent() {
      const [student, feedback] = await Promise.all([
        loadStudent(selectedStudentId),
        loadFeedback(selectedStudentId)
      ]);
      setDashboard((current) => {
        if (!current) {
          return current;
        }
        return { ...current, student, feedback };
      });
    }
    if (dashboard) {
      refreshStudent();
    }
  }, [selectedStudentId]);

  const overview = dashboard?.overview;
  const student = dashboard?.student;
  const feedback = dashboard?.feedback;
  const connectors = dashboard?.connectors ?? [];

  const kpis = useMemo(() => {
    if (!overview) {
      return [];
    }
    return [
      { label: "Learners monitored", value: overview.totalStudents },
      { label: "Average score", value: `${overview.averageScore}%` },
      { label: "High-risk learners", value: overview.highRiskStudents },
      { label: "Connected LMS", value: overview.connectorsOnline }
    ];
  }, [overview]);

  if (!dashboard || !overview || !student || !feedback) {
    return <main className="app-shell"><p>Loading approved microservices dashboard...</p></main>;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Approved major project architecture</p>
          <h1>Automated Learning Analytics and Personalized Feedback System for Mathematics Education</h1>
          <p className="lead">
            React 18 visualization frontend for a Flask microservices platform that ingests LMS
            learning events, processes mathematics performance data, and generates personalized
            feedback for students, instructors, and parents.
          </p>
          <div className="hero-links">
            <a href="../project-motive.html">Project Motive</a>
            <a href="../iot-architecture.html">System Architecture</a>
            <a href="https://github.com/deepanshu306/iot-ai-learning-analytics-math">GitHub Repository</a>
          </div>
        </div>
        <div className="hero-stack">
          <span>Python Flask</span>
          <span>Apache Kafka</span>
          <span>Apache Cassandra</span>
          <span>React 18</span>
          <span>D3.js</span>
          <span>Jupyter Notebook</span>
        </div>
      </section>

      <section className="kpi-grid">
        {kpis.map((item) => (
          <article key={item.label} className="kpi-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Microservices</p>
              <h2>System topology</h2>
            </div>
          </div>
          <div className="service-grid">
            {overview.serviceTopology.map((service) => (
              <article key={service.name} className="service-card">
                <h3>{service.name}</h3>
                <p className="service-stack">{service.stack}</p>
                <p>{service.purpose}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LMS integration</p>
              <h2>Connector status</h2>
            </div>
          </div>
          <div className="connector-list">
            {connectors.map((connector) => (
              <div key={connector.name} className="connector-row">
                <strong>{connector.name}</strong>
                <span className={`status-pill status-${connector.status}`}>{connector.status}</span>
                <small>{connector.syncFrequency}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">Learner analytics</p>
              <h2>Student drill-down</h2>
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
              <strong>{student.student.name}</strong>
              <p>Risk level: <span className={`risk risk-${student.riskLevel}`}>{student.riskLevel}</span></p>
            </div>
            <div>
              <span>Average score</span>
              <strong>{student.averageScore}%</strong>
            </div>
            <div>
              <span>Latest score</span>
              <strong>{student.latestScore}%</strong>
            </div>
            <div>
              <span>Avg time</span>
              <strong>{student.averageTimeMinutes} min</strong>
            </div>
          </div>
          <TopicBarChart data={student.topicMastery} />
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Real-time trend</p>
              <h2>Assessment performance timeline</h2>
            </div>
          </div>
          <TrendChart data={student.trend} />
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Personalized feedback</p>
              <h2>Student learning pathway</h2>
            </div>
          </div>
          <ul className="feedback-list">
            {feedback.studentFeedback.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="pathway">
            {student.recommendedPath.map((item) => (
              <span key={item} className="path-chip">{item}</span>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Stakeholder views</p>
              <h2>Instructor and parent guidance</h2>
            </div>
          </div>
          <div className="dual-lists">
            <div>
              <h3>Instructor feedback</h3>
              <ul className="feedback-list">
                {feedback.instructorFeedback.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Parent feedback</h3>
              <ul className="feedback-list">
                {feedback.parentFeedback.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
