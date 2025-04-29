export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search Pokémon..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-bar"
    />
  );
}
