import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetail from "./pages/PokemonDetail";
import Favorites from "./pages/Favorites";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="app">
      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/favorites">Favorites</Link>
        <ThemeToggle />
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
