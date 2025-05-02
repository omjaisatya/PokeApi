import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import "./App.css";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("pokemon-theme") === "dark";
  });

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const listResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=150"
        );
        const listData = await listResponse.json();

        const details = await Promise.all(
          listData.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return response.json();
          })
        );

        const processed = details.map((d) => ({
          id: d.id,
          name: d.name,
          sprite: d.sprites.front_default,
          types: d.types.map((t) => t.type.name),
        }));

        const types = [...new Set(processed.flatMap((p) => p.types))].sort();

        setPokemonList(processed);
        setAllTypes(types);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setError("Failed to fetch Pokémon data");
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, sortBy, sortOrder, itemsPerPage]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pokemon-theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("pokemon-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("pokemon-theme", "light");
    }
  }, [isDarkMode]);

  const filteredPokemon = pokemonList
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedType.length === 0 ||
          selectedType.every((type) => p.types.includes(type)))
    )
    .sort((a, b) => {
      if (sortBy === "id") {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortBy === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemon = filteredPokemon.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (error) return <ErrorMessage message={error} />;
  if (isLoading) return <Loader />;

  return (
    <div className="app">
      <header className="header">
        <h1>Poké Explorer</h1>
        <button
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
        >
          {isDarkMode ? (
            //MOON
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            //SUN
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </header>

      <div className="controls">
        <div className="filters">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <TypeFilter
            types={allTypes}
            value={selectedType}
            onChange={setSelectedType}
          />
        </div>

        <div className="sort-pagination">
          <div className="sort-controls">
            <label>
              Sort By:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
              </select>
            </label>

            <label>
              Order:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>

          <div className="pagination-controls">
            <label>
              Items per page:
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>

            <div className="page-navigation">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pokemon-list">
        {paginatedPokemon.length === 0 ? (
          <div className="empty-state">No Pokémon found</div>
        ) : (
          paginatedPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
