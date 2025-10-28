import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Send,
  User,
  Building,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { apiCall, API_CONFIG } from "../../config/api";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const Contact = ({ personalInfo }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.CONTACT, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          email: "",
          company: "",
          subject: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold mb-8 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-blue-400" />
              Contact Information
            </h3>

            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Ready to build something incredible? Let's discuss how my
              expertise in mobile and web development can help bring your vision
              to life. I'm always excited to take on new challenges and create
              innovative solutions.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Email</h4>
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="text-slate-300 hover:text-white transition-colors"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Phone</h4>
                      <a
                        href={`tel:${personalInfo.phone}`}
                        className="text-slate-300 hover:text-white transition-colors"
                      >
                        {personalInfo.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        Location
                      </h4>
                      <p className="text-slate-300">{personalInfo.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-4">Follow Me</h4>
              <div className="flex gap-4">
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
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                  <Send className="w-6 h-6 mr-3 text-blue-400" />
                  Send Me a Message
                </h3>

                <p className="text-slate-300 mb-8">
                  Whether you have a project in mind, need development
                  consultation, or just want to say hello, I'd love to hear from
                  you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="fullName"
                        className="text-slate-300 mb-2 block"
                      >
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-slate-300 mb-2 block"
                      >
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="company"
                      className="text-slate-300 mb-2 block"
                    >
                      Company/Organization
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                        placeholder="Your company or organization"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-slate-300 mb-2 block"
                    >
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-slate-300 mb-2 block"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 resize-none"
                      placeholder="Tell me about your project or how I can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <div className="flex items-center p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
                      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">
                          Message sent successfully!
                        </p>
                        <p className="text-sm text-green-400">
                          Thank you for reaching out. I'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="flex items-center p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Failed to send message</p>
                        <p className="text-sm text-red-400">
                          Please try again or contact me directly via email.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
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
