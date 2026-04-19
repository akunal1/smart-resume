import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const Achievements = ({ achievements, certifications }) => {
  return (
    <div className="space-y-8">
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
        <div className="flex items-center mb-5">
          <Award className="w-5 h-5 text-slate-600 mr-3" />
          <h3 className="text-xl font-bold text-slate-800">Certifications</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {certifications.map((cert, index) => {
            const accentMap = {
              Microsoft: '#0078d4',
              Google: '#ea4335',
              Infosys: '#007cc3',
            };
            const accent = accentMap[cert.issuer] || '#64748b';
            return (
              <div
                key={index}
                className="rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="h-1" style={{ backgroundColor: accent }} />
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded overflow-hidden bg-white border border-slate-100 shrink-0 flex items-center justify-center">
                      {cert.logo && (
                        <img
                          src={cert.logo}
                          alt={cert.issuer}
                          className="w-4 h-4 object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <span className="text-xs font-bold truncate" style={{ color: accent }}>
                      {cert.issuer}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2">
                    {cert.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{cert.year}</span>
                    {cert.credentialId && (
                      <span className="text-xs text-slate-300">#{cert.credentialId.slice(-4)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;