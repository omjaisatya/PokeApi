export const fetchPokemonData = async (limit = 150) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const data = await response.json();

    const detailedData = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );

    return detailedData.map((p) => ({
      id: p.id,
      name: p.name,
      sprite: p.sprites.front_default,
      types: p.types.map((t) => t.type.name),
    }));
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    throw error;
  }
};
