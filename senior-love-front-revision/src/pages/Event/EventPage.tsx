import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  localisation: { city: string | null };
  users: IUsers[];
};



export default function EventPage() {

  const [openFormEvent, setOpenFormEvent] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [openUpdateEvent, setOpenUpdateEvent] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUsers | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<EventType>({
    name: "",
    date: "",
    description: "",
    availability: "",
    disponibility: true,
    picture: "",
    localisation: { city: "" },
    users: [],
  });

  const userId = localStorage.getItem("user_id"); // récupération de l'id via le token
  const isRegistered = event?.users?.some(user => user.id.toString() === userId); // vérification= pour chaque user dans event.users, on vérifie si son id est égal à userId
  const storedToken = localStorage.getItem("accessToken"); // récupération du token
  const isAdmin = currentUser?.role === 'admin'; // vérification du rôle admin


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "localisation.city") {
      setFormData((prev) => ({
        ...prev,
        localisation: {
          ...prev.localisation,
          city: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number"
            ? Number(value)
            : name === "disponibility"
              ? value === "true"
              : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storedToken) {
      alert("Vous devez être connecté pour créer un événement.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        date: formData.date,
        description: formData.description,
        availability: Number(formData.availability),
        disponibility: formData.disponibility,
        picture: formData.picture,
        city: formData.localisation.city, // Extraire city ici
        activities: [], // Si tu as des activités à ajouter, sinon laisse vide
      };
      console.log("Payload envoyé :", payload); // Pour débugger

      await axios.post("https://seniorlove.up.railway.app/event/form", payload, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      alert("Événement créé avec succès !");

      await refreshEvent(); // Rafraîchir les données de l'événement

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        date: "",
        description: "",
        availability: "",
        disponibility: true,
        picture: "",
        localisation: { city: "" },
        users: [],
      });
    } catch (error: any) {
      console.error("Erreur lors de la création :", error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
      alert("Erreur lors de la création de l'événement");
    }
  };
  //----------------------------Fonction pour rafraichir les données modifiées ---------------------//
  const refreshEvent = async () => {
    try {
      const response = await axios.get(`https://seniorlove.up.railway.app/events/${id}`, {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
      //console.log("Données rafraîchies :", response.data);
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
      await axios.post(`https://seniorlove.up.railway.app/events/${id}`, {
        user_id: userId
      }, //envoi de l'id 
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
      await axios.delete(`https://seniorlove.up.railway.app/events/${id}`, {
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
    axios.get(`https://seniorlove.up.railway.app/events/${id}`, {
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

  // useEffect pour récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    if (!storedToken) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get("https://seniorlove.up.railway.app/myprofile", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [storedToken]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Aucun événement trouvé</p>;
  //console.log(event.availability)


  return (
    <div className="content">
      <div className="eventPage">
        <article className="event">
          <img className="event-picture" src={event.picture} alt={event.name} />
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


          {!isRegistered && event.availability && Number(event.availability) > 0 && (
            <button type="button" className="btnarticle btnEventPage" onClick={handleRegister}>S'inscrire</button>
          )}
          {isRegistered && (
            <Link to='/event'>
              <button type="button" className="btnarticle btnEventPage" >Vous êtes déjà inscrit à cet événement.</button>
            </Link>
          )}

        </article>
      </div>

      {storedToken && isAdmin && (
        <>
          <div className="admin-buttons">
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
              <input
                type="text"
                name="localisation.city"
                placeholder="Ville"
                value={formData.localisation.city ?? ""}
                onChange={handleChange}
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
