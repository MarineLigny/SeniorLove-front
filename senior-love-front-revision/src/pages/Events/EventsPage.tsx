// import FilterBar from "../../components/FilterBar"; // Non utilisé pour le moment
import EventCard from "../../components/EventCard";
import MyEventCard from "../../components/MyEventCard";
import { useEffect, useState } from "react";
import axios from "axios";
import type IUsers from "../../@types/users";
import type IEvent from "../../@types/events";

export default function EventsPage() {
	const [events, setEvents] = useState<IEvent[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [userData, setUserData] = useState<IUsers | null>(null);
	//console.log(userData);
	const storedToken = localStorage.getItem("token");

	//On fetch tous les evenements 
	useEffect(() => {
		axios
			.get("http://localhost:3000/events", {
				headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
			})
			.then((response) => {
				setEvents(response.data);
				setLoading(false);
			})
			.catch(() => {
				setError("Une erreur est survenue");
				setLoading(false);
			});
	}, [storedToken]);


	//On fetch pour récupérer mon profil afin d'afficher mes evenements
	useEffect(() => {
		if (!storedToken) return;

		axios
			.get("http://localhost:3000/myprofile", {
				headers: { Authorization: `Bearer ${storedToken}` },
			})
			.then((response) => {
				setUserData(response.data);
			})
			.catch(() => {
				setError("Impossible de charger les données utilisateur.");
			});
	}, [storedToken]);

	if (loading) return <p>Chargement...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div>
			<div className="allevents content">
				<section className="title">
					<h1>Evenements</h1>
				</section>

				<section className="events">
					{events.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</section>
			</div>

			<div className="allevents">
				<section className="title">
					<h1> Mes evenements</h1>
				</section>
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
