import React from "react";
import { Code2, Smartphone, Globe2, Wrench } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

const Skills = ({ skills }) => {
  const skillCategories = [
    {
      title: "Mobile Development",
      icon: Smartphone,
      color: "blue",
      items: [
        { name: "React Native", level: 95 },
        { name: "Redux/Redux-Saga/toolkit", level: 100 },
        { name: "Realm/MongoDB", level: 75 },
        { name: "Expo(Managed/Bare) Development", level: 95 },
      ],
    },
    {
      title: "Web Development",
      icon: Globe2,
      color: "green",
      items: [
        { name: "React.js", level: 95 },
        { name: "TypeScript", level: 92 },
        { name: "JavaScript ES6+", level: 95 },
        { name: "Micro Frontend", level: 85 },
      ],
    },
    {
      title: "UI/UX & Design",
      icon: Code2,
      color: "purple",
      items: [
        { name: "UX Design (Figma)", level: 50 },
        { name: "Responsive Design", level: 92 },
        { name: "CSS3/Sass", level: 90 },
        { name: "Bootstrap", level: 95 },
      ],
    },
    {
      title: "Tools & Technologies",
      icon: Wrench,
      color: "orange",
      items: [
        { name: "GitHub/VSTS", level: 100 },
        { name: "VS Code", level: 95 },
        { name: "Mapbox Integration", level: 82 },
        { name: "RN Desktop Apps", level: 60 },
      ],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        progress: "bg-blue-500",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        progress: "bg-green-500",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-800",
        progress: "bg-purple-500",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-800",
        progress: "bg-orange-500",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Technical Expertise
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            My Skills & Technologies
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {skillCategories.map((category, index) => {
            const colors = getColorClasses(category.color);
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mr-4 shadow-md`}
                  >
                    <category.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${colors.text}`}>
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-6">
                  {category.items.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">
                          {skill.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`${colors.progress} h-2 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Core Technologies */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-8">
            Core Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.coreCompetencies.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2 text-sm hover:from-slate-600 hover:to-slate-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Professional Highlights */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              The Perfect Blend of Experience & Innovation
            </h3>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              My unique combination of international experience and cutting-edge
              technical skills positions me to tackle modern development
              challenges with innovative, scalable solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                10+ Years
              </div>
              <div className="text-slate-300">Development Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                International
              </div>
              <div className="text-slate-300">Work Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                Full-Stack
              </div>
              <div className="text-slate-300">Development Specialist</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
