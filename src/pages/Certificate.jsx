import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Certificate() {
  const { user, enrolledCourses } = useContext(AppContext);
  const completed = enrolledCourses.find((course) => course.progress === 100);

  if (!completed) {
    return (
      <section className="section container empty-state">
        <span className="eyebrow">CERTIFICATE</span>
        <h1>Not unlocked yet.</h1>
        <p>Complete a course to unlock your SkillTrack certificate.</p>
        <Link className="button button-primary" to="/dashboard">Back to dashboard</Link>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="certificate-wrap">
        <div className="certificate">
          <div className="certificate-border">
            <span className="certificate-brand">SKILLTRACK</span>
            <span className="eyebrow">CERTIFICATE OF COMPLETION</span>
            <h1>{user.name}</h1>
            <p>has successfully completed</p>
            <h2>{completed.title}</h2>
            <p>Demonstrating commitment to continuous learning and professional development.</p>
            <div className="certificate-footer">
              <span>2026</span>
              <strong>✓ VERIFIED</strong>
            </div>
          </div>
        </div>
        <Link className="button button-secondary" to="/dashboard">Back to dashboard</Link>
      </div>
    </section>
  );
}