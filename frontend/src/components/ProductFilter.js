import React, { useState, useEffect, useCallback } from "react";

const ProductFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });
  
  // Separate state for search input to allow typing without triggering search
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  
  const [metadata, setMetadata] = useState({
    categories: [],
    brands: [],
    priceRange: { minPrice: 0, maxPrice: 1000 }
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    getProductMetadata();
    // Sync search input with initial filters
    setSearchInput(initialFilters.search || '');
  }, [initialFilters.search]);

  const getProductMetadata = async () => {
    try {
      const response = await fetch("http://localhost:5000/products/meta");
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      }
    } catch (error) {
      console.error("Failed to fetch product metadata:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Only trigger search for non-search filters (immediate feedback for dropdowns)
    if (key !== 'search') {
      onFilterChange(newFilters);
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    // Update the search filter but don't trigger search yet
    setFilters(prev => ({ ...prev, search: value }));
  };

  const executeSearch = useCallback(() => {
    // Trigger search with current filters including search input
    const searchFilters = { ...filters, search: searchInput };
    onFilterChange(searchFilters);
  }, [filters, searchInput, onFilterChange]);

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: 'all',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
    setSearchInput('');
    onFilterChange(resetFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <div className="product-filter">
      <form onSubmit={handleSubmit} className="filter-form">
        {/* Basic Search */}
        <div className="basic-search">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeSearch();
                }
              }}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </div>
          
          <button
            type="button"
            className="toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '↑ Hide Filters' : '↓ Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-row">
              {/* Category Filter */}
              <div className="filter-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {metadata.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="filter-group">
                <label htmlFor="brand">Brand</label>
                <select
                  id="brand"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="all">All Brands</option>
                  {metadata.brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="filter-group">
                <label htmlFor="sortBy">Sort By</label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="createdAt">Date Added</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="views">Popularity</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="filter-group">
                <label htmlFor="sortOrder">Order</label>
                <select
                  id="sortOrder"
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <option value="desc">
                    {filters.sortBy === 'price' ? 'High to Low' : 
                     filters.sortBy === 'name' ? 'Z to A' : 'Newest First'}
                  </option>
                  <option value="asc">
                    {filters.sortBy === 'price' ? 'Low to High' : 
                     filters.sortBy === 'name' ? 'A to Z' : 'Oldest First'}
                  </option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-row">
              <div className="filter-group price-range">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder={`Min ($${metadata.priceRange.minPrice})`}
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    min="0"
                    max={metadata.priceRange.maxPrice}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder={`Max ($${metadata.priceRange.maxPrice})`}
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    min={filters.minPrice || 0}
                    max={metadata.priceRange.maxPrice}
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button type="submit" className="apply-btn">
                  Apply Filters
                </button>
                <button type="button" onClick={handleReset} className="reset-btn">
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductFilter;
