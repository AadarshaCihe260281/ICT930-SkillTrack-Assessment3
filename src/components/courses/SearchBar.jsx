export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-box">
      <span className="sr-only">Search courses</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search courses..."
      />
    </label>
  );
}