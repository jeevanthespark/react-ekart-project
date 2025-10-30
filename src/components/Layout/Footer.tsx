import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Link,
  Divider,
} from '@fluentui/react-components';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  footer: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 16px 24px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    marginBottom: '32px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '8px',
  },
  link: {
    color: tokens.colorNeutralForeground2,
    textDecoration: 'none',
    fontSize: '14px',
    '&:hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '24px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '16px',
      textAlign: 'center',
    },
  },
  logo: {
    fontWeight: '700',
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  copyright: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
  social: {
    display: 'flex',
    gap: '16px',
  },
});

const Footer: React.FC = () => {
  const styles = useStyles();

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {/* About Section */}
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>About eKart</Text>
            <Text as="p" size={300}>
              Modern ecommerce platform built with cutting-edge technology
              to provide the best shopping experience.
            </Text>
            <div className={styles.social}>
              <Link className={styles.link} href="#">
                Facebook
              </Link>
              <Link className={styles.link} href="#">
                Twitter
              </Link>
              <Link className={styles.link} href="#">
                Instagram
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>Customer Service</Text>
            <Link className={styles.link} href="#">
              Contact Us
            </Link>
            <Link className={styles.link} href="#">
              Help Center
            </Link>
            <Link className={styles.link} href="#">
              Returns & Exchanges
            </Link>
            <Link className={styles.link} href="#">
              Shipping Info
            </Link>
            <Link className={styles.link} href="#">
              Size Guide
            </Link>
          </div>

          {/* Company */}
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>Company</Text>
            <Link className={styles.link} href="#">
              About Us
            </Link>
            <Link className={styles.link} href="#">
              Careers
            </Link>
            <Link className={styles.link} href="#">
              Press
            </Link>
            <Link className={styles.link} href="#">
              Investor Relations
            </Link>
            <Link className={styles.link} href="#">
              Sustainability
            </Link>
          </div>

          {/* Legal */}
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>Legal</Text>
            <Link className={styles.link} href="#">
              Privacy Policy
            </Link>
            <Link className={styles.link} href="#">
              Terms of Service
            </Link>
            <Link className={styles.link} href="#">
              Cookie Policy
            </Link>
            <Link className={styles.link} href="#">
              Accessibility
            </Link>
          </div>
        </div>

        <Divider />

        <div className={styles.bottom}>
          <div className={styles.logo}>eKart</div>
          <Text className={styles.copyright}>
            © 2024 eKart. All rights reserved.
          </Text>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
