export default function Loading({ label = "Loading..." }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p>{label}</p>
    </div>
  );
}