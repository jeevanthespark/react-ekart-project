import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Card,
  Input,
  Field,
  Dropdown,
  Option,
  Divider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Payment24Regular,
  Shield24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useCart } from '../stores/CartStore';
import { formatCurrency, isValidEmail, isValidPostalCode } from '../utils';
import { Address } from '../types';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '32px',
    textAlign: 'center',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '&.selected': {
      border: `2px solid ${tokens.colorBrandStroke1}`,
      backgroundColor: tokens.colorBrandBackground2,
    },
  },
  orderSummary: {
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
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    padding: '8px 0',
  },
  summaryItemImage: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusSmall,
    objectFit: 'cover',
  },
  summaryItemInfo: {
    flex: 1,
    marginLeft: '12px',
  },
  summaryItemName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  summaryItemDetails: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  summaryTotal: {
    fontSize: '18px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
  },
  placeOrderButton: {
    width: '100%',
    marginTop: '16px',
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    marginTop: '12px',
  },
  successMessage: {
    textAlign: 'center',
    padding: '64px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  successIcon: {
    fontSize: '64px',
    color: tokens.colorPaletteGreenForeground1,
  },
});

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  billingAddress?: Address;
  sameAsShipping: boolean;
  paymentMethod: 'credit_card' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const CheckoutPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
    sameAsShipping: true,
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';

    // Address validation
    if (!formData.address.firstName) errors.shippingFirstName = 'First name is required';
    if (!formData.address.lastName) errors.shippingLastName = 'Last name is required';
    if (!formData.address.addressLine1) errors.addressLine1 = 'Address is required';
    if (!formData.address.city) errors.city = 'City is required';
    if (!formData.address.state) errors.state = 'State is required';
    if (!formData.address.postalCode) {
      errors.postalCode = 'Postal code is required';
    } else if (!isValidPostalCode(formData.address.postalCode)) {
      errors.postalCode = 'Please enter a valid postal code';
    }

    // Payment validation
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber) errors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) errors.cvv = 'CVV is required';
      if (!formData.cardholderName) errors.cardholderName = 'Cardholder name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing (short-circuit in tests for speed/stability)
      const delay = process.env.NODE_ENV === 'test' ? 0 : 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0 && !orderComplete) {
    navigate('/');
    return null;
  }

  if (orderComplete) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.successMessage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckmarkCircle24Regular className={styles.successIcon} />
          <Text size={700}>Order Placed Successfully!</Text>
          <Text size={400} style={{ color: tokens.colorNeutralForeground2 }}>
            Thank you for your purchase. You will receive a confirmation email shortly.
          </Text>
          <Button
            appearance="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text className={styles.title}>Checkout</Text>
      </motion.div>

      <div className={styles.content}>
        {/* Checkout Form */}
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Contact Information */}
          <Card className={styles.section}>
            <Text className={styles.sectionTitle}>Contact Information</Text>
            <Field
              label="Email"
              required
              validationMessage={formErrors.email}
              validationState={formErrors.email ? 'error' : 'none'}
            >
              <Input
                value={formData.email}
                onChange={(_, data) => handleInputChange('email', data.value)}
                placeholder="Enter your email address"
              />
            </Field>
            {/* Added missing customer name fields (previously validated but no inputs) */}
            <div className={styles.formRow}>
              <Field
                label="First Name"
                required
                validationMessage={formErrors.firstName}
                validationState={formErrors.firstName ? 'error' : 'none'}
              >
                <Input
                  value={formData.firstName}
                  onChange={(_, data) => handleInputChange('firstName', data.value)}
                  placeholder="First name"
                />
              </Field>
              <Field
                label="Last Name"
                required
                validationMessage={formErrors.lastName}
                validationState={formErrors.lastName ? 'error' : 'none'}
              >
                <Input
                  value={formData.lastName}
                  onChange={(_, data) => handleInputChange('lastName', data.value)}
                  placeholder="Last name"
                />
              </Field>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className={styles.section}>
            <Text className={styles.sectionTitle}>Shipping Address</Text>
            <div className={styles.formRow}>
              <Field
                label="First Name"
                required
                validationMessage={formErrors.shippingFirstName}
                validationState={formErrors.shippingFirstName ? 'error' : 'none'}
              >
                <Input
                  value={formData.address.firstName}
                  onChange={(_, data) => handleAddressChange('firstName', data.value)}
                  placeholder="Shipping first name"
                />
              </Field>
              <Field
                label="Last Name"
                required
                validationMessage={formErrors.shippingLastName}
                validationState={formErrors.shippingLastName ? 'error' : 'none'}
              >
                <Input
                  value={formData.address.lastName}
                  onChange={(_, data) => handleAddressChange('lastName', data.value)}
                  placeholder="Shipping last name"
                />
              </Field>
            </div>
            <Field
              label="Address"
              required
              validationMessage={formErrors.addressLine1}
              validationState={formErrors.addressLine1 ? 'error' : 'none'}
            >
              <Input
                value={formData.address.addressLine1}
                onChange={(_, data) => handleAddressChange('addressLine1', data.value)}
                placeholder="Street address"
              />
            </Field>
            <Field label="Apartment, suite, etc. (optional)">
              <Input
                value={formData.address.addressLine2 || ''}
                onChange={(_, data) => handleAddressChange('addressLine2', data.value)}
              />
            </Field>
            <div className={styles.formRow}>
              <Field
                label="City"
                required
                validationMessage={formErrors.city}
                validationState={formErrors.city ? 'error' : 'none'}
              >
                <Input
                  value={formData.address.city}
                  onChange={(_, data) => handleAddressChange('city', data.value)}
                  placeholder="City"
                />
              </Field>
              <Field
                label="State"
                required
                validationMessage={formErrors.state}
                validationState={formErrors.state ? 'error' : 'none'}
              >
                <Input
                  value={formData.address.state}
                  onChange={(_, data) => handleAddressChange('state', data.value)}
                  placeholder="State"
                />
              </Field>
            </div>
            <div className={styles.formRow}>
              <Field
                label="Postal Code"
                required
                validationMessage={formErrors.postalCode}
                validationState={formErrors.postalCode ? 'error' : 'none'}
              >
                <Input
                  value={formData.address.postalCode}
                  onChange={(_, data) => handleAddressChange('postalCode', data.value)}
                  placeholder="Postal code"
                />
              </Field>
              <Field label="Country">
                <Dropdown
                  value="United States"
                  onOptionSelect={(_, data) => handleAddressChange('country', data.optionValue as string)}
                >
                  <Option value="US">United States</Option>
                  <Option value="CA">Canada</Option>
                  <Option value="UK">United Kingdom</Option>
                </Dropdown>
              </Field>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Payment24Regular />
              Payment Information
            </Text>
            
            <div style={{ marginBottom: '16px' }}>
              <div
                className={`${styles.paymentMethod} ${
                  formData.paymentMethod === 'credit_card' ? 'selected' : ''
                }`}
                onClick={() => handleInputChange('paymentMethod', 'credit_card')}
              >
                <input
                  type="radio"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={() => {}}
                />
                <Text>Credit Card</Text>
              </div>
            </div>

            {formData.paymentMethod === 'credit_card' && (
              <>
                <Field
                  label="Cardholder Name"
                  required
                  validationMessage={formErrors.cardholderName}
                  validationState={formErrors.cardholderName ? 'error' : 'none'}
                >
                  <Input
                    value={formData.cardholderName}
                    onChange={(_, data) => handleInputChange('cardholderName', data.value)}
                    placeholder="Name on card"
                  />
                </Field>
                <Field
                  label="Card Number"
                  required
                  validationMessage={formErrors.cardNumber}
                  validationState={formErrors.cardNumber ? 'error' : 'none'}
                >
                  <Input
                    value={formData.cardNumber}
                    onChange={(_, data) => handleInputChange('cardNumber', data.value)}
                    placeholder="1234 5678 9012 3456"
                  />
                </Field>
                <div className={styles.formRow}>
                  <Field
                    label="Expiry Date"
                    required
                    validationMessage={formErrors.expiryDate}
                    validationState={formErrors.expiryDate ? 'error' : 'none'}
                  >
                    <Input
                      value={formData.expiryDate}
                      onChange={(_, data) => handleInputChange('expiryDate', data.value)}
                      placeholder="MM/YY"
                    />
                  </Field>
                  <Field
                    label="CVV"
                    required
                    validationMessage={formErrors.cvv}
                    validationState={formErrors.cvv ? 'error' : 'none'}
                  >
                    <Input
                      value={formData.cvv}
                      onChange={(_, data) => handleInputChange('cvv', data.value)}
                      placeholder="123"
                    />
                  </Field>
                </div>
              </>
            )}

            <div className={styles.securityBadge}>
              <Shield24Regular />
              <Text>Your payment information is secure and encrypted</Text>
            </div>
          </Card>
        </motion.form>

        {/* Order Summary */}
        <motion.div
          className={styles.orderSummary}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={styles.summaryCard}>
            <Text className={styles.summaryTitle}>Order Summary</Text>
            
            {/* Items */}
            {cart.items.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className={styles.summaryItemImage}
                />
                <div className={styles.summaryItemInfo}>
                  <div className={styles.summaryItemName}>{item.product.name}</div>
                  <div className={styles.summaryItemDetails}>
                    Qty: {item.quantity} × {formatCurrency(item.product.price)}
                  </div>
                </div>
                <Text>{formatCurrency(item.product.price * item.quantity)}</Text>
              </div>
            ))}

            <Divider style={{ margin: '16px 0' }} />

            {/* Totals */}
            <div className={styles.summaryItem}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(cart.subtotal)}</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text>Shipping</Text>
              <Text>{formatCurrency(cart.shipping)}</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text>Tax</Text>
              <Text>{formatCurrency(cart.tax)}</Text>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <div className={styles.summaryItem}>
              <Text className={styles.summaryTotal}>Total</Text>
              <Text className={styles.summaryTotal}>{formatCurrency(cart.total)}</Text>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              appearance="primary"
              size="large"
              className={styles.placeOrderButton}
              disabled={isProcessing}
              onClick={handleSubmit}
            >
              {isProcessing ? 'Processing...' : `Place Order - ${formatCurrency(cart.total)}`}
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;