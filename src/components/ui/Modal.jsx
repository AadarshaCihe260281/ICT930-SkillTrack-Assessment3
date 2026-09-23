export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}