import axios from "axios";
import { useEffect, useState } from "react";

import { Link, useParams, useNavigate} from 'react-router-dom';
import type IUsers from "../../@types/users";
import UpdateEvent from "../../components/updateEvent";
import { Loader } from "lucide-react";

type EventType = {
  id?: number;
  name: string;
  date: string;
  description: string;
  availability: string | number;
  disponibility: boolean;
  picture: string;
  localisation : { city: string | null};
  users:IUsers[];
};



export default function EventPage() {

  const [openFormEvent, setOpenFormEvent] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [openUpdateEvent, setOpenUpdateEvent] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<EventType>({
    name: "",
    date: "",
    description: "",
    availability: "",
    disponibility: true,
    picture: "",
    localisation : { city: ""},
    users: [],
  });

  const userId = localStorage.getItem("user_id"); // récupération de l'id via le token
  const isRegistered = event?.users?.some(user => user.id.toString() === userId); // vérification= pour chaque user dans event.users, on vérifie si son id est égal à userId
  const storedToken = localStorage.getItem("token"); // récupération du token


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number"
        ? Number(value)
        : name === "disponibility"
        ? value === "true"
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storedToken) {
      alert("Vous devez être connecté pour créer un événement.");
      return;
    }

    try {
      await axios.post("http://marineligny-server.eddi.cloud/event/form", formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      alert("Événement créé avec succès !");
      setFormData({
        name: "",
        date: "",
        description: "",
        availability: "",
        disponibility: true,
        picture: "",
        localisation : { city: ""},
        users: [],
      });
    } catch (error) {
      alert("Erreur lors de la création de l’événement");
    }
  };
//----------------------------Fonction pour rafraichir les données modifiées ---------------------//
  const refreshEvent = async () => {
    try {
      const response = await axios.get(`http://marineligny-server.eddi.cloud/events/${id}`, {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
      setEvent(response.data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de l'événement :", error);
    }
  };
  
  //-----------------------------Fonction pour s'inscrire à un évenment---------------------------// 
  const handleRegister = async () => {
    if (!storedToken) {
      alert("Veuillez vous connecter pour vous inscrire.");
      return;
    }

    if (!userId) {
      alert("Utilisateur non identifié.");
      return;
    }
  
    try {
      await axios.post(`http://marineligny-server.eddi.cloud/events/${id}`, {
         user_id:userId}, //envoi de l'id 
        {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      console.log("Inscription réussie !");
      await refreshEvent(); // On refresh les données de disponibilitées pour qu'il y ait le bon nombre de place 
    } catch (err) {
      setError("Erreur lors de l'inscription à l'événement.");
      setLoading(false);
      console.error(err);
    }
  };
  

  const handleDeleteEvent = async () => {
    if (!storedToken || !id) return;

    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://marineligny-server.eddi.cloud/events/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      alert("Événement supprimé !");
      navigate("/event"); 
    } catch (err) {
      alert("Erreur lors de la suppression de l’événement.");
    }
  };

  useEffect(() => {
    axios.get(`http://marineligny-server.eddi.cloud/events/${id}`, {
      headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
    })
      .then(response => {
        setEvent(response.data);
        setLoading(false);
        //console.log(response.data)
      })
      .catch(err => {
        setError("Une erreur est survenue");
        setLoading(false);
        console.log(err)
      });
  }, [id, storedToken]);

  if (loading) return <Loader/>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Aucun événement trouvé</p>;
console.log(event.availability)


  return (
    <div>
      <div className="eventPage">
        <article className="event middleOfPage">
          <img className="articlepict" src={event.picture} alt={event.name} />
          <h2>{event.name}</h2>
          <p className="particle">{event.description}</p>
          {event.localisation?.city && (
          <p>Cette événement se tiendra à : {event.localisation.city}</p>)}
          
          {/*{event.availability ? (
            <p> Nombres de places disponible : {event.availability}</p>
          ): (
            <p>Accès Libre</p>
          )}*/}
          {!event.availability || event.availability === 0 ? <p>Accès Libre</p> : <p> Nombres de places disponible : {event.availability}</p>}

        
          {!isRegistered && event.availability > 0 && (
            <button type="button" className="btnarticle btnEventPage" onClick={handleRegister}>S'inscrire</button>
          )}
          {isRegistered && (
            <Link to='/event'>
              <button type="button" className="btnarticle btnEventPage" >Vous êtes déjà inscrit à cet événement.</button>
            </Link>
          )}

        </article>
      </div>

      {storedToken && (
        <>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              className="btnarticle btnAdminPage"
              onClick={() => setOpenFormEvent(!openFormEvent)}
            >
              Créer un nouvel événement
            </button>

            <button
              type="button"
              className="btnarticle btnAdminPage"
              onClick={() => setOpenUpdateEvent(!openUpdateEvent)}
            >
              Modifier l'évènement
            </button>

            {openUpdateEvent && event && (
              <UpdateEvent
                event={event}
                onUpdate={setEvent}
              />
            )}

            <button
              type="button"
              className="btnarticle btnAdminPage"
              onClick={handleDeleteEvent}
            >
              Supprimer l'événement
            </button>
          </div>

          <div>
            <form className={openFormEvent ? "openForm" : "closeForm"} onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nom de l'événement"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="availability"
                placeholder="Nombre de places"
                value={formData.availability}
                onChange={handleChange}
                required
              />
              <label>
                <input
                  type="radio"
                  name="disponibility"
                  value="true"
                  checked={formData.disponibility === true}
                  onChange={handleChange}
                />
                Disponible
              </label>
              <label>
                <input
                  type="radio"
                  name="disponibility"
                  value="false"
                  checked={formData.disponibility === false}
                  onChange={handleChange}
                />
                Indisponible
              </label>
              <input
                type="text"
                name="picture"
                placeholder="URL de l'image"
                value={formData.picture}
                onChange={handleChange}
                required
              />
              <button type="submit">Valider</button>
            </form>
          </div>
        </>
      )}

      {!storedToken && (
        <p className="info">Connectez-vous pour créer ou gérer des événements.</p>
      )}
    </div>
  );
}
