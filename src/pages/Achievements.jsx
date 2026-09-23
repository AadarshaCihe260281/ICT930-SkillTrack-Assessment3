import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const badges = [
  { id: "first", icon: "🌱", title: "First Step", description: "Complete your first lesson.", condition: (courses) => courses.some((c) => c.completedLessons.length > 0) },
  { id: "finisher", icon: "🏆", title: "Course Finisher", description: "Complete an entire course.", condition: (courses) => courses.some((c) => c.progress === 100) },
  { id: "explorer", icon: "🧭", title: "Explorer", description: "Enrol in three courses.", condition: (courses) => courses.length >= 3 },
  { id: "skill", icon: "⚡", title: "Skill Builder", description: "Complete five lessons.", condition: (courses) => courses.reduce((sum, c) => sum + c.completedLessons.length, 0) >= 5 },
  { id: "master", icon: "💎", title: "Skill Master", description: "Complete two courses.", condition: (courses) => courses.filter((c) => c.progress === 100).length >= 2 },
  { id: "journey", icon: "🚀", title: "Career Journey", description: "Reach 50% overall roadmap progress.", condition: (courses) => courses.length > 0 && courses.reduce((sum, c) => sum + c.progress, 0) / courses.length >= 50 }
];

export default function Achievements() {
  const { enrolledCourses } = useContext(AppContext);
  const unlocked = badges.filter((badge) => badge.condition(enrolledCourses)).length;

  return (
    <section className="section container">
      <div className="page-heading">
        <span className="eyebrow">ACHIEVEMENTS</span>
        <h1>Celebrate your progress.</h1>
        <p>Small wins add up. Complete learning milestones to unlock badges.</p>
      </div>

      <div className="achievement-summary">
        <div className="achievement-trophy">🏆</div>
        <div><strong>{unlocked} / {badges.length}</strong><span>achievements unlocked</span></div>
      </div>

      <div className="achievement-grid">
        {badges.map((badge) => {
          const active = badge.condition(enrolledCourses);
          return (
            <article className={`achievement-card ${active ? "unlocked" : "locked"}`} key={badge.id}>
              <div className="badge-icon">{badge.icon}</div>
              <div>
                <span className="badge-status">{active ? "UNLOCKED" : "LOCKED"}</span>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}