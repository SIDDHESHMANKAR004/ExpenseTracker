import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_STEPS } from '../../data/landingData';

export default function HowItWorks() {
  return (
    <section className="ledger-section ledger-section--raised">
      <div className="ledger-container">
        <span className="section-eyebrow">Getting started</span>
        <h2 className="section-heading">How it works</h2>
        <p className="section-lede">Six steps from sign-up to a budget that actually holds.</p>

        <div className="timeline">
          {TIMELINE_STEPS.map((step, i) => (
            <motion.div
              className="timeline__step"
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="timeline__num mono">{String(i + 1).padStart(2, '0')}</div>
              <div className="timeline__title">{step.title}</div>
              <div className="timeline__desc">{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
