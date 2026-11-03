import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../data/landingData';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="ledger-navbar ">
      <div className="ledger-navbar__inner">
        <a href="#home" className="ledger-logo" onClick={() => setOpen(false)}>
          <span className="ledger-logo__mark">₹</span>
          MoneyVerge
        </a>

        <nav className="ledger-navlinks ledger-navlinks--desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="ledger-navlinks--desktop" style={{ display: 'flex' }}>
          <Link to="/onboarding" className="btn-ledger btn-ledger--primary">
            Get Started
          </Link>
        </div>

        <button
          className="navbar-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <HiX size={20} /> : <HiMenu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ledger-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ledger-mobile-menu__inner">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              <Link to="/onboarding" className="btn-ledger btn-ledger--primary" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
