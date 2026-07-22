import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSacredStore } from "../../shared/store/sacredStore";
import HeroSection from "../home/HeroSection";
import FeaturedLives from "../home/FeaturedLives";
import SaintsExplorer from "../saints/SaintsExplorer";
import ChurchesSection from "../churches/ChurchesSection";
import TimelineSection from "../timeline/TimelineSection";
import AboutSection from "../about/AboutSection";
import SaintDetailsPage from "../saint-details/SaintDetailsPage";
import Footer from "../../shared/components/Footer";

export default function MainContent() {
  const { currentTab } = useSacredStore();

  const tabTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.5 }
  };

  return (
    <main className="relative z-10">
      <AnimatePresence mode="wait">
        {currentTab === "home" && (
          <motion.div key="home" {...tabTransition} transition={{ duration: 0.6 }}>
            <HeroSection />
            <div className="fade-divider my-2" />
            <FeaturedLives />
            <Footer />
          </motion.div>
        )}

        {currentTab === "saints" && (
          <motion.div key="saints" {...tabTransition}>
            <SaintsExplorer />
          </motion.div>
        )}

        {currentTab === "churches" && (
          <motion.div key="churches" {...tabTransition}>
            <ChurchesSection />
          </motion.div>
        )}

        {currentTab === "timeline" && (
          <motion.div key="timeline" {...tabTransition}>
            <TimelineSection />
          </motion.div>
        )}

        {currentTab === "about" && (
          <motion.div key="about" {...tabTransition}>
            <AboutSection />
          </motion.div>
        )}

        {currentTab === "saint-details" && (
          <motion.div key="saint-details" {...tabTransition}>
            <SaintDetailsPage />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}