import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const Contact = ({ personalInfo }) => {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Let's Connect & Create Something Amazing Together
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Email</h4>
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-slate-300 hover:text-white transition-colors text-sm"
              >
                {personalInfo.email}
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Phone</h4>
              <a
                href={`tel:${personalInfo.phone}`}
                className="text-slate-300 hover:text-white transition-colors text-sm"
              >
                {personalInfo.phone}
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Location</h4>
              <p className="text-slate-300 text-sm">{personalInfo.location}</p>
            </CardContent>
          </Card>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <h4 className="font-semibold text-white mb-4">Follow Me</h4>
          <div className="flex gap-4 justify-center">
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <Globe className="w-6 h-6 text-white" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <Github className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400 mb-4">
            © 2024 {personalInfo.name}. Crafted with passion for exceptional
            digital experiences.
          </p>
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>using React & Modern Web Technologies</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
