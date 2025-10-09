import React from 'react';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const Education = ({ education }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start">
          <GraduationCap className="w-6 h-6 text-slate-600 mr-4 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {education.degree}
            </h3>
            <p className="text-lg text-slate-700 mb-3">
              {education.institution}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-slate-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{education.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{education.period}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Education;