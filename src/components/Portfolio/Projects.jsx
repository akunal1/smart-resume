import React from "react";
import {
  ExternalLink,
  Github,
  Smartphone,
  Globe,
  Code2,
  Database,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const Projects = ({ projects }) => {
  const featuredProjects = [
    {
      id: 1,
      title: "Australian Open 2020 Mobile App",
      category: "Mobile Application",
      description:
        "Official mobile application for Australian Open 2020 tennis tournament, featuring live game details, real-time scoring, player statistics, and match schedules. Served millions of users worldwide during the tournament.",
      image: "/AO-banner.jpg",
      icon: Smartphone,
      technologies: [
        "React Native",
        "Redux",
        "Redux-Saga",
        "API Integration",
        "Real-time Data",
      ],
      highlights: [
        "Million+ downloads",
        "Real-time live scores",
        "International audience",
        "High performance",
      ],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      id: 2,
      title: "Agricultural Machinery Management System",
      category: "Mobile & Web Application",
      description:
        "Comprehensive reactive mobile and web application for American agricultural machinery manufacturer, featuring offline functionality, equipment tracking, maintenance scheduling, and field management tools.",
      image: "/agco.png",
      icon: Database,
      technologies: [
        "React Native",
        "Redux",
        "Redux-Saga",
        "Realm",
        "Offline-first",
        "React",
      ],
      highlights: [
        "Offline functionality",
        "Real-time sync",
        "Equipment tracking",
        "International deployment",
      ],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      id: 3,
      title: "India's Indirect Tax Implementation Portal",
      category: "Web Application",
      description:
        "India's largest and most complex indirect tax implementation system portal, handling massive transaction volumes, tax calculations, filing systems, and compliance management for businesses across the country.",
      image: "/gst.png",
      icon: Globe,
      technologies: [
        "AngularJS",
        "Bootstrap",
        "CSS3",
        "JavaScript",
        "Government Systems",
      ],
      highlights: [
        "National scale",
        "Million+ users",
        "High security",
        "Complex business logic",
      ],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      id: 4,
      title: "Australian E-commerce Platform",
      category: "Web Application",
      description:
        "Comprehensive e-commerce web application for Australian market, featuring direct and indirect purchasing workflows, payment integration, inventory management, and multi-vendor support.",
      image: "/laminex.png",
      icon: Globe,
      technologies: [
        "React",
        "Redux",
        "Redux-Saga",
        "JavaScript",
        "Sass",
        "Bootstrap",
      ],
      highlights: [
        "Multi-vendor support",
        "Payment integration",
        "Responsive design",
        "Australian market",
      ],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      id: 5,
      title: "Electric Utility Management System",
      category: "Web Application",
      description:
        "Large-scale web application for Edison International subsidiary, managing operations of electric utility services, grid monitoring, customer management, and energy distribution analytics.",
      image: "/sce.png",
      icon: Code2,
      technologies: [
        "React",
        "Redux",
        "Redux-Saga",
        "JavaScript",
        "Sass",
        "Bootstrap",
      ],
      highlights: [
        "Enterprise scale",
        "Real-time monitoring",
        "Utility operations",
        "Mission critical",
      ],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      id: 6,
      title: "Smart Home Monitoring Systems",
      category: "IoT Application",
      description:
        "Innovative Internet of Things (IoT) application for smart home monitoring, featuring real-time appliance status, energy consumption tracking, and remote control capabilities via mobile and web interfaces.",
      image: "/iot.png",
      icon: Code2,
      technologies: [
        "Python",
        "HTML/CSS",
        "Embedded Systems",
        "Raspberry Pi",
        "Google Chart",
      ],
      highlights: [
        "IEEE publication",
        "Real-time monitoring",
        "Energy tracking",
        "Remote control",
      ],
      demoUrl: "#",
      codeUrl: "#",
    },
  ];

  const getCategoryColor = (category) => {
    if (category.includes("Mobile"))
      return "bg-blue-100 text-blue-800 border-blue-300";
    if (category.includes("Web"))
      return "bg-green-100 text-green-800 border-green-300";
    return "bg-purple-100 text-purple-800 border-purple-300";
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Featured Work
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Showcasing innovative solutions that combine technical excellence
            with real-world impact
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {featuredProjects.map((project, index) => (
            <Card
              key={project.id}
              className="group hover:shadow-2xl transition-all duration-500 border-slate-200 overflow-hidden bg-gradient-to-br from-white to-slate-50"
            >
              <div className="relative overflow-hidden">
                {/* Project Image */}
                <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${getCategoryColor(project.category)} font-medium`}
                  >
                    {project.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Key Highlights:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-slate-600"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-200 text-slate-600 text-xs"
                      >
                        +{project.technologies.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-300 hover:bg-slate-100 group"
                  >
                    <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-300 hover:bg-slate-100 group"
                    // onClick={() => alert("Code repository would open")}
                  >
                    <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    View Code
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Want to see more of my work?
            </h3>
            <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
              These are just a few examples of my projects combining mobile &
              web development expertise. I'm always working on new innovative
              solutions to tackle complex challenges.
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              onClick={() =>
                document
                  .querySelector("#contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Let's Collaborate
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
