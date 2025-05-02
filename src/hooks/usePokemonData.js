import { useState, useEffect } from "react";
import { fetchPokemonData } from "../api/fetchPokemonData";

const usePokemonData = (limit = 150) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPokemonData(limit)
      .then((data) => {
        setPokemonList(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setIsLoading(false);
      });
  }, [limit]);

  return { pokemonList, isLoading, error };
};

export default usePokemonData;
