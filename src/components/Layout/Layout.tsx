import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    paddingTop: '80px', // Account for fixed header
  },
});

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <motion.div
      className={styles.layout}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </motion.div>
  );
};

export default Layout;
