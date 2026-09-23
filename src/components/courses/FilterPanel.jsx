export default function FilterPanel({
  category,
  difficulty,
  onCategoryChange,
  onDifficultyChange
}) {
  return (
    <div className="filters">
      <label>
        Category
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option>All</option>
          <option>Web Development</option>
          <option>Design</option>
          <option>Data</option>
          <option>Business</option>
          <option>Technology</option>
        </select>
      </label>

      <label>
        Difficulty
        <select value={difficulty} onChange={(event) => onDifficultyChange(event.target.value)}>
          <option>All</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </label>
    </div>
  );
}