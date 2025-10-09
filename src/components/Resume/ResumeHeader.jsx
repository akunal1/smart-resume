import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';

const ResumeHeader = ({ personalInfo }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-2xl mb-8 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {personalInfo.name}
          </h1>
          <h2 className="text-xl lg:text-2xl text-slate-300 mb-4 font-light">
            {personalInfo.title}
          </h2>
          <div className="flex items-center text-slate-400 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{personalInfo.location}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 text-sm">
          <a 
            href={`mailto:${personalInfo.email}`} 
            className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
          >
            <Mail className="w-4 h-4 mr-3" />
            {personalInfo.email}
          </a>
          <a 
            href={`tel:${personalInfo.phone}`} 
            className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
          >
            <Phone className="w-4 h-4 mr-3" />
            {personalInfo.phone}
          </a>
          <a 
            href={personalInfo.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
          >
            <Globe className="w-4 h-4 mr-3" />
            Portfolio
          </a>
          <a 
            href={personalInfo.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
          >
            <Linkedin className="w-4 h-4 mr-3" />
            LinkedIn
          </a>
          <a 
            href={personalInfo.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
          >
            <Github className="w-4 h-4 mr-3" />
            GitHub
          </a>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <p className="text-slate-200 leading-relaxed">
          {personalInfo.summary}
        </p>
      </div>
    </div>
  );
};

export default ResumeHeader;