import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FavoritesContext from "../context/FavoritesContext";
import PokemonCard from "../components/PokemonCard";
import Loader from "../components/Loader";

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const results = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            return {
              id: data.id,
              name: data.name,
              sprite: data.sprites.other["official-artwork"].front_default,
              types: data.types.map((t) => t.type.name),
            };
          })
        );
        setFavoritePokemon(results);
      } catch (err) {
        console.error("Failed to fetch favorite Pokémon", err);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavorites();
    } else {
      setFavoritePokemon([]);
      setLoading(false);
    }
  }, [favorites]);

  if (loading) return <Loader />;

  return (
    <div className="favorites-view">
      <h2>Favorite Pokémon</h2>
      {favoritePokemon.length === 0 ? (
        <div className="empty-state">
          No favorites yet! <Link to="/">Browse Pokémon</Link>
        </div>
      ) : (
        <div className="pokemon-list">
          {favoritePokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
