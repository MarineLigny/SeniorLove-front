// ------------------ import des pages ---------------------
import HomePage from './pages/HomePage/HomePage';
import EventsPage from './pages/Events/EventsPage';
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
import Dashboard from './pages/Dashboard';
//------------------ import de la navbar et du footer sur toutes les pages --------------------------
import NavBar from './components/NavBar';
import Footer from './components/Footer';
//----------------- import des librairies -----------------
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type IUsers from './@types/users';
import axios from 'axios';



function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUsers| null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

  // verifier la présence d'un Token au chargement de la page et récupération des infos du user(pour voir si isAdmin)
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  setIsLoggedIn(true);

  // récupération des infos de l'utilisateur connecté
  const fetchUser = async () => {
    try {
      const response = await axios.get("https://emmanuelleeisele-server.eddi.cloud/myprofile", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem("token");
    }
  };

    fetchUser();
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
          currentUser={currentUser}
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
          <Route path="/dashboard"  
                element={currentUser && currentUser.role === 'admin'
                  ? <Dashboard />
                  : <NotFoundPage />
                } />
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
