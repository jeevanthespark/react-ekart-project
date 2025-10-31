import React from 'react';
import {
  Dropdown,
  Option,
  Slider,
  Text,
  Checkbox,
  Button,
  makeStyles,
  tokens,
  Divider,
} from '@fluentui/react-components';
import {
  Filter24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { ProductFilters, SortOption, ProductCategory } from '@/types';
import { formatCurrency } from '@/utils';

const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '20px',
    minWidth: '280px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
  },
  priceRange: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    marginTop: '8px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  clearButton: {
    width: '100%',
    marginTop: '16px',
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
});

interface ProductFiltersProps {
  filters: ProductFilters;
  sortOption: SortOption;
  categories: ProductCategory[];
  onFiltersChange: (filters: ProductFilters) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  onClose?: () => void;
  priceRange?: { min: number; max: number };
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_low_to_high', label: 'Price: Low to High' },
  { value: 'price_high_to_low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' },
];

const ratingOptions = [
  { value: 4, label: '4+ Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 2, label: '2+ Stars' },
  { value: 1, label: '1+ Stars' },
];

const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  sortOption,
  categories,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  onClose,
  priceRange = { min: 0, max: 500 },
}) => {
  const styles = useStyles();

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: { min: value[0], max: value[1] },
    });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    const updatedCategories = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter(id => id !== categoryId);

    onFiltersChange({
      ...filters,
      category: updatedCategories,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked ? true : undefined,
    });
  };

  const hasActiveFilters = (
    filters.category?.length ||
    filters.priceRange ||
    filters.rating ||
    filters.inStock
  );

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mobile Header */}
      {onClose && (
        <div className={styles.mobileHeader}>
          <Text weight="semibold">Filters</Text>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={onClose}
          />
        </div>
      )}

      {/* Desktop Header */}
      <div className={styles.header}>
        <Text className={styles.title}>
          <Filter24Regular />
          Filters
        </Text>
      </div>

      {/* Sort */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Sort By</Text>
        <Dropdown
          value={sortOptions.find(opt => opt.value === sortOption)?.label}
          onOptionSelect={(_, data) =>
            onSortChange(data.optionValue as SortOption)
          }
        >
          {sortOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Dropdown>
      </div>

      <Divider />

      {/* Price Range */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Price Range</Text>
        <div style={{ marginBottom: '16px' }}>
          <Text>Min Price: ${filters.priceRange?.min || priceRange.min}</Text>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            value={filters.priceRange?.min || priceRange.min}
            onChange={(_, data) => handlePriceRangeChange([data.value, filters.priceRange?.max || priceRange.max])}
          />
        </div>
        <div>
          <Text>Max Price: ${filters.priceRange?.max || priceRange.max}</Text>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            value={filters.priceRange?.max || priceRange.max}
            onChange={(_, data) => handlePriceRangeChange([filters.priceRange?.min || priceRange.min, data.value])}
          />
        </div>
        <div className={styles.priceRange}>
          <span>{formatCurrency(filters.priceRange?.min || priceRange.min)}</span>
          <span>{formatCurrency(filters.priceRange?.max || priceRange.max)}</span>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Categories</Text>
        <div className={styles.categoryList}>
          {categories.map(category => (
            <Checkbox
              key={category.id}
              label={category.name}
              checked={filters.category?.includes(category.id) || false}
              onChange={(_, data) =>
                handleCategoryChange(category.id, data.checked === true)
              }
            />
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Customer Rating</Text>
        <div className={styles.ratingContainer}>
          {ratingOptions.map(option => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={filters.rating === option.value}
              onChange={() => handleRatingChange(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className={styles.section}>
        <Checkbox
          label="In Stock Only"
          checked={filters.inStock || false}
          onChange={(_, data) => handleInStockChange(data.checked === true)}
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          appearance="outline"
          className={styles.clearButton}
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      )}
    </motion.div>
  );
};

export default ProductFiltersComponent;
