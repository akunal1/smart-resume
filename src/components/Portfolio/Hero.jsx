import React, { useState, useEffect } from "react";
import {
  Download,
  Mail,
  ArrowDown,
  Globe,
  Github,
  Linkedin,
  Bot,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const Hero = ({ personalInfo }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-10rem)] py-8">
          {/* Left Content */}
          <div
            className={`space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="border-slate-400 text-slate-300 px-4 py-2"
              >
                Available for new opportunities
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Avinash Nayak
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-slate-300 font-light">
                Web & Mobile Application Architect
              </h2>
              <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-2xl">
                Crafting exceptional digital experiences with international
                expertise in mobile & web development
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8 py-6 lg:py-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-400">
                  10+
                </div>
                <div className="text-slate-400 text-xs lg:text-sm">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-400">
                  30+
                </div>
                <div className="text-slate-400 text-xs lg:text-sm">
                  Projects Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-400">
                  6+
                </div>
                <div className="text-slate-400 text-xs lg:text-sm">
                  Countries Worked
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/Avinash_Nayak.pdf";
                  link.download = "Avinash_Nayak_Resume.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Download Resume
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "/assistant";
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 lg:px-8 py-3 text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-green-400/20 hover:ring-green-400/40"
              >
                <Bot className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Chat with me
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 pt-4">
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Globe className="w-6 h-6" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div
            className={`text-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          >
            <div className="relative">
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center border-4 border-slate-700 overflow-hidden">
                <img
                  src="/me.png"
                  alt="Avinash Nayak"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: "center top" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div
                  className="text-6xl lg:text-8xl font-bold text-slate-600"
                  style={{ display: "none" }}
                >
                  AN
                </div>
              </div>
              <div className="absolute -bottom-1 lg:-bottom-2 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs lg:text-sm font-medium">
                    Web & Mobile Developer
                  </span>
                </div>
              </div>
            </div>

            {/* Specialty Tags */}
            <div className="mt-6 lg:mt-12 space-y-2 flex flex-wrap justify-center gap-2">
              <Badge
                variant="default"
                className="bg-slate-800 text-slate-300 text-xs lg:text-sm"
              >
                React Native Expert
              </Badge>
              <Badge
                variant="default"
                className="bg-slate-800 text-slate-300 text-xs lg:text-sm"
              >
                React.js Specialist
              </Badge>
              <Badge
                variant="default"
                className="bg-slate-800 text-slate-300 text-xs lg:text-sm"
              >
                Neural Network Neophyte
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
