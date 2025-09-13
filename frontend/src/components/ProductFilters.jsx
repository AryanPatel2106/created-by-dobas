import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, Star, DollarSign, Tag, Package } from 'lucide-react';

const ProductFilters = ({ onFilterChange, activeFilters = {}, productCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    availability: true
  });

  const categories = [
    { id: 'all', name: 'All Products', count: productCount },
    { id: 'cards', name: 'Greeting Cards', count: 0 },
    { id: 'frames', name: 'Photo Frames', count: 0 },
    { id: 'journals', name: 'Journals & Books', count: 0 },
    { id: 'shadow-boxes', name: 'Shadow Boxes', count: 0 },
    { id: 'family-trees', name: 'Family Tree Art', count: 0 },
    { id: 'gifts', name: 'Custom Gifts', count: 0 }
  ];

  const priceRanges = [
    { id: 'all', label: 'All Prices', min: null, max: null },
    { id: 'under-25', label: 'Under $25', min: 0, max: 25 },
    { id: '25-50', label: '$25 - $50', min: 25, max: 50 },
    { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { id: 'over-100', label: 'Over $100', min: 100, max: null }
  ];

  const ratingOptions = [
    { id: 'all', label: 'All Ratings', value: 'all' },
    { id: '5-stars', label: '5 Stars', value: '5' },
    { id: '4-plus', label: '4+ Stars', value: '4+' },
    { id: '3-plus', label: '3+ Stars', value: '3+' },
    { id: '2-plus', label: '2+ Stars', value: '2+' }
  ];

  const availabilityOptions = [
    { id: 'in-stock', label: 'In Stock Only', key: 'inStock' },
    { id: 'on-sale', label: 'On Sale', key: 'onSale' },
    { id: 'customizable', label: 'Customizable', key: 'customizable' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'category') {
      newFilters.category = value;
    } else if (filterType === 'priceRange') {
      const range = priceRanges.find(r => r.id === value);
      newFilters.priceRange = {
        min: range?.min?.toString() || '',
        max: range?.max?.toString() || ''
      };
    } else if (filterType === 'rating') {
      newFilters.rating = value;
    } else if (filterType === 'availability') {
      newFilters[value] = !newFilters[value];
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: 'all',
      priceRange: { min: '', max: '' },
      rating: 'all',
      inStock: false,
      onSale: false,
      customizable: false
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category && activeFilters.category !== 'all') count++;
    if (activeFilters.priceRange?.min || activeFilters.priceRange?.max) count++;
    if (activeFilters.rating && activeFilters.rating !== 'all') count++;
    if (activeFilters.inStock) count++;
    if (activeFilters.onSale) count++;
    if (activeFilters.customizable) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const FilterSection = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </button>
      
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStars = (count) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="bg-[var(--theme-pink)] text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 sticky top-4">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              {activeCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[var(--theme-pink)] hover:text-pink-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Category Filter */}
            <FilterSection title="Category" icon={Tag} sectionKey="category">
              <div className="space-y-2">
                {categories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={activeFilters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)]"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Price Filter */}
            <FilterSection title="Price Range" icon={DollarSign} sectionKey="price">
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label
                    key={range.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.id}
                      checked={
                        (range.id === 'all' && !activeFilters.priceRange?.min && !activeFilters.priceRange?.max) ||
                        (activeFilters.priceRange?.min === range.min?.toString() && 
                         activeFilters.priceRange?.max === range.max?.toString())
                      }
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)] mr-2"
                    />
                    <span className="text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection title="Customer Rating" icon={Star} sectionKey="rating">
              <div className="space-y-2">
                {ratingOptions.map(option => (
                  <label
                    key={option.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={option.value}
                      checked={activeFilters.rating === option.value}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)] mr-2"
                    />
                    <div className="flex items-center gap-2">
                      {option.value !== 'all' && renderStars(option.value === '5' ? 5 : parseInt(option.value))}
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Availability Filter */}
            <FilterSection title="Availability" icon={Package} sectionKey="availability">
              <div className="space-y-2">
                {availabilityOptions.map(option => (
                  <label
                    key={option.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters[option.key] || false}
                      onChange={() => handleFilterChange('availability', option.key)}
                      className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)] rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-white w-80 h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {activeCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full mb-4 text-sm text-[var(--theme-pink)] hover:text-pink-600 transition-colors text-center"
                  >
                    Clear All Filters
                  </button>
                )}

                {/* Mobile filter content - same as desktop but in modal */}
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label
                          key={category.id}
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="category"
                              value={category.id}
                              checked={activeFilters.category === category.id}
                              onChange={(e) => handleFilterChange('category', e.target.value)}
                              className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)]"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">({category.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Price Range
                    </h3>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <label
                          key={range.id}
                          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            value={range.id}
                            checked={
                              (range.id === 'all' && !activeFilters.priceRange?.min && !activeFilters.priceRange?.max) ||
                              (activeFilters.priceRange?.min === range.min?.toString() && 
                               activeFilters.priceRange?.max === range.max?.toString())
                            }
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)] mr-2"
                          />
                          <span className="text-sm text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Customer Rating
                    </h3>
                    <div className="space-y-2">
                      {ratingOptions.map(option => (
                        <label
                          key={option.id}
                          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={option.value}
                            checked={activeFilters.rating === option.value}
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                            className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)] mr-2"
                          />
                          <div className="flex items-center gap-2">
                            {option.value !== 'all' && renderStars(option.value === '5' ? 5 : parseInt(option.value))}
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Availability
                    </h3>
                    <div className="space-y-2">
                      {availabilityOptions.map(option => (
                        <label
                          key={option.id}
                          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters[option.key] || false}
                            onChange={() => handleFilterChange('availability', option.key)}
                            className="text-[var(--theme-pink)] focus:ring-[var(--theme-pink)] rounded mr-2"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductFilters;
