import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { usePrefetchExplorer } from "@/hooks/usePrefetchExplorer";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  usePrefetchExplorer();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
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
