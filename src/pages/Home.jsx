import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/courses/CourseCard";
import Loading from "../components/ui/Loading";

const goals = [
  { title: "Frontend Developer", icon: "💻", text: "Build websites and modern web apps." },
  { title: "UI/UX Designer", icon: "🎨", text: "Design accessible digital experiences." },
  { title: "Data Analyst", icon: "📊", text: "Turn data into useful insights." },
  { title: "Cyber Security", icon: "🔐", text: "Build safer digital products." }
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses().then((courses) => {
      setFeatured(courses.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">SMARTER LEARNING</span>
            <h1>Build skills that move your career forward.</h1>
            <p>Discover practical courses, follow a career roadmap and track your progress in one focused learning experience.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/courses">Explore courses</Link>
              <Link className="button button-secondary" to="/roadmap">View my roadmap</Link>
            </div>
          </div>
          <div className="hero-card" aria-label="Learning progress summary">
            <div className="hero-card-top"><span>Weekly learning goal</span><strong>72%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{width:"72%"}}></div></div>
            <div className="mini-stats">
              <div><strong>12</strong><span>Hours learned</span></div>
              <div><strong>4</strong><span>Courses active</span></div>
              <div><strong>8</strong><span>Skills earned</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">CHOOSE YOUR DIRECTION</span><h2>What do you want to become?</h2></div></div>
        <div className="goal-grid">
          {goals.map((goal) => (
            <Link className="goal-card" to="/roadmap" key={goal.title}>
              <span className="goal-icon">{goal.icon}</span>
              <div><h3>{goal.title}</h3><p>{goal.text}</p></div><span className="goal-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">START LEARNING</span><h2>Featured courses</h2></div>
            <Link to="/courses" className="text-link">View all courses →</Link>
          </div>
          {loading ? <Loading /> : <div className="course-grid">{featured.map((course) => <CourseCard key={course.id} course={course} />)}</div>}
        </div>
      </section>

      <section className="section container">
        <div className="feature-grid">
          <div className="feature-copy"><span className="eyebrow">WHY SKILLTRACK</span><h2>Learn with a destination, not just a course list.</h2><p>Follow a structured roadmap, celebrate achievements and turn completed lessons into real career momentum.</p></div>
          <div className="feature-list">
            <div><span>01</span><div><h3>Follow a roadmap</h3><p>Know what to learn next and why it matters.</p></div></div>
            <div><span>02</span><div><h3>Earn achievements</h3><p>Turn consistent learning into visible milestones.</p></div></div>
            <div><span>03</span><div><h3>Prove your skills</h3><p>Complete a quiz and unlock a course certificate.</p></div></div>
          </div>
        </div>
      </section>
    </>
  );
}