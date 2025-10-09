import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const WorkHistory = ({ workHistory }) => {
  return (
    <div className="space-y-4">
      {workHistory.map((job, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-slate-600 mr-3" />
                <h3 className="text-xl font-bold text-slate-800">{job.company}</h3>
              </div>
              {job.role && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                  {job.role}
                </span>
              )}
            </div>
            
            <div className="ml-8">
              {job.period ? (
                <div className="flex items-center text-slate-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{job.period}</span>
                  {job.location && <span className="ml-2">• {job.location}</span>}
                </div>
              ) : job.periods && (
                <div className="space-y-1">
                  {job.periods.map((period, idx) => (
                    <div key={idx} className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{period}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkHistory;