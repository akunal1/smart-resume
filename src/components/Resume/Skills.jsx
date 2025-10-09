import React from 'react';
import { Code, Wrench } from 'lucide-react';
import { Badge } from '../ui/badge';

const Skills = ({ skills }) => {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="flex items-center mb-4">
          <Code className="w-5 h-5 text-slate-600 mr-3" />
          <h3 className="text-xl font-bold text-slate-800">Core Competencies</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.coreCompetencies.map((skill, index) => (
            <Badge 
              key={index} 
              className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white transition-all duration-200 shadow-sm"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-4">
          <Wrench className="w-5 h-5 text-slate-600 mr-3" />
          <h3 className="text-xl font-bold text-slate-800">Tools & Technologies</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.tools.map((tool, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            >
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;