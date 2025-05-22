import { useState } from "react";
//import type IEvent from "../@types/events";
import axios from "axios";
import { useFormStatus } from "react-dom";
import type IUsers from "../@types/users";
import { useParams } from "react-router-dom";

type EventType = {
  id?: number;
  name: string;
  date: Date;
  description: string;
  availability: string | number;
  disponibility: boolean;
  picture: string;
  localisation : { city: string | null};
  users:IUsers[];
};

type Props = {
  event: EventType
  onUpdate: (updatedEvent: EventType) => void
	//localisations: { id: number; city: string }[];
};

const UpdateEvent = ({ event, onUpdate }: Props) => {
  const [formData, setFormData] = useState<EventType>(event);
  const { pending } = useFormStatus();
  const { id } = useParams<{ id: string }>();

	//------------------ mise à jour de l'objet formData avec le bon "type"----------
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = event.target;

		let newValue: string | number | boolean | Date = value;

		// Si c'est un champ number, on convertit en nombre
		if (type === "number") { newValue = Number(value);}

		// Si c'est le champ "disponibility", on convertit en boolean
		if (name === "disponibility") { newValue = value === "true"; }
		// Si c'est le champ "date", on s'assure que la valeur reste bien une string au bon format
		if (name === "date") { newValue = new Date(value);}

		// On met à jour formData avec la nouvelle valeur
		setFormData(prev => ({
			...prev,
			[name]: newValue
		}));
	};

  //--------------- changement de la localisation -------------------------
  /*const handleLocalisationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const matchedLoc =
        localisations.find(
          (loc) => loc.city.toLowerCase() === inputValue.toLowerCase()
        ) ?? { city: inputValue };

      setFormData((prev) => ({
        ...prev,
        localisation: matchedLoc,
      }));
    },
    [localisations]
  );*/

//------------- envoyer une requête PATCH vers ton backend afin de modifier un événement existant--------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //empeche le rechargement de la page 

    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        alert("Vous devez être connecté pour modifier un événement.");
        return;
      }
			
      // Formater la date en string 'YYYY-MM-DD'
      const formattedDate = formData.date instanceof Date
      ? formData.date.toISOString().slice(0, 10)
      : formData.date;

      // Conversion de availability en nombre entier
      const availabilityInt = Number(formData.availability) || null;
      if (Number.isNaN(availabilityInt)) {
      alert("Le nombre de places doit être un nombre valide.");
      return;
      }

			const updatedFormData = {
				name: formData.name,
				date: formattedDate,
				description: formData.description,
				availability: availabilityInt, // assure que c’est bien un nombre
				disponibility: formData.disponibility === true, // assure que c’est un booléen
				picture: formData.picture,
				//localisation: formData.localisation, // a changer quand recup 
			};
    
			console.log("Payload envoyé :", updatedFormData);
      console.log("id recupéré", {id});
      const response = await axios.patch(
        `http://marineligny-server.eddi.cloud/events/${id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Événement modifié avec succès !");
      onUpdate(response.data);
    } catch (error: any) {
  console.error("Erreur axios :", error);
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data); 
  }
}
  };

  return (
    <form className="openForm" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nom de l'événement"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        value={typeof formData.date === "string" ? formData.date : formData.date.toISOString().split("T")[0]}
        onChange={handleChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="availability"
        placeholder="Nombre de places"
        value={formData.availability ?? ""}
        onChange={handleChange}
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
      />

      <button type="submit" disabled={pending}>
        {pending ? "Modification en cours..." : "Modifier"}
      </button>
    </form>
  );
};

export default UpdateEvent;