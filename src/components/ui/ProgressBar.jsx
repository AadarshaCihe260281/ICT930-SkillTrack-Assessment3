export default function ProgressBar({ progress }) {
  return (
    <div className="progress-wrap">
      <div className="progress-track" aria-label={`${progress}% complete`}>
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <span>{progress}%</span>
    </div>
  );
}