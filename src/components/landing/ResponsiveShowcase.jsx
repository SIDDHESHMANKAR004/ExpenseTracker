import React from 'react';
import ImagePlaceholder from './ImagePlaceholder';
import { RESPONSIVE_SCREENSHOTS } from '../../data/landingData';

export default function ResponsiveShowcase() {
  return (
    <section className="ledger-section ledger-section--raised">
      <div className="ledger-container">
        <span className="section-eyebrow">One app, every screen</span>
        <h2 className="section-heading">Responsive experience</h2>
        <p className="section-lede">The same MoneyVerge, resized — not redesigned — for whatever you're holding.</p>

        <div className="responsive-grid">
          {RESPONSIVE_SCREENSHOTS.map((screenshot) => (
            <ImagePlaceholder
              key={screenshot.src}
              {...screenshot}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
