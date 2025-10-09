import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const Achievements = ({ achievements, certifications }) => {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="flex items-center mb-6">
          <Trophy className="w-5 h-5 text-slate-600 mr-3" />
          <h3 className="text-xl font-bold text-slate-800">Key Achievements</h3>
        </div>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="border-l-4 border-l-amber-400 border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Star className="w-4 h-4 text-amber-500 mr-3 mt-1" />
                  <p className="text-slate-700 leading-relaxed">{achievement}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-6">
          <Star className="w-5 h-5 text-slate-600 mr-3" />
          <h3 className="text-xl font-bold text-slate-800">Certifications</h3>
        </div>
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <p className="text-slate-700 font-medium">{cert}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;