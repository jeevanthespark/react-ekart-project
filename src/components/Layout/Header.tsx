import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Cart24Regular,
  Search24Regular,
  Person24Regular,
  Home24Regular,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useCart } from '@/stores/CartStore';
import { formatCurrency } from '@/utils';

const useStyles = makeStyles({
  header: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  activeNavLink: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
  },
  searchContainer: {
    flex: '1',
    maxWidth: '400px',
    margin: '0 32px',
    position: 'relative',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cartButton: {
    position: 'relative',
  },
  cartPreview: {
    minWidth: '300px',
    padding: '16px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  cartItemImage: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusSmall,
    objectFit: 'cover',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartTotal: {
    padding: '12px 0',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '24px',
    color: tokens.colorNeutralForeground2,
  },
  mobileNav: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  desktopNav: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

const Header = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const isActivePath = (path: string) => location.pathname === path;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <Home24Regular />
          eKart
        </Link>

        {/* Search */}
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(_, data) => setSearchQuery(data.value)}
              contentBefore={<Search24Regular />}
              size="large"
            />
          </form>
        </div>

        {/* Navigation */}
        <nav className={`${styles.nav} ${styles.desktopNav}`}>
          <Link
            to="/"
            className={`${styles.navLink} ${
              isActivePath('/') ? styles.activeNavLink : ''
            }`}
          >
            Home
          </Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Cart */}
          <Popover withArrow positioning="below-end">
            <PopoverTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={
                  <div style={{ position: 'relative' }}>
                    <Cart24Regular />
                    {cart.totalItems > 0 && (
                      <Badge
                        color="brand"
                        size="small"
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          minWidth: '16px',
                          height: '16px',
                          fontSize: '10px',
                        }}
                      >
                        {cart.totalItems}
                      </Badge>
                    )}
                  </div>
                }
                className={styles.cartButton}
              />
            </PopoverTrigger>
            <PopoverSurface className={styles.cartPreview}>
              {cart.items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <Cart24Regular style={{ fontSize: '32px', marginBottom: '8px' }} />
                  <div>Your cart is empty</div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px', fontWeight: '600' }}>
                    Cart ({cart.totalItems} items)
                  </div>
                  {cart.items.slice(0, 3).map(item => (
                    <div key={item.id} className={styles.cartItem}>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className={styles.cartItemImage}
                      />
                      <div className={styles.cartItemInfo}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          {item.product.name}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: tokens.colorNeutralForeground2,
                          }}
                        >
                          Qty: {item.quantity} × {formatCurrency(item.product.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '8px 0',
                        fontSize: '12px',
                        color: tokens.colorNeutralForeground2,
                      }}
                    >
                      +{cart.items.length - 3} more items
                    </div>
                  )}
                  <div className={styles.cartTotal}>
                    <span>Total:</span>
                    <span>{formatCurrency(cart.total)}</span>
                  </div>
                  <Button
                    onClick={() => navigate('/cart')}
                    appearance="primary"
                    size="large"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    View Cart
                  </Button>
                </>
              )}
            </PopoverSurface>
          </Popover>

          {/* User Account */}
          <Button
            appearance="subtle"
            icon={<Person24Regular />}
            aria-label="User account"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
