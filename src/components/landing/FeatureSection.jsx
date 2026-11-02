import React from 'react';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import ImagePlaceholder from './ImagePlaceholder';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function FeatureSection({ section, raised }) {
  return (
    <section id={section.id} className={`ledger-section${raised ? ' ledger-section--raised' : ''}`}>
      <div className="ledger-container">
        <div className={`feature-section__grid${section.reversed ? ' is-reversed' : ''}`}>
          <motion.div
            className="feature-section__copy"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="section-eyebrow">{section.eyebrow}</span>
            <h2 className="section-heading" style={{ maxWidth: '16ch' }}>{section.title}</h2>
            <p className="section-lede">{section.lede}</p>

            <ul className="feature-list">
              {section.points.map((point) => (
                <li key={point}>
                  <span className="check"><HiCheck /></span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="feature-section__media"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <ImagePlaceholder
              src={section.imageRequired.src}
              title={section.imageRequired.title}
              detail={section.imageRequired.detail}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
