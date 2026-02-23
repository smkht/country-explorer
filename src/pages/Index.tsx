import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <UseCasesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
