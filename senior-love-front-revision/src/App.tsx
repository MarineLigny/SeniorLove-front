// ------------------ import des pages ---------------------
import HomePage from './pages/HomePage/HomePage';
import EventsPage from './pages/AllEvent/EventsPage';
import ProfilePage from './pages/MyProfile/ProfilPage';
import MeetPage from './pages/Meet/MeetPage';
import ProfilPageViewer from './pages/ProfilViewers/ProfilPageViewer';
import ConversationPage from './pages/Conversation/ConversationPage';
import EventPage from './pages/Event/EventPage';
import MyMessagePage from './pages/Meet-Profils/MyMessagePage';
import ModalLogin from './components/ModalLogin';
import ModalRegister from "./components/ModalRegister";
import Confidentiality from "./pages/Confidentiality";
import NotFoundPage from './pages/404/Page404';
//------------------ import de la navbar et du footer sur toutes les pages --------------------------
import NavBar from './components/NavBar';
import Footer from './components/Footer';
//----------------- import des librairies -----------------
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();
    //const [isLoading, setIsLoading] = useState(true);

  // verifier la présence d'un Token au chargement de la page
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  //modal de connexion ok, passage à True
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  //modal de creation de compte ok
  const handleRegisterSuccess = () => {
    // Optionnel : tu peux connecter automatiquement après inscription
    setShowRegisterModal(false);
  };

  //si déconnexion
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate("/"); // redirection vers page d'accueil />
  };


  return (
    <>
      <NavBar
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowLoginModal(true)}
          onLogoutClick={handleLogout}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:pseudo" element={<ProfilPageViewer />} />
          <Route path="/meet" element={<MeetPage />} />
          <Route path="/mymessage" element={<MyMessagePage />} />
          <Route path="/message/:contactId" element={<ConversationPage />} />
          <Route path="/confidentiality" element={<Confidentiality />} />
          <Route path="*" element={<NotFoundPage />} />
          
        </Routes>
      </main>

      <Footer />

    {/*-------------- Modal de connexion ------------------- */}
      {showLoginModal && (
        <ModalLogin
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

    {/* ---------------- Modal d'inscription -------------------- */}
      {showRegisterModal && (
        <ModalRegister
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
)
};

export default App
