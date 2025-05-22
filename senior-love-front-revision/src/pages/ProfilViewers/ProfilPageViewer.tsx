import { useEffect, useState } from "react";
import axios from "axios";

import type { AxiosError } from "axios";

import type IUsers from "../../@types/users";
import { useNavigate, useParams } from "react-router-dom";
import calculateAge from "../../utils/calculateAge";
import { ArrowLeft } from "lucide-react";

export default function ProfilPageViewer() {
	const { pseudo } = useParams<{ pseudo: string }>(); // Récupérer le pseudo depuis l'URL
	const [profile, setProfile] = useState<IUsers | null>(null); // import des données du profil utilisateur
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// ---------------------- recupération des infos de l'utilisateur -----------------------------
	useEffect(() => {
		const storedToken = localStorage.getItem("token");

		if (storedToken && pseudo) {
			// si connecté et qu'on récupère bien un pseudo alors on récupère les données utilisateur via un Fetch
			async function fetchData() {
				try {
					const response = await axios.get(
						`http://marineligny-server.eddi.cloud/profile/${pseudo}`,
						{
							headers: {
								Authorization: `Bearer ${storedToken}`, // Utilisation du token pour l'authentification
							},
						},
					);
					console.log(response.data);
					setProfile(response.data);
				} catch (err) {
					const axiosError = err as AxiosError;
					console.error("Erreur axios :", axiosError);

					if (axiosError.response) {
						setError(
							typeof axiosError.response.data === "string"
								? axiosError.response.data
								: "Accès non autorisé ou erreur serveur",
						);
					} else {
						setError("Impossible de contacter le serveur");
					}
					navigate("/404"); // Rediriger vers la page 404 en cas d'erreur
				} finally {
					setLoading(false);
				}
			}

			fetchData();
		} else {
			setError("Utilisateur pseudo invalide");
			setLoading(false);
			navigate("/404"); // Rediriger vers la page 404 si le pseudo est invalide
		}
	}, [pseudo, navigate]); //refresh a chaque changement dans l'url

	//--------------  Regroupement des activités par catégorie (si plusieurs alors groupé en une seul catégorie) -------------------
	const groupedActivities: {
		categoryName: string;
		activities: string[]; //recupération d'un tableau des activités
	}[] = [];

	if (profile?.activities) {
		for (const activity of profile.activities) {
			const categoryName = activity.category?.name || "Autre";

			const existingCategory = groupedActivities.find(
				(group) => group.categoryName === categoryName,
			);

			if (existingCategory) {
				existingCategory.activities.push(activity.name);
			} else {
				groupedActivities.push({
					categoryName,
					activities: [activity.name],
				});
			}
		}
	}

	// -------------------- Affichage de l'état de chargement, erreur ou données -------------------------
	if (loading) return <p>Chargement...</p>;
	if (error || !profile) return <p>{error || "Profil introuvable"}</p>;

	const activeInterestGroups = Object.entries(profile.interest).filter(
		([_, activities]) => Object.values(activities).some(isActive => isActive)
	  );

	return (
		<div>
			<section className="Public Container">
				<button onClick={() => navigate(-1)} type="button" className="btn-back">
					<ArrowLeft />
					Retour
				</button>

				<h1 className="Public-title">Profil de {profile.pseudo}</h1>

				<div className="Public-Card">
					<div className="Public-Card--presentation">
						<img
							src={
								profile.profile_picture
									? `http://marineligny-server.eddi.cloud${profile.profile_picture}` //soit image fournit
									: "/img/avatar3.png" // soit image d'un avatar en dur
							}
							alt={`${profile.pseudo}`}
							className="Public-Card--picture"
						/>

						<div className="Public-Card--form">
                <p className="Public-Card--pseudo Public-Card-p">
                  {profile.pseudo}
                </p>
                <p className="Public-Card-p">
                  <strong>Ville : </strong>
                  {profile.localisation?.city || "Non renseignée"}
                </p>
                <p className="Public-Card-p">
                  <strong>Genre : </strong>
                  {profile.gender}
                </p>
                <p className="Public-Card-p">
                  <strong>Age: </strong>
                  {calculateAge(profile.birth_date)} ans
                </p>
            </div>
              <div className="Public-Card--btn">
                  <a href={`/message/${profile.id}`} className="btn-message">
                    Envoyer un message
                  </a>
              </div>
					</div>
					<div className="Public-Card-text">
						<div className="Public-Card--description">
							<h2>Description : </h2>
							<p>{profile.description}</p>
						</div>

						<div className="Public-Card--interest">
							<h2>Centres d’intérêts</h2>
							<div className="Public-Card--interest-flex">
								{activeInterestGroups.length > 0 ? (
									Object.entries(profile.interest).filter(([_,activities]) => Object.values(activities).some(isActive => isActive)).map(([groupName, activites]: [string, any])=> (
										<div key={groupName} className="Public-Card--interest-group">
											<h3>{groupName}</h3>
											<ul>
												{Object.entries(activites).filter(([_, isActive]) => isActive).map(([activityName]) => (
													<li key={activityName} className="Public-Card--interest-item">
														{activityName}
													</li>
												))}
											</ul>
										</div>
									))
								) : (
									<p>Aucun centre d'intérêt renseigné</p>
								)}

							</div>
						</div>
					</div>

				</div>
			</section>
		</div>
	);
}
