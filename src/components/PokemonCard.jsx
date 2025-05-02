import { useContext } from "react";
import { Link } from "react-router-dom";
import FavoritesContext from "../context/FavoritesContext";

export default function PokemonCard({ pokemon }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.includes(pokemon.id);
  return (
    <div className="pokemon-card">
      <button
        className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(pokemon.id);
        }}
      >
        ♥
      </button>
      <Link to={`/pokemon/${pokemon.id}`} className="pokemon-link">
        <div>
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="sprite"
            onError={(e) => (e.target.src = "fallback-image-url")}
          />
          <h3>{pokemon.name}</h3>
          <p>#{pokemon.id.toString().padStart(3, "0")}</p>
          <div className="types">
            {pokemon.types.map((type) => (
              <span key={type} className={`type ${type}`}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
