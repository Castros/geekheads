'use client';

import { useState } from 'react';
import { Cable, Video, Lock, Phone, Network, Layers, Award, Zap, ShieldCheck, Server, Menu, X } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/img/ghs-logo.png"
                alt="Geek Head Solutions Logo"
                className="h-12 md:h-16 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </a>
              <a href="#why-choose-us" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Why Choose Us
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 pt-4">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#why-choose-us"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Why Choose Us
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative w-full py-24 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/img/hero-cabling.jpg)' }}
        />

        {/* Grey Transparent Overlay */}
        <div className="absolute inset-0 bg-gray-900 opacity-70" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full bg-opacity-90">
                <Server size={64} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Expert Installation Services for Your Business
            </h2>
            <p className="text-xl text-gray-100 mb-8 drop-shadow-md">
              Professional structured cabling, security camera installation, and network infrastructure solutions
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="#contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get a Quote
              </a>
              <a
                href="#services"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-gray-100 transition-colors shadow-lg"
              >
                Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Cable size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Structured Cabling</h3>
              <p className="text-gray-600">
                Professional data center cabling, Cat5e/Cat6/Cat6a installations, fiber optic cabling, and network infrastructure
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Video size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">CCTV Security Cameras</h3>
              <p className="text-gray-600">
                IP and analog camera installation, DVR/NVR setup, remote monitoring systems, and security assessments
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Lock size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Access Control</h3>
              <p className="text-gray-600">
                Card readers, biometric systems, magnetic locks, and integrated access control solutions
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Phone size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Telephony Systems</h3>
              <p className="text-gray-600">
                Analog and IP phone systems, PBX installation, VoIP solutions, and telecommunications infrastructure
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Network size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Data Networks</h3>
              <p className="text-gray-600">
                Network design and implementation, WiFi solutions, switches and routers, network optimization
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Layers size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Cable Management</h3>
              <p className="text-gray-600">
                Professional cable routing, conduit installation, cable trays, and complete infrastructure management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">About Us</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 mb-6">
                Geek Head Solutions is a leading provider of professional cabling and security infrastructure services.
                With years of experience in the industry, we specialize in delivering enterprise-grade solutions for
                businesses of all sizes.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our team of certified technicians brings expertise in structured cabling, network infrastructure,
                security camera systems, and access control solutions. We pride ourselves on staying current with
                the latest technologies and industry standards to provide our clients with cutting-edge solutions.
              </p>
              <p className="text-lg text-gray-700">
                From data centers to office buildings, we've successfully completed hundreds of installations,
                ensuring reliable, scalable, and secure infrastructure that supports your business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center text-blue-600 mb-4">
                <Award size={56} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Certified Professionals</h3>
              <p className="text-gray-600">Our team consists of certified technicians with years of experience</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-blue-600 mb-4">
                <Zap size={56} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Fast Service</h3>
              <p className="text-gray-600">Quick response times and efficient project completion</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-blue-600 mb-4">
                <ShieldCheck size={56} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Quality Guarantee</h3>
              <p className="text-gray-600">We stand behind our work with comprehensive warranties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote for your cabling and security needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+1234567890"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call Us: (123) 456-7890
            </a>
            <a
              href="mailto:info@geekheadsolutions.com"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Geek Head Solutions. All rights reserved.</p>
          <p className="mt-2">Professional Cabling, Security, and Network Solutions</p>
        </div>
      </footer>
    </div>
  );
}
