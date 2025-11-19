'use client';

import { useState } from 'react';
import { Cable, Video, Lock, Phone, Network, Layers, Award, Zap, ShieldCheck, Server, Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
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
            <div className="hidden md:flex space-x-2 items-center">
              <a href="#home" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors px-3 py-2 rounded-lg">
                {t('nav.home')}
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors px-3 py-2 rounded-lg">
                {t('nav.services')}
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors px-3 py-2 rounded-lg">
                {t('nav.about')}
              </a>
              <a href="#why-choose-us" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors px-3 py-2 rounded-lg">
                {t('nav.whyChooseUs')}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors px-3 py-2 rounded-lg">
                {t('nav.contact')}
              </a>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  aria-label="Select language"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-xs">
                    {language === 'en' ? '🇺🇸' : '🇲🇽'}
                  </div>
                  <span>{language === 'en' ? 'EN' : 'ES'}</span>
                  <ChevronDown size={16} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setLangDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition first:rounded-t-lg"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-xs">
                        🇺🇸
                      </div>
                      <span className="font-medium">EN</span>
                      <span className="text-gray-500">- USA</span>
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('es');
                        setLangDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition last:rounded-b-lg border-t border-gray-200"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-xs">
                        🇲🇽
                      </div>
                      <span className="font-medium">ES</span>
                      <span className="text-gray-500">- Mexico</span>
                    </button>
                  </div>
                )}
              </div>
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
              <div className="flex flex-col space-y-2 pt-4">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors py-2 px-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </a>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors py-2 px-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.services')}
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors py-2 px-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.about')}
                </a>
                <a
                  href="#why-choose-us"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors py-2 px-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.whyChooseUs')}
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 font-medium transition-colors py-2 px-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </a>

                {/* Mobile Language Selector */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition rounded-lg mb-2 ${language === 'en' ? 'bg-gray-100' : ''}`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                      🇺🇸
                    </div>
                    <span className="font-medium">EN</span>
                    <span className="text-gray-500">- USA</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('es');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition rounded-lg ${language === 'es' ? 'bg-gray-100' : ''}`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                      🇲🇽
                    </div>
                    <span className="font-medium">ES</span>
                    <span className="text-gray-500">- Mexico</span>
                  </button>
                </div>
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg tracking-tight leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 drop-shadow-md font-light leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="#contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg tracking-wide"
              >
                {t('hero.getQuote')}
              </a>
              <a
                href="#services"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-gray-100 transition-colors shadow-lg tracking-wide"
              >
                {t('hero.ourServices')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 tracking-tight">{t('services.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Cable size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-tight">{t('services.cabling.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.cabling.desc')}
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Video size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-tight">{t('services.cctv.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.cctv.desc')}
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Lock size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-tight">{t('services.access.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.access.desc')}
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Phone size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-tight">{t('services.telephony.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.telephony.desc')}
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Network size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-tight">{t('services.networks.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.networks.desc')}
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Layers size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 tracking-tight">{t('services.management.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('services.management.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 tracking-tight">{t('about.title')}</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                {t('about.p1')}
              </p>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                {t('about.p2')}
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {t('about.p3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 tracking-tight">{t('why.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center text-blue-600 mb-4">
                <Award size={56} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 tracking-tight">{t('why.certified.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('why.certified.desc')}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-blue-600 mb-4">
                <Zap size={56} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 tracking-tight">{t('why.fast.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('why.fast.desc')}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-blue-600 mb-4">
                <ShieldCheck size={56} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 tracking-tight">{t('why.quality.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('why.quality.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('contact.title')}</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            {t('contact.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+1234567890"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors tracking-wide"
            >
              {t('contact.call')}: (899) 959-5973
            </a>
            <a
              href="mailto:info@geekheadsolutions.com"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white tracking-wide"
            >
              {t('contact.email')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 Geek Head Solutions. {t('footer.rights')}.</p>
          <p className="mt-2 text-sm font-light">{t('footer.tagline')}</p>
        </div>
      </footer>
    </div>
  );
}
