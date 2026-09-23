import { useEffect, useState } from "react";
import { courseApi } from "../services/api";

const empty = {
  title: "",
  description: "",
  category: "Web Development",
  instructor: "",
  difficulty: "Beginner",
  duration: "6 Weeks",
  rating: 4.5,
  students: 0,
  image: "",
  lessons: "",
  skills: "",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all courses
  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await courseApi.list();

      setCourses(data.courses || []);
    } catch (e) {
      setError(e.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  // IMPORTANT:
  // Do not pass an async function directly to useEffect.
  useEffect(() => {
    load();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Submit create/update
  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const payload = {
      ...form,
      rating: Number(form.rating) || 0,
      students: Number(form.students) || 0,

      lessons: form.lessons
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),

      skills: form.skills
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await courseApi.update(editing, payload);
        setMessage("Course updated successfully.");
      } else {
        await courseApi.create(payload);
        setMessage("Course created successfully.");
      }

      setForm(empty);
      setEditing(null);

      await load();
    } catch (err) {
      setError(err.message || "Unable to save course.");
    }
  };

  // Edit course
  const edit = (course) => {
    setError("");
    setMessage("");

    setEditing(course.id);

    setForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "Web Development",
      instructor: course.instructor || "",
      difficulty: course.difficulty || "Beginner",
      duration: course.duration || "6 Weeks",
      rating: course.rating ?? 4.5,
      students: course.students ?? 0,
      image: course.image || "",

      lessons: Array.isArray(course.lessons)
        ? course.lessons.join("\n")
        : "",

      skills: Array.isArray(course.skills)
        ? course.skills.join(", ")
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete course
  const remove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await courseApi.remove(id);

      setMessage("Course deleted successfully.");

      await load();
    } catch (e) {
      setError(e.message || "Unable to delete course.");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    setForm(empty);
    setError("");
    setMessage("");
  };

  return (
    <section className="section container">
      {/* Page heading */}
      <div className="page-heading">
        <span className="eyebrow">ADMIN</span>

        <h1>Course management.</h1>

        <p>
          Create, update and remove courses through the SkillTrack REST API.
        </p>
      </div>

      <div className="admin-grid">
        {/* Course form */}
        <form className="form-card" onSubmit={submit}>
          <h2>{editing ? "Edit course" : "Add course"}</h2>

          {/* Title */}
          <label>
            Title
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Enter course title"
            />
          </label>

          {/* Instructor */}
          <label>
            Instructor
            <input
              type="text"
              name="instructor"
              required
              value={form.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
            />
          </label>

          {/* Duration */}
          <label>
            Duration
            <input
              type="text"
              name="duration"
              required
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 6 Weeks"
            />
          </label>

          {/* Image */}
          <label>
            Image URL
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/course-image.jpg"
            />
          </label>

          {/* Description */}
          <label>
            Description
            <textarea
              name="description"
              required
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the course"
            />
          </label>

          {/* Lessons */}
          <label>
            Lessons
            <textarea
              name="lessons"
              rows="6"
              placeholder={
                "Enter one lesson per line\nIntroduction\nHTML Basics\nCSS Basics\nReact Fundamentals"
              }
              value={form.lessons}
              onChange={handleChange}
            />
          </label>

          {/* Skills */}
          <label>
            Skills
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, HTML, CSS"
            />
          </label>

          {/* Category + Difficulty */}
          <div className="form-row">
            <label>
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Web Development">
                  Web Development
                </option>

                <option value="Design">Design</option>

                <option value="Data">Data</option>

                <option value="Business">Business</option>
              </select>
            </label>

            <label>
              Difficulty
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">Advanced</option>
              </select>
            </label>
          </div>

          {/* Rating + Students */}
          <div className="form-row">
            <label>
              Rating
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
              />
            </label>

            <label>
              Students
              <input
                type="number"
                name="students"
                min="0"
                value={form.students}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Error */}
          {error && <p className="form-error">{error}</p>}

          {/* Success */}
          {message && <p className="form-success">{message}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="button button-primary"
          >
            {editing ? "Update course" : "Create course"}
          </button>

          {/* Cancel */}
          {editing && (
            <button
              type="button"
              className="button button-secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Existing courses */}
        <div>
          <div className="page-heading">
            <h2>Existing courses</h2>
            <p>
              Manage courses currently stored in Supabase.
            </p>
          </div>

          {loading ? (
            <div className="admin-list">
              <article className="admin-item">
                <span>Loading courses...</span>
              </article>
            </div>
          ) : courses.length === 0 ? (
            <div className="admin-list">
              <article className="admin-item">
                <div>
                  <strong>No courses found</strong>
                  <span>
                    Create your first course using the form.
                  </span>
                </div>
              </article>
            </div>
          ) : (
            <div className="admin-list">
              {courses.map((course) => (
                <article
                  className="admin-item"
                  key={course.id}
                >
                  <div>
                    <strong>{course.title}</strong>

                    <span>
                      {course.category} ·{" "}
                      {course.difficulty}
                    </span>

                    <span>
                      Instructor: {course.instructor}
                    </span>

                    <span>
                      Duration: {course.duration}
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => edit(course)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => remove(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}