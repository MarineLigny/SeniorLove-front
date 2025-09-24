import axios from 'axios';
import { Search } from 'lucide-react';
import { useState } from 'react';
import EventCard from './EventCard';


export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [category, setCategory] = useState("");

  const storedToken = localStorage.getItem("accessToken");

  async function handleSearch(formData: FormData) {
    const localisation = formData.get("search") as string;
    const category = formData.get("category") as string;

    setSearch(localisation);
    setCategory(category);

    try {
      const response = await axios.get("https://seniorlove-back-znlu.onrender.com/events", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        params: {
          localisation,
          category,
        },
      });
      setResults(response.data);
      //console.log(response.data);
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
              placeholder="Recherche par ville ou département"
            />
          </div>

          <select
            className="category"
            name="category"
            id="category"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Sélectionnez une catégorie
            </option>

            <option value="musique">Musique</option>
            <option value="sport">Sport</option>
            <option value="art">Art</option>
            <option value="technologie">Technologie</option>

          </select>
          <button className="searchbar-button" type="submit"><Search className='search-icon-button' /></button>
        </form>
      </div>

      {(search || category) && (
        <div className="meet-container">
          <section className="meet-container-title">
            {results &&
              <h1 className='meet-container-title'>
                Résultats pour <strong>{search}</strong> <strong>{category}</strong>
              </h1>
            }
            {!results.length && <h1 className='meet-container-title'>Aucun résultat trouvé</h1>}
          </section>
          <section className="meets">
            {results.map((event, index) => (

              <EventCard key={index} event={event} />

            ))}
          </section>
        </div>
      )}
    </div>
  );
};