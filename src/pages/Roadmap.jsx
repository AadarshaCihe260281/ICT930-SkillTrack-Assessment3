import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const roadmap = [
  { id: 1, title: "HTML & CSS Foundations", courseId: 1, icon: "01", description: "Build semantic, responsive interfaces.", skill: "Web foundations" },
  { id: 2, title: "JavaScript Core", courseId: 6, icon: "02", description: "Master modern JavaScript concepts.", skill: "Programming" },
  { id: 3, title: "React Fundamentals", courseId: 2, icon: "03", description: "Build component-based applications.", skill: "Frontend framework" },
  { id: 4, title: "UI/UX Essentials", courseId: 3, icon: "04", description: "Design accessible and usable products.", skill: "Product design" },
  { id: 5, title: "Portfolio Project", courseId: null, icon: "05", description: "Combine your skills into a showcase project.", skill: "Career ready" }
];

export default function Roadmap() {
  const { enrolledCourses, isEnrolled } = useContext(AppContext);

  const getProgress = (courseId) => {
    if (!courseId) return enrolledCourses.length >= 2 ? 25 : 0;
    return enrolledCourses.find((course) => course.id === courseId)?.progress ?? 0;
  };

  const overall = Math.round(
    roadmap.reduce((sum, item) => sum + getProgress(item.courseId), 0) / roadmap.length
  );

  return (
    <section className="section container">
      <div className="page-heading">
        <span className="eyebrow">CAREER JOURNEY</span>
        <h1>Your Frontend Developer roadmap.</h1>
        <p>Follow a practical path from web foundations to a portfolio-ready project.</p>
      </div>

      <div className="roadmap-summary">
        <div>
          <span className="eyebrow">OVERALL ROADMAP</span>
          <h2>{overall}% complete</h2>
          <p>Complete courses to unlock the next stage.</p>
        </div>
        <div className="roadmap-progress">
          <div className="progress-track"><div className="progress-fill" style={{ width: `${overall}%` }} /></div>
          <span>{roadmap.filter((item) => getProgress(item.courseId) === 100).length} of {roadmap.length} stages complete</span>
        </div>
      </div>

      <div className="roadmap">
        {roadmap.map((item, index) => {
          const progress = getProgress(item.courseId);
          const locked = index > 0 && getProgress(roadmap[index - 1].courseId) < 100;
          const completed = progress === 100;

          return (
            <div className={`roadmap-item ${completed ? "completed" : ""} ${locked ? "locked" : ""}`} key={item.id}>
              <div className="roadmap-marker">{completed ? "✓" : item.icon}</div>
              <div className="roadmap-line" />
              <div className="roadmap-card">
                <div className="tag-row">
                  <span className="tag">{item.skill}</span>
                  {locked && <span className="tag tag-muted">Locked</span>}
                  {completed && <span className="tag">Completed</span>}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.courseId ? (
                  <div className="roadmap-card-bottom">
                    <div className="progress-wrap">
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                      <span>{progress}%</span>
                    </div>
                    {!locked && <Link className="button button-secondary" to={`/courses/${item.courseId}`}>Open course</Link>}
                  </div>
                ) : (
                  <p className="roadmap-note">Portfolio milestone unlocks as you build your learning foundation.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}