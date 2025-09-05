import { useState } from "react";
import axios from "axios";
import calculateAge from "../utils/calculateAge";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onRegisterSuccess: () => void;
};

export default function ModalRegister({ onClose, onRegisterSuccess }: Props) {
  const [formData, setFormData] = useState({
    pseudo: "",
    birth_date: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    const age = calculateAge(formData.birth_date);
    if (age < 60) {
      setError("Vous devez avoir au moins 60 ans pour vous inscrire.");
      return;
    }

    try {
      const response = await axios.post("https://seniorlove.up.railway.app/register", {
        pseudo: formData.pseudo,
        birth_date: formData.birth_date,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }, {
        withCredentials: true, // Inclut les cookies pour recevoir le refresh token
      });

      // Stocker le token d'accès et les infos utilisateur (l'utilisateur est connecté après inscription)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("pseudo", response.data.user.pseudo);
      }

      onRegisterSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur de connexion");
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button type="button" className="modal-btn-close" onClick={onClose}><X /></button>
        <img className="modal-login-logo" src="./img/logo-inscription.png" />
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="text"
            name="pseudo"
            placeholder="Pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
          <input
            className="modal-input"
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
          <input
            className="modal-input"
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="modal-input"
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="modal-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            className="modal-input"
            type="checkbox"
            name="consent"
            required
          />
          <label className="modal-input-consent" htmlFor="consent">
            J'accepte la <a href="/confidentiality" className="modal-input-link">politique de confidentialité</a> et le traitement de mes données personnelles.
          </label>

          {error && <p className="modal-error">{error}</p>}
          <button className="modal-btn register" type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}
