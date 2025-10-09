import React from 'react';

const Section = ({ title, icon: Icon, children, className = "" }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-300 pb-1">
          {title}
        </h2>
      </div>
      <div className="ml-14">
        {children}
      </div>
    </div>
  );
};

export default Section;