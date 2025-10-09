import React from 'react';
import { CheckCircle } from 'lucide-react';

const Experience = ({ experience }) => {
  return (
    <div className="space-y-4">
      {experience.map((item, index) => (
        <div key={index} className="flex items-start group">
          <CheckCircle className="w-5 h-5 text-green-600 mr-4 mt-1 group-hover:text-green-700 transition-colors" />
          <p className="text-slate-700 leading-relaxed group-hover:text-slate-800 transition-colors">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Experience;