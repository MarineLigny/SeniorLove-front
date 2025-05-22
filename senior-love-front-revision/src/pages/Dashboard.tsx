import { useState } from "react";
import IEvent from "../@types/events"



export default function Dashboard(){
  const [openFormEvent, setOpenFormEvent] = useState(false);
  const storedToken = localStorage.getItem("token"); // récupération du token

return (
  <div>
    <h1>Dashboard</h1>
    <section id="events">
      <h2>Gestion des événements</h2>
      {/*faire la partie ajout d'un evenement ici en modal*/}
      <button type= 'submit' >Ajouter</button>

      {/*mapper les evenements pour les afficher */}
        <p className="event-title"/>

      {/*faire la partie modification d'un evenement ici en modal */}
      <button type= 'submit' >Modifier</button>

      {/*faire la partie suppression d'un evenement ici */}
      <button type= 'submit' >Supprimer</button>
    </section>
  </div>
)
}