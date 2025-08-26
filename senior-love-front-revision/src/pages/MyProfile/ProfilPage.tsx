import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import axios from 'axios';
import type IUsers from '../../@types/users';
import { SquarePen } from 'lucide-react';
import { useRef } from 'react';

type Interets = {
   sport: {
      "Randonnée": boolean;
      "Vélo": boolean;
      "Marche Nordique": boolean;
      "Ski": boolean;
   };
   musique: {
      "Jazz": boolean;
      "Rock": boolean;
      "Classique": boolean;
   };
   jeux: {
      "Bridge": boolean;
      "Scrabble": boolean;
      "Pétanque": boolean;
      "Bingo": boolean;
   };
   loisirs: {
      "Cinéma": boolean;
      "Voyages": boolean;
      "Amoureux des animaux": boolean;
      "Brocantes": boolean;
   };
};

type Categorie = keyof Interets;
type Interet<C extends Categorie> = keyof Interets[C];

export default function ProfilePage() {
   const storedToken = localStorage.getItem("token");
   const [userData, setUserData] = useState<IUsers>();
   const [pseudo, setPseudo] = useState<string>("");
   const [city, setCity] = useState<string>("");
   const [gender, setGender] = useState<string>("");
   const [profile_picture, setProfilePicture] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const [loading, setLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [previewImage, setPreviewImage] = useState<string>("");
   const [interets, setInterets] = useState<Interets>({
      sport: {
         "Randonnée": false,
         "Vélo": false,
         "Marche Nordique": false,
         "Ski": false,
      },
      musique: {
         "Jazz": false,
         "Rock": false,
         "Classique": false,
      },
      jeux: {
         "Bridge": false,
         "Scrabble": false,
         "Pétanque": false,
         "Bingo": false,
      },
      loisirs: {
         "Cinéma": false,
         "Voyages": false,
         "Amoureux des animaux": false,
         "Brocantes": false,
      },
   });
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const handleCustomFileClick = () => {
      fileInputRef.current?.click();
   };
   const handleChange = <C extends Categorie>(categorie: C, interet: Interet<C>) => {
      setInterets(prev => ({
         ...prev,
         [categorie]: {
            ...prev[categorie],
            [interet]: !prev[categorie][interet]
         }
      }));
   };

   useEffect(() => {
      const getUser = async () => {
         try {
            const response = await axios.get("https://seniorlove.up.railway.app/myprofile", {
               headers: {
                  Authorization: `Bearer ${storedToken}`,
               }
            });
            setUserData(response.data);
         } catch (error) {
            console.error("Error fetching user data:", error);
         }
      };
      getUser();
   }, [storedToken]);

   useEffect(() => {
      if (userData) {
         setPseudo(userData.pseudo);
         setCity(userData.localisation?.city ?? "Ville Inconnue");
         setGender(userData.gender);
         setProfilePicture(userData.profile_picture);
         setDescription(userData.description);
         if (userData.interest) {
            setInterets(userData.interest);
         }
      }
   }, [userData]);

   useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
   }, []);

   const handleSave = async () => {
      setIsSaving(true);
      try {
         const updatedData = {
            pseudo,
            city,
            gender,
            description,
            interest: interets
         };

         const response = await axios.patch("https://seniorlove.up.railway.app/myprofile", updatedData, {
            headers: {
               Authorization: `Bearer ${storedToken}`,
               'Content-Type': 'application/json',
            }
         });

         setUserData(response.data);
         alert("Profil mis à jour !");
      } catch (error) {
         console.error("Erreur lors de la mise à jour du profil :", error);
         alert("Une erreur est survenue lors de la mise à jour du profil.");
      } finally {
         setIsSaving(false);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setSelectedFile(e.target.files[0]);
         setPreviewImage(URL.createObjectURL(e.target.files[0]));
      }
   };

   const handleUploadPhoto = async () => {
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("profile_picture", selectedFile);

      try {
         const response = await axios.patch(
            "https://seniorlove.up.railway.app/myprofile",
            formData,
            {
               headers: {
                  Authorization: `Bearer ${storedToken}`,
                  "Content-Type": "multipart/form-data",
               },
            }
         );
         setProfilePicture(response.data.profile_picture);
         alert("Photo de profil mise à jour !");
         setSelectedFile(null);
      } catch (error) {
         console.error("Erreur lors de l'upload de la photo :", error);
         alert("Échec de l'upload de l'image.");
      }
   };

   if (loading) {
      return (
         <section className="profile homeCard">
            <h1 className="section_title">Mon Profil</h1>
            <Loader />
         </section>
      );
   }

   return (
      <section className="profile homeCard">
         <h1 className="section_title">{pseudo}</h1>
         <div className="profile_essentials">
            <div className="profile_photo">
               <img
                  className="articlePictMeet"
                  src={previewImage || `https://seniorlove.up.railway.app${profile_picture}`}
                  alt={pseudo}
               />
               <div className='profile-buttons'>
                  <input
                     type="file"
                     accept="image/jpg, image/jpeg, image/png"
                     onChange={handleFileChange}
                     disabled={isSaving}
                     ref={fileInputRef}
                     className="hidden"
                  />

                  <button
                     type="button"
                     onClick={handleCustomFileClick}
                     className="btn-submit-img"
                     disabled={isSaving}
                  >
                     <SquarePen size={16} />
                     Changer ma photo
                  </button>
                  <button className="btn-submit-img" type="submit" onClick={handleUploadPhoto} disabled={!selectedFile || isSaving}>
                     Valider
                  </button>
               </div>

            </div>
            <div className="profile_form">
               <label>Pseudo<input className='profile-form-input' type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} disabled={isSaving} /></label>
               <label>Ville<input className='profile-form-input' type="text" value={city} onChange={(e) => setCity(e.target.value)} disabled={isSaving} /></label>
               <label>
                  Genre
                  <select className='profile-form-input' value={gender} onChange={(e) => setGender(e.target.value)} disabled={isSaving}>
                     <option value="">Choisir un genre</option>
                     <option value="homme">Homme</option>
                     <option value="femme">Femme</option>
                     <option value="non-genré">Non-genré</option>
                     <option value="autre">Autre</option>
                  </select>
               </label>
               <button className='btn-validate' type='button' onClick={handleSave} disabled={isSaving}>Valider les modifications</button>
            </div>
         </div>

         <div className="profile_details">

            <h2>Ajouter des détails sur votre profil</h2>
            <div className='profile-decription'>
               <label className="textarea_label">
                  Description
                  <textarea
                     className="textarea_description"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     maxLength={250}
                     disabled={isSaving}
                     placeholder="Cette description sera vue par les utilisateurs"
                  />
               </label>

            </div>

            <div className="profile_interests">
               <h3>Centres d’intérêts</h3>
               <div className="interest_group">
                  {Object.entries(interets).map(([categorie, liste]) => (
                     <div key={categorie}>
                        <strong>{categorie.charAt(0).toUpperCase() + categorie.slice(1)}</strong>
                        {Object.entries(liste).map(([interet, isChecked]) => (
                           <label key={interet}>
                              <input
                                 type="checkbox"
                                 checked={isChecked}
                                 onChange={() => handleChange(categorie as Categorie, interet as keyof typeof liste)}
                              />
                              {interet}
                           </label>
                        ))}
                     </div>
                  ))}
               </div>
            </div>
            <button className='modif-btn' type="button" onClick={handleSave} disabled={isSaving}>Valider les modifications</button>
         </div>
      </section>
   );
}
