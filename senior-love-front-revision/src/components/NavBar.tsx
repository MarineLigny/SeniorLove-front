import { useState } from "react";
import type IUsers from "../@types/users";

type NavBarProps = {
   onLoginClick: () => void;
   onLogoutClick: () => void
   isLoggedIn: boolean;
   currentUser: IUsers | null;
};

const NavBar = ({ onLoginClick, onLogoutClick, isLoggedIn, currentUser }: NavBarProps) => {
   const [menuOpen, setMenuOpen] = useState(false);
   const isAdmin = currentUser?.role === 'admin';

   return (
      <div className="Navbar container">

         <button type="button" className="Navbar-burger" aria-label="Ouvrir le menu" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
         </button>

         <a href="/" className="Navbar-logo" aria-label="Accueil">
            <img src="/img/LOGO2.png" alt="Logo" className="Navbar-logo--desktop" />
         </a>

         <nav className={menuOpen ? 'menu-open' : ''}>
            {isLoggedIn && (
               <a className="Nav-menu" href="/">ACCUEIL</a>
            )}
            {isLoggedIn && (
               <a className="Nav-menu" href="/meet">RENCONTRES</a>
            )}
            {isLoggedIn && (
               <a className="Nav-menu" href="/event">ÉVÉNEMENTS</a>
            )}
            {isLoggedIn && (
               <a className="Nav-menu" href="/profile">MON PROFIL</a>
            )}
            {isLoggedIn && (
               <a className="Nav-menu" href="/mymessage">MESSAGERIE</a>
            )}
            {isLoggedIn && isAdmin && (
               <a className="Nav-menu" href="/dashboard">Dashboard</a>
            )}

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
