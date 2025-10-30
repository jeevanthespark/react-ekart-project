import { useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Card,
  Divider,
  makeStyles,
  tokens,
  SpinButton,
} from '@fluentui/react-components';
import {
  Delete24Regular,
  ArrowLeft24Regular,
  ShoppingBag24Regular,
} from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/stores/CartStore';
import { formatCurrency } from '@/utils';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  backButton: {
    marginBottom: '16px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '32px',
    '@media (max-width: 968px)': {
      gridTemplateColumns: '1fr',
      gap: '24px',
    },
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: tokens.borderRadiusSmall,
    objectFit: 'cover',
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  itemTotal: {
    fontSize: '16px',
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'right',
  },
  summary: {
    position: 'sticky',
    top: '100px',
    height: 'fit-content',
  },
  summaryCard: {
    padding: '24px',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  summaryTotal: {
    fontSize: '18px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
  },
  checkoutButton: {
    width: '100%',
    marginTop: '16px',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '64px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '64px',
    color: tokens.colorNeutralForeground3,
  },
  freeShipping: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: '12px',
    fontWeight: '500',
  },
});

const CartPage = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.emptyCart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag24Regular className={styles.emptyIcon} />
          <Text size={600}>Your cart is empty</Text>
          <Text size={400} style={{ color: tokens.colorNeutralForeground2 }}>
            Looks like you haven't added any products to your cart yet.
          </Text>
          <Button onClick={() => navigate('/')} appearance="primary" size="large">
            Continue Shopping
          </Button>
        </motion.div>
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
        <Button
          onClick={() => navigate('/')}
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          className={styles.backButton}
        >
          Continue Shopping
        </Button>
        <Text className={styles.title}>Shopping Cart ({cart.totalItems} items)</Text>
      </motion.div>

      {/* Content */}
      <div className={styles.content}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          <AnimatePresence>
            {cart.items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={styles.cartItem}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className={styles.itemImage}
                  />
                  
                  <div className={styles.itemInfo}>
                    <Text className={styles.itemName}>{item.product.name}</Text>
                    <Text className={styles.itemPrice}>
                      {formatCurrency(item.product.price)} each
                    </Text>
                    <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                      {item.product.category.name}
                    </Text>
                  </div>

                  <div className={styles.itemControls}>
                    <div className={styles.quantityContainer}>
                      <Text size={300}>Qty:</Text>
                      <SpinButton
                        value={item.quantity}
                        min={1}
                        max={99}
                        step={1}
                        onChange={(_, data) => {
                          if (data.value !== undefined && data.value !== null) {
                            handleQuantityChange(item.productId, data.value);
                          }
                        }}
                      />
                    </div>
                    
                    <Button
                      appearance="subtle"
                      icon={<Delete24Regular />}
                      onClick={() => handleRemoveItem(item.productId)}
                      aria-label="Remove item"
                    />
                  </div>

                  <Text className={styles.itemTotal}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </Text>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Clear Cart */}
          {cart.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                appearance="outline"
                onClick={clearCart}
                style={{ alignSelf: 'flex-start' }}
              >
                Clear Cart
              </Button>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <motion.div
          className={styles.summary}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={styles.summaryCard}>
            <Text className={styles.summaryTitle}>Order Summary</Text>
            
            <div className={styles.summaryRow}>
              <Text>Subtotal ({cart.totalItems} items)</Text>
              <Text>{formatCurrency(cart.subtotal)}</Text>
            </div>
            
            <div className={styles.summaryRow}>
              <Text>Shipping</Text>
              <div style={{ textAlign: 'right' }}>
                <Text>{formatCurrency(cart.shipping)}</Text>
                {cart.shipping === 0 && (
                  <div className={styles.freeShipping}>Free shipping!</div>
                )}
              </div>
            </div>
            
            <div className={styles.summaryRow}>
              <Text>Tax</Text>
              <Text>{formatCurrency(cart.tax)}</Text>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <div className={styles.summaryRow}>
              <Text className={styles.summaryTotal}>Total</Text>
              <Text className={styles.summaryTotal}>{formatCurrency(cart.total)}</Text>
            </div>
            
            <Button
              onClick={() => navigate('/checkout')}
              appearance="primary"
              size="large"
              className={styles.checkoutButton}
            >
              Proceed to Checkout
            </Button>
            
            {cart.subtotal < 75 && (
              <Text
                size={200}
                style={{
                  textAlign: 'center',
                  marginTop: '12px',
                  color: tokens.colorNeutralForeground2,
                }}
              >
                Add {formatCurrency(75 - cart.subtotal)} more for free shipping
              </Text>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
