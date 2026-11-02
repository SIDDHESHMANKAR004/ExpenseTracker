import React from 'react';
import { motion } from 'framer-motion';
import {
  SiReact, SiBootstrap, SiFirebase, SiJavascript,
} from 'react-icons/si';
import { HiOutlineChartPie, HiOutlineSwitchHorizontal, HiOutlineDeviceMobile, HiOutlineCode } from 'react-icons/hi';

const ICONS = {
  'React.js': SiReact,
  Bootstrap: SiBootstrap,
  Firebase: SiFirebase,
  Firestore: SiFirebase,
  'React Router': HiOutlineSwitchHorizontal,
  'Chart.js': HiOutlineChartPie,
  JavaScript: SiJavascript,
  'Responsive Design': HiOutlineDeviceMobile,
};

import { TECH_STACK } from '../../data/landingData';

export default function TechStack() {
  return (
    <section className="ledger-section">
      <div className="ledger-container">
        <span className="section-eyebrow">Under the hood</span>
        <h2 className="section-heading">Technology stack</h2>
        <p className="section-lede">Built with tools chosen for speed, not resume padding.</p>

        <div className="tech-grid">
          {TECH_STACK.map((t, i) => {
            const Icon = ICONS[t.name] || HiOutlineCode;
            return (
              <motion.div
                className="tech-card"
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <span className="icon"><Icon /></span>
                <span className="name">{t.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
