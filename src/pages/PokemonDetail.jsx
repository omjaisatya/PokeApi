import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import "../assets/stylesheet/PokemonDetail.css";
import FavoritesContext from "../context/FavoritesContext";

function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  //   const isFavorite = favorites.includes(pokemon.id);
  const isFavorite = pokemon ? favorites.includes(pokemon.id) : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const pokemonData = await pokemonResponse.json();

        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const processChain = (chain) => {
          const evolutions = [];
          let current = chain;
          while (current) {
            evolutions.push({
              name: current.species.name,
              id: current.species.url.split("/")[6],
            });
            current = current.evolves_to[0];
          }
          return evolutions;
        };

        setPokemon(pokemonData);
        setEvolutionChain(processChain(evolutionData.chain));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokémon data", err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) return <ErrorMessage message={error} />;
  if (isLoading) return <Loader />;

  return (
    <div className="pokemon-detail">
      <button
        className={`favorite-btn large ${isFavorite ? "favorited" : ""}`}
        onClick={() => toggleFavorite(pokemon.id)}
      >
        {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
      </button>
      <Link to="/" className="back-button">
        ← Back to List
      </Link>

      <div className="detail-header">
        <h1>{pokemon.name}</h1>
        <p>#{pokemon.id.toString().padStart(3, "0")}</p>
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="detail-sprite"
        />
        <div className="types">
          {pokemon.types.map(({ type }) => (
            <span key={type.name} className={`type ${type.name}`}>
              {type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h2>Base Stats</h2>
        <div className="stats-grid">
          {pokemon.stats.map(({ stat, base_stat }) => (
            <div key={stat.name} className="stat-item">
              <span className="stat-name">{stat.name.replace("-", " ")}</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${(base_stat / 255) * 100}%` }}
                ></div>
                <span className="stat-value">{base_stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="abilities-section">
        <h2>Abilities</h2>
        <div className="abilities-grid">
          {pokemon.abilities.map(({ ability, is_hidden }) => (
            <div key={ability.name} className="ability">
              {ability.name}
              {is_hidden && <span className="hidden-tag">(hidden)</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="moves-section">
        <h2>Moves</h2>
        <div className="moves-grid">
          {pokemon.moves.map(({ move }) => (
            <div key={move.name} className="move">
              {move.name.replace("-", " ")}
            </div>
          ))}
        </div>
      </div>

      {evolutionChain.length > 1 && (
        <div className="evolution-section">
          <h2>Evolution Chain</h2>
          <div className="evolution-chain">
            {evolutionChain.map(({ name, id }) => (
              <Link key={id} to={`/pokemon/${id}`} className="evolution-item">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                  alt={name}
                />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonDetail;
