import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetail from "./pages/PokemonDetail";
import Favorites from "./pages/Favorites";
import ThemeToggle from "./components/ThemeToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import Compare from "./pages/Compare";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import usePokemonData from "./hooks/usePokemonData";
import "./App.css";

function App() {
  const { pokemonList, isLoading, error } = usePokemonData(151);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 150) + 1;
    navigate(`/pokemon/${randomId}`);
    setMenuOpen(false);
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );

  return (
    <div className="app">
      <nav className="main-nav">
        <div className="nav-header">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger">☰</span>
          </button>
          <ThemeToggle />
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)} className="nav-link">
            Home
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Favorites
          </Link>
          <Link
            to="/compare"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Compare
          </Link>
          <button
            className="random-pokemon-button"
            onClick={() => {
              setMenuOpen(false);
              getRandomPokemon();
            }}
          >
            Random Pokémon
          </button>
        </div>
      </nav>

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home pokemonList={pokemonList} />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route
            path="/compare"
            element={<Compare pokemonList={pokemonList} />}
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
