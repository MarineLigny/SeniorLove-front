import { useState } from "react";
import axios from "axios";
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
    try {
      const response = await axios.post("http://marineligny-server.eddi.cloud/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token); // on stock le token
      localStorage.setItem("user_id", response.data.user.id); //  on stocke l’ID
      localStorage.setItem("pseudo", response.data.user.pseudo); //  on stock le pseudo
      onLoginSuccess();
      console.log("connexion reussi")
    } catch (err) {
      setError("Identifiants incorrects");
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
            <p className="modal-p">Mot de passe</p>
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
