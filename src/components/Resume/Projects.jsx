import React from 'react';
import { Code2, Layers } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const Projects = ({ projects }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {projects.map((project, index) => (
        <Card key={index} className="hover:shadow-xl transition-all duration-300 border-slate-200 group hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-start mb-4">
              <Code2 className="w-5 h-5 text-slate-600 mr-3 mt-1 group-hover:text-slate-800 transition-colors" />
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {project.title}
              </h3>
            </div>
            
            <p className="text-slate-600 mb-4 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex items-center mb-3">
              <Layers className="w-4 h-4 text-slate-500 mr-2" />
              <span className="text-sm font-medium text-slate-700">Technologies:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <Badge 
                  key={techIndex} 
                  variant="secondary" 
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Projects;