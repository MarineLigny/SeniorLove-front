// import FilterBar from "../../components/FilterBar"; // Non utilisé pour le moment
import EventCard from "../../components/EventCard";
import MyEventCard from "../../components/MyEventCard";
import { useEffect, useState } from "react";
import api from "../../utils/auth";
import type IUsers from "../../@types/users";
import type IEvent from "../../@types/events";
import SearchBar from "../../components/SearchBarEvent";

export default function EventsPage() {
   const [events, setEvents] = useState<IEvent[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string>("");
   const [userData, setUserData] = useState<IUsers | null>(null);
   const storedToken = localStorage.getItem("accessToken");

   // Premier useEffect pour récupérer tous les événements
   useEffect(() => {
      const getEvents = async () => {
         try {
            const response = await api.get("/events");
            setEvents(response.data);
            setLoading(false);
         } catch (error) {
            console.error("Erreur lors de la récupération des événements :", error);
            setError("Une erreur est survenue");
            setLoading(false);
         }
      };
      getEvents();
   }, [storedToken]);

   // Deuxième useEffect pour récupérer le profil utilisateur
   useEffect(() => {
      const getUserProfile = async () => {
         if (!storedToken) return;

         try {
            const response = await api.get("/myprofile");
            setUserData(response.data);
         } catch (error) {
            console.error("Erreur lors de la récupération du profil utilisateur :", error);
            setError("Impossible de charger les données utilisateur.");
         }
      };
      getUserProfile();
   }, [storedToken]);

   if (loading) return <p>Chargement...</p>;
   if (error) return <p>{error}</p>;

   return (
      <div className="content">
         <SearchBar />

         <div className="allevents">
            <section className="title">
               <h1>Événements</h1>
            </section>

            <section className="events">
               {events.map((event) => (
                  <EventCard key={event.id} event={event} />
               ))}
            </section>
         </div>

         <div className="allevents">
            <h1> Mes événements</h1>
            <section className="events">
               {userData?.events?.length ? (
                  userData.events.map((event: IEvent) => (
                     <MyEventCard key={event.id} event={event} />
                  ))
               ) : (
                  <p className="events-empty">Aucun événement pour le moment.</p>
               )}
            </section>
         </div>
      </div>
   );
}


