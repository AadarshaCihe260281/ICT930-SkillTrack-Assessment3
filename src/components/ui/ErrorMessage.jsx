export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box error-state" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && <button className="button button-secondary" onClick={onRetry}>Try again</button>}
    </div>
  );
}