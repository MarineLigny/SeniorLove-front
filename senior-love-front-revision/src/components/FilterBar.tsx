import axios from 'axios';
import { Search } from 'lucide-react';
import { useState } from 'react';
import UserCard from './UserCard';


export default function FilterBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [gender, setGender] = useState("");

  const storedToken = localStorage.getItem("accessToken");

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
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="searchbar container">
        <form action={handleSearch} className="searchbar-form">
          <div className='searchbar-input'>
            <Search className='search-icon' />
            <input
              className="searchbar-input-text"
              type="search"
              name="search"
              placeholder="Recherche par ville ou département"
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
          <button className="searchbar-button" type="submit"><Search className='search-icon-button' /></button>
        </form>
      </div>

      {(search || gender) && (
        <div className="meet-container">
          <section className="meet-container-title">
            {results &&
              <h1 className='meet-container-title'>
                Résultats pour <strong>{search}</strong> <strong>{gender}</strong>
              </h1>
            }
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