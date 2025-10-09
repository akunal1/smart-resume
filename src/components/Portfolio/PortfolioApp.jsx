import React, { useEffect } from 'react';
import { resumeData } from '../../data/resumeData';
import Navigation from './Navigation';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Achievements from './Achievements';
import Contact from './Contact';

const PortfolioApp = () => {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section id="home">
        <Hero personalInfo={resumeData.personalInfo} />
      </section>

      {/* About Section */}
      <About personalInfo={resumeData.personalInfo} />

      {/* Skills Section */}
      <Skills skills={resumeData.skills} />

      {/* Experience Section */}
      <Experience 
        workHistory={resumeData.workHistory} 
        experience={resumeData.experience} 
      />

      {/* Projects Section */}
      <Projects projects={resumeData.projects} />

      {/* Achievements Section */}
      <Achievements 
        achievements={resumeData.achievements}
        certifications={resumeData.certifications}
      />

      {/* Contact Section */}
      <Contact personalInfo={resumeData.personalInfo} />
    </div>
  );
};

export default PortfolioApp;