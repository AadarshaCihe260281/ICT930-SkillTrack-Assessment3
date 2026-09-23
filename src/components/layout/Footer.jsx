export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content footer-grid">
        <div className="footer-brand">
          <strong className="footer-title">SkillTrack</strong>
          <p className="footer-tag">Learn. Progress. Achieve.</p>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Email: contact@skilltrack.example</p>
        </div>

        <div className="footer-location">
          <h4>Location</h4>
          <p>123 Learning Lane</p>
          <p>Knowledge City, ED 90210</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/courses">Courses</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/contact">Support</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 SkillTrack. All rights reserved.</p>
      </div>
    </footer>
  );
}