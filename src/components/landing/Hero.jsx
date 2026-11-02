import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlinePlay } from 'react-icons/hi';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { HERO_STATS } from '../../data/landingData';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const rows = [
  { cat: 'Salary', color: 'var(--income)', date: 'Jul 01', amt: '+₹65,000', type: 'income' },
  { cat: 'Rent', color: 'var(--expense)', date: 'Jul 02', amt: '-₹18,000', type: 'expense' },
  { cat: 'Groceries', color: 'var(--expense)', date: 'Jul 05', amt: '-₹3,240', type: 'expense' },
  { cat: 'Freelance', color: 'var(--income)', date: 'Jul 09', amt: '+₹12,500', type: 'income' },
];

export default function Hero() {
  return (
    <section id="home" className="ledger-hero">
      <div className="ledger-container ledger-hero__grid">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="ledger-hero__eyebrow">
            <span className="dot" /> Now tracking every rupee, automatically
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}>
            Your money, kept like <em>a real ledger</em>.
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="ledger-hero__sub">
            One dashboard for income, expenses, budgets, and reports — the
            same app you'll use after you sign in, not a marketing preview
            of it.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="ledger-hero__ctas">
            <Link to="/onboarding" className="btn-ledger btn-ledger--primary">
              Get Started <HiOutlineArrowRight />
            </Link>
            <a href="#dashboard" className="btn-ledger btn-ledger--ghost">
              <HiOutlinePlay /> Explore Demo
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="ledger-hero__stats">
            {HERO_STATS.map((s) => (
              <div className="ledger-hero__stat" key={s.label}>
                <div className="figure mono">{s.figure}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="ledger-sheet">
            <div className="ledger-sheet__header">
              <span className="title">Dashboard — July</span>
              <span className="ledger-sheet__dots">
                <span /><span /><span />
              </span>
            </div>

            <div className="ledger-sheet__summary">
              <div className="ledger-sheet__summary-cell income">
                <div className="label">Income</div>
                <div className="figure mono">₹77,500</div>
              </div>
              <div className="ledger-sheet__summary-cell expense">
                <div className="label">Expenses</div>
                <div className="figure mono">₹31,240</div>
              </div>
              <div className="ledger-sheet__summary-cell balance">
                <div className="label">Balance</div>
                <div className="figure mono">₹46,260</div>
              </div>
            </div>

            <div className="ledger-sheet__rows">
              {rows.map((r) => (
                <div className="ledger-row" key={r.cat}>
                  <span><span className="cat-dot" style={{ background: r.color }} />{r.cat}</span>
                  <span className="date mono">{r.date}</span>
                  <span className={`amt mono ${r.type}`}>{r.amt}</span>
                </div>
              ))}
            </div>

            <div className="ledger-sheet__alert">
              <HiOutlineExclamationTriangle /> Groceries is at 81% of its monthly budget
            </div>
          </div>

          
        </motion.div>
      </div>
    </section>
  );
}
