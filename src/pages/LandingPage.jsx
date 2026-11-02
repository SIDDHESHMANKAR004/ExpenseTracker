import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import FeatureSection from '../components/landing/FeatureSection';
import BudgetSection from '../components/landing/BudgetSection';
import HowItWorks from '../components/landing/HowItWorks';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import { FEATURE_SECTIONS } from '../data/landingData';
import '../styles/landing.css';

const Rule = ({ label }) => <div className="ledger-rule" data-label={label} />;

export default function LandingPage() {
  return (
    <div className="ledger-landing">
      <Navbar />
      <Hero />

      <Rule label="Dashboard" />
      <FeatureSection section={FEATURE_SECTIONS[0]} raised />

      <Rule label="Expense Manager" />
      <FeatureSection section={FEATURE_SECTIONS[1]} />

      <Rule label="Analytics" />
      <FeatureSection section={FEATURE_SECTIONS[2]} raised />

      

      <Rule label="Budgeting" />
      <BudgetSection />

      <Rule label="Profile" />
      <FeatureSection section={FEATURE_SECTIONS[4]} raised />

      <Rule label="How it works" />
      <HowItWorks />

      

      <Rule label="FAQ" />
      <FAQ />

      <FinalCTA />

      <Footer />
    </div>
  );
}
