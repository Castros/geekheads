'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.whyChooseUs': 'Why Choose Us',
    'nav.contact': 'Contact',

    // Header
    'header.title': 'Geek Head Solutions',
    'header.subtitle': 'Professional Cabling & Security Solutions',

    // Hero
    'hero.title': 'Expert Installation Services for Your Business',
    'hero.subtitle': 'Professional structured cabling, security camera installation, and network infrastructure solutions',
    'hero.getQuote': 'Get a Quote',
    'hero.ourServices': 'Our Services',

    // Services
    'services.title': 'Our Services',
    'services.cabling.title': 'Structured Cabling',
    'services.cabling.desc': 'Professional data center cabling, Cat5e/Cat6/Cat6a installations, fiber optic cabling, and network infrastructure',
    'services.cctv.title': 'CCTV Security Cameras',
    'services.cctv.desc': 'IP and analog camera installation, DVR/NVR setup, remote monitoring systems, and security assessments',
    'services.access.title': 'Access Control',
    'services.access.desc': 'Card readers, biometric systems, magnetic locks, and integrated access control solutions',
    'services.telephony.title': 'Telephony Systems',
    'services.telephony.desc': 'Analog and IP phone systems, PBX installation, VoIP solutions, and telecommunications infrastructure',
    'services.networks.title': 'Data Networks',
    'services.networks.desc': 'Network design and implementation, WiFi solutions, switches and routers, network optimization',
    'services.management.title': 'Cable Management',
    'services.management.desc': 'Professional cable routing, conduit installation, cable trays, and complete infrastructure management',

    // About
    'about.title': 'About Us',
    'about.p1': 'Geek Head Solutions is a leading provider of professional cabling and security infrastructure services. With years of experience in the industry, we specialize in delivering enterprise-grade solutions for businesses of all sizes.',
    'about.p2': 'Our team of certified technicians brings expertise in structured cabling, network infrastructure, security camera systems, and access control solutions. We pride ourselves on staying current with the latest technologies and industry standards to provide our clients with cutting-edge solutions.',
    'about.p3': 'From data centers to office buildings, we\'ve successfully completed hundreds of installations, ensuring reliable, scalable, and secure infrastructure that supports your business operations.',

    // Why Choose Us
    'why.title': 'Why Choose Us',
    'why.certified.title': 'Certified Professionals',
    'why.certified.desc': 'Our team consists of certified technicians with years of experience',
    'why.fast.title': 'Fast Service',
    'why.fast.desc': 'Quick response times and efficient project completion',
    'why.quality.title': 'Quality Guarantee',
    'why.quality.desc': 'We stand behind our work with comprehensive warranties',

    // Contact
    'contact.title': 'Ready to Get Started?',
    'contact.subtitle': 'Contact us today for a free consultation and quote for your cabling and security needs',
    'contact.call': 'Call Us',
    'contact.email': 'Email Us',

    // Footer
    'footer.rights': 'All rights reserved',
    'footer.tagline': 'Professional Cabling, Security, and Network Solutions',
  },

  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.about': 'Nosotros',
    'nav.whyChooseUs': 'Por Qué Elegirnos',
    'nav.contact': 'Contacto',

    // Header
    'header.title': 'Geek Head Solutions',
    'header.subtitle': 'Soluciones Profesionales de Cableado y Seguridad',

    // Hero
    'hero.title': 'Servicios de Instalación Expertos para su Negocio',
    'hero.subtitle': 'Cableado estructurado profesional, instalación de cámaras de seguridad y soluciones de infraestructura de red',
    'hero.getQuote': 'Solicitar Cotización',
    'hero.ourServices': 'Nuestros Servicios',

    // Services
    'services.title': 'Nuestros Servicios',
    'services.cabling.title': 'Cableado Estructurado',
    'services.cabling.desc': 'Cableado profesional de centros de datos, instalaciones Cat5e/Cat6/Cat6a, cableado de fibra óptica e infraestructura de red',
    'services.cctv.title': 'Cámaras de Seguridad CCTV',
    'services.cctv.desc': 'Instalación de cámaras IP y analógicas, configuración de DVR/NVR, sistemas de monitoreo remoto y evaluaciones de seguridad',
    'services.access.title': 'Control de Acceso',
    'services.access.desc': 'Lectores de tarjetas, sistemas biométricos, cerraduras magnéticas y soluciones integradas de control de acceso',
    'services.telephony.title': 'Sistemas de Telefonía',
    'services.telephony.desc': 'Sistemas telefónicos analógicos e IP, instalación de PBX, soluciones VoIP e infraestructura de telecomunicaciones',
    'services.networks.title': 'Redes de Datos',
    'services.networks.desc': 'Diseño e implementación de redes, soluciones WiFi, switches y routers, optimización de redes',
    'services.management.title': 'Gestión de Cables',
    'services.management.desc': 'Enrutamiento profesional de cables, instalación de conductos, bandejas de cables y gestión completa de infraestructura',

    // About
    'about.title': 'Sobre Nosotros',
    'about.p1': 'Geek Head Solutions es un proveedor líder de servicios profesionales de cableado e infraestructura de seguridad. Con años de experiencia en la industria, nos especializamos en entregar soluciones de nivel empresarial para negocios de todos los tamaños.',
    'about.p2': 'Nuestro equipo de técnicos certificados aporta experiencia en cableado estructurado, infraestructura de redes, sistemas de cámaras de seguridad y soluciones de control de acceso. Nos enorgullecemos de mantenernos actualizados con las últimas tecnologías y estándares de la industria para proporcionar a nuestros clientes soluciones de vanguardia.',
    'about.p3': 'Desde centros de datos hasta edificios de oficinas, hemos completado exitosamente cientos de instalaciones, asegurando infraestructura confiable, escalable y segura que respalda las operaciones de su negocio.',

    // Why Choose Us
    'why.title': 'Por Qué Elegirnos',
    'why.certified.title': 'Profesionales Certificados',
    'why.certified.desc': 'Nuestro equipo está compuesto por técnicos certificados con años de experiencia',
    'why.fast.title': 'Servicio Rápido',
    'why.fast.desc': 'Tiempos de respuesta rápidos y finalización eficiente de proyectos',
    'why.quality.title': 'Garantía de Calidad',
    'why.quality.desc': 'Respaldamos nuestro trabajo con garantías integrales',

    // Contact
    'contact.title': '¿Listo para Comenzar?',
    'contact.subtitle': 'Contáctenos hoy para una consulta gratuita y cotización para sus necesidades de cableado y seguridad',
    'contact.call': 'Llámenos',
    'contact.email': 'Envíenos un Correo',

    // Footer
    'footer.rights': 'Todos los derechos reservados',
    'footer.tagline': 'Soluciones Profesionales de Cableado, Seguridad y Redes',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
