import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <img src={course.image} alt="" />
      <div className="course-card-body">
        <div className="tag-row">
          <span className="tag">{course.category}</span>
          <span className="tag tag-muted">{course.difficulty}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>★ {course.rating}</span>
          <span>{course.duration}</span>
        </div>
        <Link className="button button-primary full-width" to={`/courses/${course.id}`}>
          View course
        </Link>
      </div>
    </article>
  );
}