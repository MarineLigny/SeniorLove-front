import { useState } from "react";
import api from "../utils/auth";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onLoginSuccess: () => void;
  onRegisterClick: () => void;
};

export default function ModalLogin({ onClose, onLoginSuccess, onRegisterClick }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      // Stocker le token d'accès et les infos utilisateur
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user_id", response.data.user.id);
      localStorage.setItem("pseudo", response.data.user.pseudo);

      onLoginSuccess();
      onClose(); // Fermer la modal après connexion réussie
      console.log("connexion reussie")
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      if (err.response) {
        console.error("Détails de l'erreur:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.response?.data?.message
        });

        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.response?.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else {
          setError("Erreur de connexion au serveur");
        }
      } else {
        setError("Erreur de connexion");
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button type="button" className="modal-btn-close" onClick={onClose}><X /></button>
        <img className="modal-login-logo" src="./img/logo-connexion.png" />
        <form className="modal-form" onSubmit={handleLogin}>
          <p className="modal-p">Email</p>
          <input
            className="modal-input"
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="modal-input"
            type="password"
            value={password}
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/*<a className="modal-login-link" href="/#">mot de passe oublié ?</a>*/}
          {error && <p className="modal-error">{error}</p>}
          <button className="modal-btn connection" type="submit">Se connecter</button>
          <button type="button" className="modal-btn register" onClick={onRegisterClick}> Créer un compte </button>
        </form>
      </div>
    </div>
  );
}
