import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlinePlay } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section id="get-started" className="ledger-section">
      <div className="ledger-container">
        <motion.div
          className="final-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Start managing your money smarter</h2>
          <p>Dashboard, budgets, and reports — all set up in the time it takes to read this page.</p>
          <div className="ledger-hero__ctas">
            <Link to="/onboarding" className="btn-ledger btn-ledger--primary">
              Get Started <HiOutlineArrowRight />
            </Link>
            <a href="#dashboard" className="btn-ledger btn-ledger--ghost">
              <HiOutlinePlay /> Explore Demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
