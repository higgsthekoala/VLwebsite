import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';

// Custom Link component for SSE
const Link = ({ 
  href, 
  children, 
  className, 
  onClick 
}: { 
  href: string, 
  children: React.ReactNode,
  className?: string,
  onClick?: () => void 
}) => (
  <a 
    href={href} 
    className={className}
    onClick={(e) => {
      e.preventDefault();
      onClick?.();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('popstate'));
    }}
  >
    {children}
  </a>
);

// Scroll progress handler
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollY / height) * 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return progress;
};

// Animation variants
const menuVariants = {
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
};

const menuItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const socialItemVariants = {
  closed: { opacity: 0, y: 10 },
  open: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Header Component
export function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();

  const navItems = [
    { label: 'Work', href: '/work' },
    { label: 'Studio', href: '/studio' },
    { label: 'Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-background/20 z-[60]">
        <div
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link href="/" className="text-2xl font-black tracking-tight text-foreground hover:text-accent transition-colors relative group">
            <motion.span whileHover={{ letterSpacing: "0.1em" }} transition={{ duration: 0.3 }}>
              VOIDLIGHT
            </motion.span>
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-accent"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-foreground hover:text-accent transition-colors font-medium relative group"
              >
                <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  {item.label}
                </motion.span>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Right side icons */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ShoppingCart className="w-6 h-6 text-foreground hover:text-accent transition-colors cursor-pointer" />
            <motion.span
              className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.8 }}
            >
              0
            </motion.span>
          </motion.div>

          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground hover:text-accent transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-background border-t border-border overflow-hidden"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.nav className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block text-foreground hover:text-accent transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.span whileHover={{ x: 10 }} transition={{ duration: 0.2 }}>
                      {item.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="pt-4 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-muted-foreground mb-2">Socials</p>
                <div className="space-y-2">
                  {['Instagram', 'Facebook', 'LinkedIn', 'Spotify'].map((social, index) => (
                    <motion.div
                      key={social}
                      variants={socialItemVariants}
                      initial="closed"
                      animate="open"
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <a href="#" className="block text-sm text-foreground hover:text-accent transition-colors py-1">
                        <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                          {social}
                        </motion.span>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export class Header {
  init(container: Element) {
    const root = document.createElement('div');
    container.appendChild(root);
    const reactRoot = ReactDOM.createRoot(root);
    reactRoot.render(<HeaderComponent />);
  }
}