import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import HowItWorks from "../../components/home/HowItWorks";
import Levels from "../../components/home/Levels";
import CTA from "../../components/home/CTA";

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Levels Section */}
      <Levels />

      {/* Call to Action Section */}
      <CTA />
    </div>
  );
};

export default Home;
