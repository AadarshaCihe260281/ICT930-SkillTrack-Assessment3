import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { getCourseById } from "../services/courseService";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import Modal from "../components/ui/Modal";
import ProgressBar from "../components/ui/ProgressBar";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, enrolCourse, isEnrolled, enrolledCourses, completeLesson } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    getCourseById(id)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <section className="section container"><Loading label="Loading course..." /></section>;
  if (error) return <section className="section container"><ErrorMessage message={error} onRetry={load} /></section>;

  const enrolled = isEnrolled(course.id);
  const enrolledCourse = enrolledCourses.find((item) => item.id === course.id);
  const progress = enrolledCourse?.progress ?? 0;

  const handleEnrol = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }
    try {
      await enrolCourse(course);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="section container">
      <Link className="back-link" to="/courses">← Back to courses</Link>
      <div className="detail-grid">
        <div>
          <img className="detail-image" src={course.image} alt="" />
        </div>
        <div>
          <div className="tag-row">
            <span className="tag">{course.category}</span>
            <span className="tag tag-muted">{course.difficulty}</span>
          </div>
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="detail-meta">
            <span><strong>Instructor</strong>{course.instructor}</span>
            <span><strong>Duration</strong>{course.duration}</span>
            <span><strong>Rating</strong>★ {course.rating}</span>
            <span><strong>Learners</strong>{course.students.toLocaleString()}</span>
          </div>
          {!enrolled ? (
            <button className="button button-primary" onClick={handleEnrol}>Enrol now</button>
          ) : (
            <div className="enrolled-panel">
              <div><strong>You are enrolled</strong><span>Keep going — you're {progress}% complete.</span></div>
              <ProgressBar progress={progress} />
            </div>
          )}
        </div>
      </div>

      <div className="lessons-section">
        <div className="section-heading">
          <div><span className="eyebrow">CURRICULUM</span><h2>Course lessons</h2></div>
          {enrolled && <span className="tag">{progress}% complete</span>}
        </div>
        <div className="lesson-list">
          {course.lessons.map((lesson, index) => {
            const checked = enrolledCourse?.completedLessons.includes(lesson) ?? false;
            return (
              <label className={`lesson ${checked ? "completed" : ""}`} key={lesson}>
                <input
                  type="checkbox"
                  disabled={!enrolled}
                  checked={checked}
                  onChange={() => completeLesson(course.id, lesson)}
                />
                <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{lesson}</span>
                {!enrolled && index === 0 && <small>Enrol to track</small>}
              </label>
            );
          })}
        </div>
      </div>

      {showModal && (
        <Modal title="You're enrolled!" onClose={() => setShowModal(false)}>
          <p><strong>{course.title}</strong> has been added to your dashboard.</p>
          <div className="modal-actions">
            <button className="button button-secondary" onClick={() => setShowModal(false)}>Keep browsing</button>
            <button className="button button-primary" onClick={() => navigate("/dashboard")}>Go to dashboard</button>
          </div>
        </Modal>
      )}
    </section>
  );
}