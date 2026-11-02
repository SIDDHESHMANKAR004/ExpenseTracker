import React from 'react';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import ImagePlaceholder from './ImagePlaceholder';
import { BUDGET_HIGHLIGHTS } from '../../data/landingData';
import './BudgetSection.css';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const listReveal = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemReveal = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function BudgetSection() {
  return (
    <section id="budgeting" className="ledger-section budget-section">
      <div className="ledger-container budget-section__container">
        <motion.header
          className="budget-section__header"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="budget-section__eyebrow">
            <span aria-hidden="true" />
            Built into Expense Manager
          </span>
          <h2>
            Smart budget planning,
            <br />
            <span>without the guesswork.</span>
          </h2>
          <p>
            Budgets aren't a separate app — they're the limits you set on each
            category, enforced everywhere the app shows your money.
          </p>
        </motion.header>

        <div className="budget-section__layout">
          <motion.div
            className="budget-section__benefits"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="budget-section__benefits-heading">
              <span className="budget-section__overline">A plan that keeps up</span>
              <h3>Small guardrails. Better decisions.</h3>
            </div>
            <motion.ul
              className="budget-section__list"
              variants={listReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              {BUDGET_HIGHLIGHTS.map((highlight, index) => (
                <motion.li key={highlight} variants={itemReveal}>
                  <span className="budget-section__check" aria-hidden="true">
                    <HiCheck />
                  </span>
                  <span className="budget-section__highlight">
                    <span className="budget-section__index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {highlight}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
            <div className="budget-section__note">
              <span aria-hidden="true">↗</span>
              Your category limits stay connected to your everyday spending.
            </div>
          </motion.div>

          <motion.div
            className="budget-section__showcase"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="budget-section__showcase-top">
              <span className="budget-section__showcase-dot" />
              <span>PLAN WITH CLARITY</span>
              <span className="budget-section__showcase-line" />
            </div>
            <div className="budget-section__image-frame">
              <ImagePlaceholder
                src="/images/landing/budgets.png"
                title="Budget progress illustration"
                detail="Illustration or screenshot showing a category budget progress bar (e.g. Groceries: ₹3,240 of ₹4,000 used) alongside the budget-alert banner style used on the Dashboard."
              />
            </div>
            <div className="budget-section__showcase-caption">
              <span>Category budgets</span>
              <span>Clear limits, in context</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
