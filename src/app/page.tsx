"use client";

import FeatureCards from "../components/feature-cards";
import InteractiveHero from "../components/hero-section-nexus";

const HomePage = () => {
  return (
    <div className="container">
      <InteractiveHero />
      <FeatureCards />
    </div>
  );
};

export default HomePage;
