const Footer = () => {
  return (
    <div>
      <footer className="footer content">
        <div className="footer-left">
          <img
            src="/img/LOGO2.png"
            alt="Senior Love Logo"
            className="footer-logo"
          />
        </div>
        <div className="footer-right">
          <a className="footer-link" href="#">
            Contact
          </a>

          <a className="footer-link" href="/confidentiality">
            Politique de confidentialité
          </a>
          <a className="footer-link" href="#">
            Mentions Légales
          </a>
        </div>
      </footer>
      <p className="footer-copyright">
        &copy; 2025 Senior Love. Tous droits réservés.
      </p>
    </div>
  );
};

export default Footer;