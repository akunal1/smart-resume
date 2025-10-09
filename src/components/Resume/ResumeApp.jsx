import React from 'react';
import { User, Briefcase, Code2, GraduationCap, Award, Target, Download, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { resumeData } from '../../data/resumeData';
import ResumeHeader from './ResumeHeader';
import Section from './Section';
import WorkHistory from './WorkHistory';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import Education from './Education';
import Achievements from './Achievements';

const ResumeApp = () => {
  const handleDownload = () => {
    window.print();
  };

  const handlePreview = () => {
    // Mock preview functionality
    alert('Preview mode activated! This would open a full-screen preview.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <Button 
            onClick={handlePreview}
            variant="outline" 
            className="border-slate-300 hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Resume Header */}
        <ResumeHeader personalInfo={resumeData.personalInfo} />

        {/* Resume Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Section title="Work History" icon={Briefcase}>
              <WorkHistory workHistory={resumeData.workHistory} />
            </Section>

            <Section title="Professional Experience" icon={Target}>
              <Experience experience={resumeData.experience} />
            </Section>

            <Section title="Key Projects" icon={Code2}>
              <Projects projects={resumeData.projects} />
            </Section>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-8">
            <Section title="Skills" icon={User}>
              <Skills skills={resumeData.skills} />
            </Section>

            <Section title="Education" icon={GraduationCap}>
              <Education education={resumeData.education} />
            </Section>

            <Section title="Achievements & Certifications" icon={Award}>
              <Achievements 
                achievements={resumeData.achievements}
                certifications={resumeData.certifications}
              />
            </Section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-slate-800 text-white rounded-full shadow-lg">
            <p className="text-sm font-medium">
              Professional Resume • {new Date().getFullYear()} • {resumeData.personalInfo.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeApp;