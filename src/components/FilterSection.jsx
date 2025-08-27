import './FilterSection.css'

function FilterSection({ sortBy, setSortBy, filterYear, setFilterYear, availableYears, searchQuery, totalResults }) {
  return (
    <div className="filter-section">
      <div className="filter-header">
        <h2>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
        </h2>
        <p className="filter-subtitle">
          {searchQuery && totalResults > 0 ? 
            `Found ${totalResults} movies - Refine your search below` : 
            'Refine your search to find exactly what you\'re looking for'
          }
        </p>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="year-desc">Year (Newest)</option>
            <option value="year-asc">Year (Oldest)</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="year-select">Filter by Year:</label>
          <select
            id="year-select"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        {filterYear && (
          <button
            onClick={() => setFilterYear('')}
            className="clear-filter-button"
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterSection