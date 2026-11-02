import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../../data/landingData';

export default function Testimonials() {
  return (
    <section className="ledger-section">
      <div className="ledger-container">
        <span className="section-eyebrow">Users say</span>
        <h2 className="section-heading">What people are tracking</h2>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              className="testimonial-card"
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <p className="quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="person">
                {/* Avatar placeholder */}
                <div className="avatar-placeholder">IMG</div>
                <div>
                  <div className="name">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
