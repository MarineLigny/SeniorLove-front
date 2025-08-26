import axios from 'axios';
import { Search } from 'lucide-react';
import { useState } from 'react';
import UserCard from './UserCard';


export default function FilterBar() {
   const [search, setSearch] = useState("");
   const [results, setResults] = useState([]);
   const [gender, setGender] = useState("");

   const storedToken = localStorage.getItem("token");

   async function handleSearch(formData: FormData) {
      const localisation = formData.get("search") as string;
      const selectedGender = formData.get("gender") as string;

      setSearch(localisation);
      setGender(selectedGender);

      try {
         const response = await axios.get("https://seniorlove.up.railway.app/meet", {
            headers: {
               Authorization: `Bearer ${storedToken}`,
            },
            params: {
               localisation,
               gender: selectedGender,
            },
         });
         setResults(response.data);
      } catch (error) {
         console.error(error);
      }
   }

   return (
      <div>
         <div className="searchbar container">
            <form action={handleSearch} className="searchbar-form">
               <div className='searchbar-input'>
                  <Search />
                  <input
                     className="searchbar-input-text"
                     type="search"
                     name="search"
                     placeholder="Recherche par ville"
                  />
               </div>

               <select
                  className="category"
                  name="gender"
                  id="gender"
                  defaultValue=""
               >
                  <option value="" disabled hidden>
                     Sélectionnez un genre
                  </option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="non_genré">Non-genré</option>
                  <option value="autre">Autre</option>
               </select>
            </form>
         </div>


         {search && (
            <div className="meet-container">
               <section className="meet-container-title">
                  {search && <h1 className='meet-container-title'>Résultat de la recherche pour '{search}'</h1>}
                  {!results.length && <h1 className='meet-container-title'>Aucun résultat trouvé</h1>}
               </section>
               <section className="meets">
                  {results.map((user, index) => (

                     <UserCard key={index} user={user} />

                  ))}
               </section>
            </div>
         )}
      </div>
   );
};