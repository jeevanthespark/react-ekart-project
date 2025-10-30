import React from 'react';
import {
  Card,
  CardPreview,
  Button,
  Badge,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Cart24Regular,
  Star24Filled,
  Star24Regular,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { formatCurrency, calculateDiscount } from '@/utils';
import { useCart } from '@/stores/CartStore';

const useStyles = makeStyles({
  card: {
    width: '100%',
    maxWidth: '300px',
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    height: '200px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 1,
  },
  content: {
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  description: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    flex: 1,
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
  },
  originalPrice: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorPaletteGreenForeground1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  addToCartButton: {
    flex: 1,
  },
  outOfStock: {
    opacity: 0.6,
    position: 'relative',
    '&::after': {
      content: '"Out of Stock"',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: tokens.borderRadiusSmall,
      fontSize: '12px',
      fontWeight: '600',
      zIndex: 2,
    },
  },
});

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
}) => {
  const styles = useStyles();
  const { addItem, isItemInCart } = useCart();

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // const hasHalfStar = rating % 1 >= 0.5; // TODO: Implement half star

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star24Filled key={i} style={{ color: tokens.colorPaletteYellowForeground1 }} />
        );
      } else {
        stars.push(
          <Star24Regular key={i} style={{ color: tokens.colorNeutralForeground3 }} />
        );
      }
    }

    return stars;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock) {
      addItem(product);
    }
  };

  const handleCardClick = () => {
    onProductClick?.(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className={`${styles.card} ${!product.inStock ? styles.outOfStock : ''}`}
        onClick={handleCardClick}
      >
        <CardPreview className={styles.imageContainer}>
          {discount > 0 && (
            <Badge
              className={styles.badge}
              color="danger"
              size="small"
            >
              -{discount}%
            </Badge>
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        </CardPreview>

        <div className={styles.content}>
          <Text className={styles.title}>{product.name}</Text>
          <Text className={styles.description}>{product.description}</Text>

          <div className={styles.rating}>
            {renderStars(product.rating)}
            <Text size={200}>({product.reviewCount})</Text>
          </div>

          <div className={styles.priceContainer}>
            <Text className={styles.price}>{formatCurrency(product.price)}</Text>
            {product.originalPrice && (
              <>
                <Text className={styles.originalPrice}>
                  {formatCurrency(product.originalPrice)}
                </Text>
                <Text className={styles.discount}>Save {discount}%</Text>
              </>
            )}
          </div>

          <div className={styles.footer}>
            <Button
              appearance="primary"
              icon={<Cart24Regular />}
              className={styles.addToCartButton}
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              {isItemInCart(product.id)
                ? 'Added to Cart'
                : product.inStock
                ? 'Add to Cart'
                : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
