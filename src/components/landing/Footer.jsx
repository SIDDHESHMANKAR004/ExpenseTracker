import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FOOTER_LINKS } from '../../data/landingData';

export default function Footer() {
  return (
    <footer className="ledger-footer">
      <div className="ledger-container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="ledger-logo" style={{ marginBottom: '0.8rem' }}>
              <span className="ledger-logo__mark">₹</span>
              MoneyVerge
            </div>
            <p style={{ maxWidth: '32ch', fontSize: '0.85rem' }}>
              A personal expense tracker with a dashboard, budgets, analytics, and reports built in.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            {FOOTER_LINKS.product.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            {FOOTER_LINKS.company.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MoneyVerge. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
