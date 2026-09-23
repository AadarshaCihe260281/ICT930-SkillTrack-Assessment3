import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProgressBar from "../components/ui/ProgressBar";

const activity = [40, 65, 30, 80, 55, 70, 45];

export default function Dashboard() {
  const { user, enrolledCourses } = useContext(AppContext);
  const completedCourses = enrolledCourses.filter((course) => course.progress === 100).length;
  const overall = enrolledCourses.length ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) : 0;
  const completedLessons = enrolledCourses.reduce((sum, course) => sum + course.completedLessons.length, 0);
  const unlockedBadges = [
    enrolledCourses.some((c) => c.completedLessons.length > 0),
    completedCourses > 0,
    enrolledCourses.length >= 3,
    completedLessons >= 5
  ].filter(Boolean).length;

  return (
    <section className="section container">
      <div className="page-heading">
        <span className="eyebrow">MY LEARNING</span>
        <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
        <p>Keep building momentum and turn your learning goals into progress.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><span>Courses enrolled</span><strong>{enrolledCourses.length}</strong></div>
        <div className="stat-card"><span>Lessons completed</span><strong>{completedLessons}</strong></div>
        <div className="stat-card"><span>Overall progress</span><strong>{overall}%</strong></div>
      </div>

      <div className="dashboard-insights">
        <div className="insight-card">
          <div className="section-heading compact"><div><span className="eyebrow">WEEKLY ACTIVITY</span><h2>Keep your streak alive 🔥</h2></div><strong className="streak-number">7 days</strong></div>
          <div className="activity-chart" aria-label="Weekly learning activity">
            {activity.map((value, index) => <div className="activity-column" key={index}><div className="activity-bar" style={{ height: `${value}%` }} /><span>{["M","T","W","T","F","S","S"][index]}</span></div>)}
          </div>
        </div>
        <div className="insight-card achievement-mini">
          <span className="eyebrow">ACHIEVEMENTS</span>
          <div className="achievement-mini-row"><span className="mini-badge">🏆</span><div><strong>{unlockedBadges} badges unlocked</strong><p>Complete lessons and courses to earn more.</p></div></div>
          <Link className="text-link" to="/achievements">View achievements →</Link>
        </div>
      </div>

      <div className="dashboard-insights second-row">
        <div className="insight-card roadmap-mini">
          <span className="eyebrow">CAREER ROADMAP</span>
          <h2>Frontend Developer</h2>
          <ProgressBar progress={overall} />
          <p>Your learning path is {overall}% complete.</p>
          <Link className="button button-secondary" to="/roadmap">Open roadmap</Link>
        </div>
        <div className="insight-card">
          <span className="eyebrow">KNOWLEDGE CHECK</span>
          <h2>Ready for a quick challenge?</h2>
          <p>Test your frontend fundamentals with a five-question quiz.</p>
          <Link className="button button-primary" to="/quiz">Take the quiz</Link>
        </div>
      </div>

      <div className="section-heading dashboard-heading">
        <div><span className="eyebrow">YOUR COURSES</span><h2>Continue learning</h2></div>
        <Link to="/courses" className="text-link">Browse more →</Link>
      </div>

      {!enrolledCourses.length ? (
        <div className="empty-state"><h2>Your learning journey starts here.</h2><p>Enrol in a course to see your progress on this dashboard.</p><Link className="button button-primary" to="/courses">Explore courses</Link></div>
      ) : (
        <div className="dashboard-courses">
          {enrolledCourses.map((course) => (
            <article className="dashboard-course" key={course.id}>
              <img src={course.image} alt="" />
              <div className="dashboard-course-content">
                <div className="tag-row"><span className="tag">{course.category}</span><span>{course.difficulty}</span></div>
                <h3>{course.title}</h3>
                <p>{course.completedLessons.length} of {course.lessons.length} lessons completed</p>
                <ProgressBar progress={course.progress} />
                <Link className="button button-secondary" to={`/courses/${course.id}`}>{course.progress === 100 ? "Review course" : "Continue learning"}</Link>
                {course.progress === 100 && <Link className="certificate-link" to="/certificate">View certificate →</Link>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}