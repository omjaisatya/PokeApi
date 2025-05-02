import { useState, useEffect } from "react";
import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "./PokemonDetail";
import SearchBar from "../components/SearchBar";
import TypeFilter from "../components/TypeFilter";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import "../App.css";

function Home() {
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

  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (isLoading) return <Loader />;

  return (
    <div className="app">
      <header className="header">
        <h1>Poké Explorer</h1>
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

export default Home;
