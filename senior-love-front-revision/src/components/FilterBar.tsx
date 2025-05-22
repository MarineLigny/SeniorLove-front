export default function FilterBar() {
    return (
        <div>
            <div className="searchEvent">
            <form action="">
                    <input className="search" type="search" placeholder="Recherche par mots clés" />
                    <select className="localisation" name="localisation" id="localisation">
                        <option value="" disabled selected hidden>localisation</option>
                        <option value="local">local</option>
                        <option value="local">local</option>
                        <option value="local">local</option>
                        <option value="local">local</option>
                    </select>
                    <select className="category" name="category" id="category">
                        <option value="" disabled selected hidden>categories</option>
                        <option value="sport">Sport</option>
                        <option value="musique">Musique</option>
                        <option value="jeux">Jeux</option>
                        <option value="loisirs">Loisirs</option>
                    </select>
                </form>

        </div>
        </div>
    );
};