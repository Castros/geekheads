export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Geek Head Solutions</h1>
          <p className="text-gray-600">Professional Cabling & Security Solutions</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Expert Installation Services for Your Business
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Professional structured cabling, security camera installation, and network infrastructure solutions
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get a Quote
            </a>
            <a
              href="#services"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Our Services
            </a>
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
              <div className="text-blue-600 text-4xl mb-4">🔌</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Structured Cabling</h3>
              <p className="text-gray-600">
                Professional data center cabling, Cat5e/Cat6/Cat6a installations, fiber optic cabling, and network infrastructure
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📹</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">CCTV Security Cameras</h3>
              <p className="text-gray-600">
                IP and analog camera installation, DVR/NVR setup, remote monitoring systems, and security assessments
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🚪</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Access Control</h3>
              <p className="text-gray-600">
                Card readers, biometric systems, magnetic locks, and integrated access control solutions
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">☎️</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Telephony Systems</h3>
              <p className="text-gray-600">
                Analog and IP phone systems, PBX installation, VoIP solutions, and telecommunications infrastructure
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🌐</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Data Networks</h3>
              <p className="text-gray-600">
                Network design and implementation, WiFi solutions, switches and routers, network optimization
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Cable Management</h3>
              <p className="text-gray-600">
                Professional cable routing, conduit installation, cable trays, and complete infrastructure management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Certified Professionals</h3>
              <p className="text-gray-600">Our team consists of certified technicians with years of experience</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Fast Service</h3>
              <p className="text-gray-600">Quick response times and efficient project completion</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💯</div>
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
