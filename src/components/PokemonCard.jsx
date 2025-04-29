export default function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
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
  );
}
