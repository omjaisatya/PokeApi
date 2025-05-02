import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorBoundary from "../components/ErrorBoundary";
import "../assets/stylesheet/Compare.css";

const Compare = ({ pokemonList }) => {
  const [selected, setSelected] = useState({ first: "", second: "" });
  const [details, setDetails] = useState({ first: null, second: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [firstRes, secondRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${selected.first}`),
          fetch(`https://pokeapi.co/api/v2/pokemon/${selected.second}`),
        ]);

        const data = await Promise.all([firstRes.json(), secondRes.json()]);
        setDetails({ first: data[0], second: data[1] });
      } catch (err) {
        console.error("Error fetching Pokémon details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selected.first && selected.second) fetchDetails();
  }, [selected]);

  const handleSelect = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ErrorBoundary>
      <div className="compare-view">
        <h2>Compare Pokémon</h2>

        <div className="selectors">
          <select
            value={selected.first}
            onChange={(e) => handleSelect("first", e.target.value)}
          >
            <option value="">Select First Pokémon</option>
            {pokemonList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selected.second}
            onChange={(e) => handleSelect("second", e.target.value)}
          >
            <option value="">Select Second Pokémon</option>
            {pokemonList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <Loader />}

        {details.first && details.second && (
          <div className="comparison-grid">
            <PokemonStats data={details.first} />
            <div className="vs">VS</div>
            <PokemonStats data={details.second} />
          </div>
        )}

        <Link to="/" className="back-button">
          ← Back to List
        </Link>
      </div>
    </ErrorBoundary>
  );
};

const PokemonStats = ({ data }) => (
  <div className="pokemon-stats">
    <h3>{data.name}</h3>
    <img src={data.sprites.front_default} alt={data.name} />
    <div className="stats">
      {data.stats.map((stat) => (
        <div key={stat.stat.name} className="stat">
          <span>{stat.stat.name}</span>
          <div className="stat-bar" style={{ width: `${stat.base_stat}%` }}>
            {stat.base_stat}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Compare;
