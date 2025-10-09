import React from "react";
import { Code2, Globe, Users, Zap } from "lucide-react";

const About = ({ personalInfo }) => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            About Me
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Every great application begins with an even better story
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Story */}
          <div className="space-y-8">
            <div className="prose prose-lg text-slate-700">
              <p className="leading-relaxed">
                With <strong>10+ years</strong> in web and mobile application
                development and <strong>international experience</strong> across
                India, Australia, and Europe, I specialize in creating
                exceptional digital experiences. From developing the official{" "}
                <strong>Australian Open mobile app</strong> to building{" "}
                <strong>India's largest indirect tax portal</strong>, I bring
                together technical excellence and creative innovation.
              </p>

              <p className="leading-relaxed">
                I leverage modern technologies like{" "}
                <strong>React Native, React.js, TypeScript and Node.js</strong>{" "}
                to build cross-platform solutions that delight users and drive
                business success. My international experience has given me
                unique insights into diverse markets and user needs.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                What drives me:
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Code2 className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-slate-600">
                    Building scalable, user-centric applications that solve
                    real-world problems
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-slate-600">
                    Leveraging international perspectives to create globally
                    accessible solutions
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <p className="text-slate-600">
                    Mentoring teams and driving collaborative development
                    practices
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <Zap className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <p className="text-slate-600">
                    Staying at the forefront of emerging technologies and
                    development trends
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Stats & Highlights */}
          <div className="space-y-8">
            {/* Achievement Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    100%
                  </div>
                  <div className="text-slate-600 text-sm">
                    Project Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    100%
                  </div>
                  <div className="text-slate-600 text-sm">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">
                Key Achievements
              </h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h4 className="font-bold text-slate-800 mb-2">
                    Australian Open Mobile App
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Developed the official mobile application for Australian
                    Open 2020, serving millions of users worldwide
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-6 rounded-lg">
                  <h4 className="font-bold text-slate-800 mb-2">
                    India's Tax Portal
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Built India's complex indirect tax implementation system
                    portal, handling massive transaction volumes
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h4 className="font-bold text-slate-800 mb-2">
                    IEEE Publication
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Published research on embedded web server architecture for
                    IoT-based kitchen monitoring systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
