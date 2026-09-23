import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import Modal from "../components/ui/Modal";

export default function Profile() {
  const { user, setUser } = useContext(AppContext);
  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.goal.trim()) next.goal = "Please enter a learning goal.";
    return next;
  };

  const submit = (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (!Object.keys(next).length) {
      setUser(form);
      setSaved(true);
    }
  };

  return (
    <section className="section container narrow">
      <div className="page-heading">
        <span className="eyebrow">ACCOUNT</span>
        <h1>Your profile</h1>
        <p>Keep your learning preferences up to date.</p>
      </div>

      <form className="form-card" onSubmit={submit} noValidate>
        <div className="form-row">
          <label>Full name
            <input name="name" value={form.name} onChange={update} aria-invalid={Boolean(errors.name)} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>Email
            <input name="email" type="email" value={form.email} onChange={update} aria-invalid={Boolean(errors.email)} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
        </div>

        <label>Learning goal
          <textarea name="goal" rows="5" value={form.goal} onChange={update} aria-invalid={Boolean(errors.goal)} />
          {errors.goal && <span className="field-error">{errors.goal}</span>}
        </label>

        <button className="button button-primary" type="submit">Save changes</button>
      </form>

      {saved && (
        <Modal title="Profile updated" onClose={() => setSaved(false)}>
          <p>Your profile changes have been saved successfully.</p>
          <button className="button button-primary" onClick={() => setSaved(false)}>Done</button>
        </Modal>
      )}
    </section>
  );
}