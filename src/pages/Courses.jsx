import { useEffect, useMemo, useState } from "react";
import CourseCard from "../components/courses/CourseCard";
import SearchBar from "../components/courses/SearchBar";
import FilterPanel from "../components/courses/FilterPanel";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { getCourses } from "../services/courseService";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = () => {
    setLoading(true);
    setError("");
    getCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const filteredCourses = useMemo(() => courses.filter((course) => {
    const matchesSearch = `${course.title} ${course.description} ${course.instructor}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || course.category === category;
    const matchesDifficulty = difficulty === "All" || course.difficulty === difficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  }), [courses, search, category, difficulty]);

  return (
    <section className="section container">
      <div className="page-heading">
        <span className="eyebrow">COURSE LIBRARY</span>
        <h1>Find your next skill.</h1>
        <p>Search and filter practical courses across technology, design, data and business.</p>
      </div>

      <div className="course-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          category={category}
          difficulty={difficulty}
          onCategoryChange={setCategory}
          onDifficultyChange={setDifficulty}
        />
      </div>

      {loading && <Loading label="Loading courses..." />}
      {error && <ErrorMessage message={error} onRetry={loadCourses} />}
      {!loading && !error && (
        <>
          <p className="result-count">{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found</p>
          {filteredCourses.length ? (
            <div className="course-grid">{filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div>
          ) : (
            <div className="empty-state"><h2>No matching courses</h2><p>Try changing your search or filters.</p></div>
          )}
        </>
      )}
    </section>
  );
}