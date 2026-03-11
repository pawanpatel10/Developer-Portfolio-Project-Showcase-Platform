const SearchBar = ({ filters, onChange, onSubmit, onReset }) => {
  return (
    <form className="card search-panel" onSubmit={onSubmit}>
      <div className="search-grid">
        <label>
          Search
          <input
            type="text"
            name="search"
            placeholder="Search title, stack, or description"
            value={filters.search}
            onChange={onChange}
          />
        </label>
        <label>
          Tech stack
          <input
            type="text"
            name="tech"
            placeholder="React, Node, MongoDB"
            value={filters.tech}
            onChange={onChange}
          />
        </label>
        <label>
          Tag
          <input
            type="text"
            name="tag"
            placeholder="AI, Full Stack, API"
            value={filters.tag}
            onChange={onChange}
          />
        </label>
      </div>
      <div className="button-row">
        <button type="submit" className="primary-button small-button">
          Search Projects
        </button>
        <button type="button" className="ghost-button" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
