import { useState } from "react";
import axios from "axios";
import calculateAge from "../utils/calculateAge";

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
      await axios.post("http://marineligny-server.eddi.cloud/register", {
        pseudo: formData.pseudo,
        birth_date: formData.birth_date,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, 
      });

      onRegisterSuccess();
      onClose();
    } catch (err) {
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">Inscription</h2>
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
          <button className="modal-btn modal-btn-register" type="submit">S'inscrire</button>
          <button className="modal-btn" type="button" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
}
