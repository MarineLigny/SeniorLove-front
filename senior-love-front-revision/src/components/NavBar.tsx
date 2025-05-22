import { useState } from "react";

type NavBarProps = {
  onLoginClick: () => void;
  onLogoutClick: () => void
  isLoggedIn: boolean;
};

const NavBar = ({ onLoginClick, onLogoutClick, isLoggedIn }: NavBarProps ) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="Navbar container">

      <button type="button" className="Navbar-burger" aria-label="Ouvrir le menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <a href="/" className="Navbar-logo" aria-label="Accueil">
        <img src="/img/LOGO2.png" alt="Logo" className="Navbar-logo--desktop" />
      </a>

      <nav className={menuOpen ? 'menu-open' : ''}>
        <a className="Nav-menu" href="/">Accueil</a>
        {isLoggedIn && (
          <a className="Nav-menu" href="/meet">Rencontres</a>
        )}
        {isLoggedIn && (
          <a className="Nav-menu" href="/event">Événements</a>
        )}
        {isLoggedIn && (
          <a className="Nav-menu" href="/profile">Mon Profil</a>
        )}
        {isLoggedIn && (
          <a className="Nav-menu" href="/mymessage">Messagerie</a>
        )}  
        {isLoggedIn && (
          <a className="Nav-menu" href="/dashboard">Dashboard</a>
        )}  

        {//<a href="/message">Mes Messages</a> 
        /* À faire : créer le bouton dans la messagerie */
        //<a href="/event/:id">Test</a>
        } 
      </nav>

      {isLoggedIn ? (
        <button type="button" className="btn-connexion" onClick={onLogoutClick}>DECONNEXION</button>
      ) : (
        <button type="button" className="btn-connexion" onClick={onLoginClick}>CONNEXION</button>
      )}

    </div>
    
  );
};

export default NavBar;