import { useState, useMemo } from 'react';
import {
  Text,
  Button,
  makeStyles,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import {
  Filter24Regular,
  Grid24Regular,
  List24Regular,
} from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/Product/ProductCard';
import ProductFilters from '@/components/Product/ProductFilters';
import { Product, ProductFilters as FilterType, SortOption } from '@/types';
import { mockProducts, mockCategories } from '@/data/mockData';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: '18px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '24px',
  },
  content: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },
  sidebar: {
    minWidth: '280px',
    position: 'sticky',
    top: '100px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mobileFilterButton: {
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  viewToggle: {
    display: 'flex',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    overflow: 'hidden',
  },
  viewButton: {
    border: 'none',
    padding: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&.active': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorBrandForeground1,
    },
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
    },
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
  },
  noResults: {
    textAlign: 'center',
    padding: '64px 24px',
    color: tokens.colorNeutralForeground2,
  },
  resultsCount: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
});

type ViewMode = 'grid' | 'list';

const HomePage: React.FC = () => {
  const styles = useStyles();
  const [filters, setFilters] = useState<FilterType>({
    category: [],
    priceRange: { min: 0, max: 500 },
  });
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockProducts];

    // Apply filters
    if (filters.category && filters.category.length > 0) {
      result = result.filter(product =>
        filters.category!.includes(product.category.id)
      );
    }

    if (filters.priceRange) {
      result = result.filter(
        product =>
          product.price >= filters.priceRange!.min &&
          product.price <= filters.priceRange!.max
      );
    }

    if (filters.rating) {
      result = result.filter(product => product.rating >= filters.rating!);
    }

    if (filters.inStock) {
      result = result.filter(product => product.inStock);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'price_low_to_high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_to_low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popularity':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return result;
  }, [filters, sortOption]);

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  const handleClearFilters = () => {
    setFilters({
      category: [],
      priceRange: { min: 0, max: 500 },
    });
    setSortOption('relevance');
  };

  const handleProductClick = (product: Product) => {
    // TODO: Navigate to product detail page
    console.log('Product clicked:', product);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" label="Loading products..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text className={styles.title}>Discover Amazing Products</Text>
        <Text className={styles.subtitle}>
          Find everything you need in our curated collection
        </Text>
      </motion.div>

      {/* Content */}
      <div className={styles.content}>
        {/* Desktop Sidebar */}
        <div className={styles.sidebar}>
          <ProductFilters
            filters={filters}
            sortOption={sortOption}
            categories={mockCategories}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            priceRange={{ min: 0, max: 500 }}
          />
        </div>

        {/* Main Content */}
        <div className={styles.main}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <Button
                appearance="outline"
                icon={<Filter24Regular />}
                className={styles.mobileFilterButton}
                onClick={() => setShowMobileFilters(true)}
              >
                Filters
              </Button>
              <Text className={styles.resultsCount}>
                {filteredAndSortedProducts.length} products found
              </Text>
            </div>
            <div className={styles.toolbarRight}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewButton} ${
                    viewMode === 'grid' ? 'active' : ''
                  }`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <Grid24Regular />
                </button>
                <button
                  className={`${styles.viewButton} ${
                    viewMode === 'list' ? 'active' : ''
                  }`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  title="List view"
                >
                  <List24Regular />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredAndSortedProducts.length === 0 ? (
            <motion.div
              className={styles.noResults}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text size={500}>No products found</Text>
              <Text size={300}>Try adjusting your filters or search terms</Text>
            </motion.div>
          ) : (
            <motion.div
              className={
                viewMode === 'grid' ? styles.productsGrid : styles.productsList
              }
              layout
              data-testid="products-container"
            >
              <AnimatePresence>
                {filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMobileFilters(false)}
        >
          <motion.div
            style={{
              backgroundColor: tokens.colorNeutralBackground1,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderTopLeftRadius: tokens.borderRadiusLarge,
              borderTopRightRadius: tokens.borderRadiusLarge,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <ProductFilters
              filters={filters}
              sortOption={sortOption}
              categories={mockCategories}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
              onClose={() => setShowMobileFilters(false)}
              priceRange={{ min: 0, max: 500 }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
