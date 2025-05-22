import { X } from "lucide-react";

export default function ModalAddEvent() {

  return(
      <div className="modal-backdrop">
        <button type="button" className="modal-btn-close"><X /></button>
        <h2 className="modal-title">Connexion</h2>
        <form action="">
          <input className="modal-input" type="text" name="title" placeholder="Titre"/>
          <input className="modal-input" type="text" name="description" placeholder="Description"/>
          <input className="modal-input" type="date" name="date" placeholder="Date"/>
          <input className="modal-input" type="url" name="image" placeholder="Lien url de l'image"/>
          <input className="modal-input" type="number" name="availability" placeholder="Places disponibles"/>
          <input className="modal-input" type="radio" name="disponibility" placeholder="Disponible"/>
          <input className="modal-input" type="radio" name="disponibility" placeholder="Indisponible"/>
          <button type="submit">Créer un évènement</button>
        </form>
      </div>
  )
}