import React from "react";
import { Trophy, Award, Star, Target, Users, Globe } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const Achievements = ({ achievements, certifications }) => {
  const awards = [
    {
      year: "2024",
      title: "Technical Excellence Award",
      description:
        "Recognized for outstanding mobile application development and international project delivery",
      organization: "Agco Corporation",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      year: "2020",
      title: "Project Excellence Recognition",
      description:
        "Australian Open Mobile App - Delivered world-class mobile experience for millions of users",
      organization: "Tennis Australia & Infosys",
      icon: Star,
      color: "text-blue-600",
    },
    {
      year: "2019",
      title: "Innovation Award",
      description:
        "India Tax Portal - Successfully launched nation-scale tax implementation system",
      organization: "Government of India & Infosys",
      icon: Award,
      color: "text-green-600",
    },
    {
      year: "2018",
      title: "International Assignment Excellence",
      description:
        "Outstanding performance during international assignments in Australia and Germany",
      organization: "Infosys Limited",
      icon: Globe,
      color: "text-purple-600",
    },
  ];

  const accentMap = {
    Microsoft: { accent: "#0078d4", bg: "#eff6ff" },
    Google: { accent: "#FF8D1B", bg: "#fff5f5" },
    Infosys: { accent: "#007cc3", bg: "#f0f9ff" },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Recognition & Awards
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Accomplishments & Professional Excellence
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {/* Awards & Recognition */}
          <div>
            <div className="flex items-center mb-8">
              <Trophy className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="text-3xl font-bold text-slate-800">
                Awards & Recognition
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {awards.map((award, index) => (
                <Card
                  key={index}
                  className="border-slate-200 hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mr-4">
                          <award.icon className={`w-6 h-6 ${award.color}`} />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-slate-800">
                            {award.title}
                          </h4>
                          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {award.year}
                          </span>
                        </div>

                        <p className="text-slate-600 mb-3 leading-relaxed">
                          {award.description}
                        </p>

                        <p className="text-sm font-medium text-slate-500">
                          {award.organization}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center mb-8">
              <Award className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-3xl font-bold text-slate-800">
                Professional Certifications
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {certifications.map((cert, index) => {
                const { accent = "#64748b" } = accentMap[cert.issuer] || {};
                return (
                  <Card
                    key={index}
                    className="border-slate-200 hover:shadow-lg transition-shadow duration-300 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                            <img
                              src={cert.logo}
                              alt={cert.issuer}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-bold text-slate-800 leading-snug">
                              {cert.title}
                            </h4>
                            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0 ml-2">
                              {cert.year}
                            </span>
                          </div>

                          <p
                            className="text-sm font-semibold"
                            style={{ color: accent }}
                          >
                            {cert.issuer}
                          </p>

                          {cert.credentialId && (
                            <p className="text-xs text-slate-400 mt-1">
                              ID: {cert.credentialId}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Career Statistics */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Career Highlights
              </h4>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    50+
                  </div>
                  <div className="text-slate-600 text-sm">Recognitions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    100%
                  </div>
                  <div className="text-slate-600 text-sm">
                    Client Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    10+
                  </div>
                  <div className="text-slate-600 text-sm">Years Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    6+
                  </div>
                  <div className="text-slate-600 text-sm">
                    International Markets
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recognition Summary */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-3xl font-bold">Professional Excellence</h3>
            </div>

            <p className="text-slate-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              These recognitions reflect my commitment to excellence in mobile
              and web development, successful delivery of high-impact projects,
              and continuous innovation in creating solutions that make a
              difference.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  10+
                </div>
                <div className="text-slate-300">Major Awards</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  Million+
                </div>
                <div className="text-slate-300">Users Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  International
                </div>
                <div className="text-slate-300">Recognition</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
