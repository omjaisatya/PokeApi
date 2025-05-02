export default function TypeFilter({
  types = [],
  selectedType = [],
  onChange,
}) {
  const handleTypeToggle = (type) => {
    const newTypes = selectedType.includes(type)
      ? selectedType.filter((t) => t !== type)
      : [...selectedType, type];
    onChange(newTypes);
  };

  return (
    <div className="type-filter">
      <h4>Filter by Type:</h4>
      <div className="type-buttons">
        {types.map((type) => (
          <button
            key={type}
            className={`type-toggle ${
              selectedType.includes(type) ? "active" : ""
            } ${type}`}
            onClick={() => handleTypeToggle(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
