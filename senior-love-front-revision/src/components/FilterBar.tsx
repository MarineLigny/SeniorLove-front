
import axios from 'axios';
import { Search, User } from 'lucide-react';
import { useState } from 'react';
import UserCard from './UserCard';



export default function FilterBar() {
    const [input, setInput] = useState("");
    const storedToken = localStorage.getItem("token");
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState("");

    const inputData = async (localisation: string) => {
        try {
            const response = await axios.get(
                "http://marineligny-server.eddi.cloud/meet",
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                    params: {
                        localisation, // ← sera transmis en ?localisation=...
                    },
                },
            );
            console.log(response.data)
            setResults(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (value: string) => {
        setInput(value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        inputData(input);
        console.log("Recherche envoyée avec :", input, "et catégorie :", categories);
    };

    return (
        <div>
            <div className="searchbar container">
                <form action="" className='searchbar-form' onSubmit={handleSubmit}>
                    <div className='searchbar-input'>
                        <Search />
                        <input
                            className="searchbar-input-text"
                            type="search"
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            name="search"
                            placeholder="Recherche par mots clés" />
                    </div>

                    <select
                        className="category"
                        name="category"
                        id="category"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                    >
                        <option value="" disabled selected hidden>categories</option>
                        <option value="sport">Sport</option>
                        <option value="musique">Musique</option>
                        <option value="jeux">Jeux</option>
                        <option value="loisirs">Loisirs</option>
                    </select>
                </form>
            </div>


            <div className="allMeet">
                <section className="title">
                    <h1>Résultat de la recherche pour '{input}'</h1>
                </section>
                <section className="meets">
                    {results.map((user, index) => (
                        <div key={index}>
                            <UserCard user={user} />
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};