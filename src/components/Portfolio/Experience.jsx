import React from "react";
import { MapPin, Calendar, Briefcase, Award } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const Experience = ({ workHistory, experience }) => {
  const experiences = [
    {
      company: "Agco Corporation",
      role: "Senior Application Developer",
      period: "October 2022 - Present",
      location: "India",
      type: "current",
      responsibilities: [
        "Leading development of reactive mobile applications for agricultural machinery",
        "Implementing offline-first architecture with Realm database integration",
        "Mentoring junior developers and driving code quality initiatives",
        "Coordinating with international teams for product feature development",
      ],
      technologies: [
        "React Native",
        "React.js",
        "Redux",
        "Redux-Saga",
        "redux-toolkit",
        "Realm",
        "TypeScript",
        "Mapbox",
      ],
    },
    {
      company: "Infosys Limited",
      role: "Technology Analyst",
      period: "March 2020 - October 2022",
      location: "Germany",
      type: "international",
      responsibilities: [
        "Developed web applications for Edison International subsidiary utilities",
        "Built responsive e-commerce platforms for Australian market",
        "Implemented complex business logic for large-scale applications",
        "Collaborated with cross-functional international teams",
      ],
      technologies: ["React", "Redux", "JavaScript", "Sass", "Bootstrap"],
    },
    {
      company: "Infosys Limited",
      role: "Senior Systems Engineer",
      period: "October 2017 - March 2020",
      location: "Australia",
      type: "international",
      responsibilities: [
        "Developed the official Australian Open 2020 mobile application",
        "Implemented real-time live game details and scoring systems",
        "Optimized performance for millions of concurrent users",
        "Worked closely with Tennis Australia for requirement gathering",
      ],
      technologies: ["React Native", "Redux", "Redux-Saga", "API Integration"],
    },
    {
      company: "Infosys Limited",
      role: "Systems Engineer",
      period: "October 2015 - October 2017",
      location: "India",
      type: "domestic",
      responsibilities: [
        "Built India's largest indirect tax implementation system portal",
        "Developed complex AngularJS applications for government systems",
        "Implemented responsive designs for high-traffic applications",
        "Participated in system architecture and design decisions",
      ],
      technologies: ["AngularJS", "Bootstrap", "CSS3", "JavaScript"],
    },
  ];

  const getTypeStyles = (type) => {
    const styles = {
      current: {
        bg: "bg-green-50",
        border: "border-green-200",
        accent: "text-green-600",
      },
      international: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        accent: "text-blue-600",
      },
      domestic: {
        bg: "bg-slate-50",
        border: "border-slate-200",
        accent: "text-slate-600",
      },
    };
    return styles[type] || styles.domestic;
  };

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Professional Journey
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience & Career Progression
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-slate-400"></div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const styles = getTypeStyles(exp.type);
              return (
                <div key={index} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 w-4 h-4 ${exp.type === "current" ? "bg-green-500" : exp.type === "international" ? "bg-blue-500" : "bg-slate-400"} rounded-full border-4 border-white shadow-lg z-10`}
                  ></div>

                  {/* Content Card */}
                  <div className="ml-20 flex-1">
                    <Card
                      className={`${styles.bg} ${styles.border} border-2 hover:shadow-xl transition-shadow duration-300`}
                    >
                      <CardContent className="p-8">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between mb-6">
                          <div>
                            <div className="flex items-center mb-2">
                              <Briefcase
                                className={`w-5 h-5 ${styles.accent} mr-2`}
                              />
                              <h3 className="text-2xl font-bold text-slate-800">
                                {exp.company}
                              </h3>
                            </div>
                            <h4 className="text-lg font-semibold text-slate-700 mb-3">
                              {exp.role}
                            </h4>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {exp.period}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {exp.location}
                              </div>
                            </div>
                          </div>

                          {exp.type === "current" && (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Current Role
                            </Badge>
                          )}
                          {exp.type === "international" && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                              International
                            </Badge>
                          )}
                        </div>

                        {/* Responsibilities */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-slate-800 mb-3 flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            Key Achievements & Responsibilities
                          </h5>
                          <ul className="space-y-2">
                            {exp.responsibilities.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-slate-700"
                              >
                                <div className="w-2 h-2 bg-slate-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-3">
                            Technologies & Tools
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-white text-slate-700 border border-slate-300"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career Summary */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              Career Highlights
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">6+</div>
                <div className="text-slate-600">Countries Worked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-slate-600">Project Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">10+</div>
                <div className="text-slate-600">Years Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
