import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Mail, Phone, MapPin, ChevronDown, Award, Briefcase, Code, Brain, Database, Server, Monitor, ExternalLink, Download, Send, Eye } from 'lucide-react';
import emailjs from '@emailjs/browser';
import TextExplosionWelcome from './TextExplosionWelcome';
import ImageCarousel from './ImageCarousel';

// Styles pour les animations
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 1s ease-out forwards;
}
`;

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState({});
  const [visitorCount, setVisitorCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [welcomeProgress, setWelcomeProgress] = useState(0);
  const [welcomeText, setWelcomeText] = useState('');
  const [showVisitorMessage, setShowVisitorMessage] = useState(false);
  const [visitorText, setVisitorText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  // PDF modal for certificates
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfModalUrl, setPdfModalUrl] = useState('');
  const [pdfModalTitle, setPdfModalTitle] = useState('');

  // Dans Portfolio.jsx, remplace par :
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


  // Images du carrousel
  const profileImages = [
    { src: "/images/jo5.jpeg", label: "Développeur"},
    { src: "/images/jo.jpeg", label: "Chercheur IA" },
    { src: "/images/jo10.jpeg", label: "Entrepreneur" },
    { src: "/images/jo11.jpeg", label: "Étudiant" }
  ];

  // Textes rotatifs
  const rotatingTexts = [
    "Développeur Full Stack",
    "Apprenti concepteur de modèle IA",
    "Étudiant en Master Informatique"
  ];
  // Effet de texte rotatif

  // Animation de bienvenue avec barre de progression
  useEffect(() => {
    if (!showWelcome) return;

    const fullText = "Bienvenue sur le portfolio de Mr.JD";
    const duration = 3000; // 3 secondes pour la barre
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);
    let animationFrame;

    const animate = (timestamp) => {
      setWelcomeProgress(prev => {
        if (prev >= 100) return 100;
        return Math.min(prev + increment, 100);
      });

      const textLength = Math.floor((welcomeProgress / 100) * fullText.length);
      setWelcomeText(fullText.substring(0, textLength));

      if (welcomeProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // Afficher le titre principal après l'animation
    const timeout = setTimeout(() => {
      setShowWelcome(false);
    }, duration + 1000); // Attendre un peu après que la barre soit remplie

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [showWelcome, welcomeProgress]);

  // Animation du message visiteur
  useEffect(() => {
    if (!showVisitorMessage) return;

    const fullText = `Bonjour, vous êtes le visiteur n°${visitorCount + 1} du portfolio de Josias DJIOLGOU`;
    let currentIndex = 0;

    const textInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setVisitorText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(textInterval);
        // Cacher le message après 4 secondes
        setTimeout(() => {
          setShowVisitorMessage(false);
        }, 4000);
      }
    }, 50);

    return () => clearInterval(textInterval);
  }, [showVisitorMessage, visitorCount]);

  // Animation texte rotatif (machine à écrire)
  useEffect(() => {
    if (showWelcome || showVisitorMessage) return;

    const currentFullText = rotatingTexts[textIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Mode écriture
        if (typedText.length < currentFullText.length) {
          setTypedText(currentFullText.substring(0, typedText.length + 1));
        } else {
          // Pause avant d'effacer
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Mode effacement
        if (typedText.length > 0) {
          setTypedText(currentFullText.substring(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % rotatingTexts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, textIndex, showWelcome, showVisitorMessage]);

  // Carrousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Compteur de visiteurs
  useEffect(() => {
    const currentCount = parseInt(localStorage.getItem('visitorCount') || '0');
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      const newCount = currentCount + 1;
      localStorage.setItem('visitorCount', newCount.toString());
      localStorage.setItem('lastVisit', today);
      setVisitorCount(newCount);
    } else {
      setVisitorCount(currentCount);
    }
  }, []);


  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      // Envoie l'email via EmailJS
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      if (result.text === 'OK') {
        setFormStatus({
          type: 'success',
          message: '✅ Message envoyé avec succès ! Je vous répondrai bientôt.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: '❌ Erreur lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.'
      });
      console.error('EmailJS Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion du mode sombre avec localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Détection de la section active au scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation au scroll (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  

  const experiences = [
  {
    period: "Sept - Nov 2025",
    title: "Développeur Full Stack",
    company: "Anonyme",
    type: "CDD",
    description: "Le lancement n'a pas encore eu lieu — cette page sera mise à jour dès que le projet sera disponible.",
    achievements: [
      
    ],
    tech: ["Laravel", "php", "MySQL", "Tailwind CSS"],
    images: [
      "/images/ideo1.jpg",
      "/images/ideo2.jpg",
      "/images/ideo3.jpg"
    ]
  },
  {
    period: "Mars - Juin 2025",
    title: "Projet IA - Prédiction de Structures Protéiques",
    company: "Projet Tutoré Universitaire",
    type: "Recherche",
    description: "Conception d'un modèle d'apprentissage automatique pour prédire la structure des protéines à partir de séquences d'acides aminés, optimisé pour machines moins performantes.",
    achievements: [
      "Développement d'un pipeline complet de traitement de données biologiques (FASTA, PDB)",
      "Optimisation du modèle pour fonctionner sur machines peu performantes",
      "Création d'une interface de visualisation des résultats 3D"
    ],
    tech: ["Python", "PyTorch", "Biopython", "Google Colab"],
    links: [
      { text: "GitHub", url: "https://github.com/josi1st/protein_fold", icon: Github },
      { text: "Documentation", url: "https://www.overleaf.com/read/zsxbbmdrqgqr#2e9396", icon: ExternalLink }
    ],
    images: [
      "/images/1.jpg",
      "/images/2.jpg",
      "/images/3.jpg",
      "/images/4.jpg",
      "/images/5.jpg",
      "/images/6.jpg"
    ]
  },
  {
    period: "Août - Sept 2024",
    title: "Stagiaire Développeur Base de Données",
    company: "Ministère des Infrastructures du BF",
    type: "Stage",
    description: "Implémentation de requêtes SQL sous PostgreSQL et développement d'interfaces web avec Symfony/Laravel pour faciliter l'interaction avec la base de données.",
    achievements: [
      "Optimisation de requêtes SQL pour extraction de données statistiques",
      "Développement d'interfaces web intuitives avec Symfony",
      "Migration et adaptation du code vers Laravel"
    ],
    tech: ["PostgreSQL", "Symfony", "Laravel", "SQL"],
    images: [
      "/images/ministere1.jpg",
      "/images/ministere2.jpg"
    ]
  },
  {
    period: "Juil 2024 - Sept 2025",
    title: "Secrétaire Général",
    company: "Club les Intellos du Numérique - UNZ",
    type: "Bénévolat",
    description: "Représentation du club lors de rencontres officielles, organisation de formations et gestion des adhésions membres.",
    achievements: [
      "Organisation de +10 formations bénéficiant à plus de 200 étudiants",
      "Représentation du club auprès des institutions et partenaires",
      "Gestion administrative et coordination des activités"
    ],
    tech: ["Leadership", "Organisation", "Communication", "Gestion"],
    images: [
      "/images/club2.jpeg",
      "/images/club1.jpeg",
      "/images/club3.jpeg"
    ]
  }
];

  const skills = {
    "IA & Machine Learning": {
      items: ["PyTorch", "TensorFlow", "Google Colab", "Jupyter", "Kaggle", "Biopython"],
      icon: Brain,
      color: "blue"
    },
    "Développement Web": {
      items: ["React", "Django", "Laravel", "Symfony", "Bootstrap", "PHP", "JavaScript"],
      icon: Code,
      color: "green"
    },
    "Bases de Données": {
      items: ["PostgreSQL", "MySQL", "Oracle", "Access"],
      icon: Database,
      color: "purple"
    },
    "Langages": {
      items: ["Python", "Java", "JavaScript", "PHP", "C", "HTML5/CSS3"],
      icon: Code,
      color: "orange"
    },
    "Systèmes & Réseaux": {
      items: ["Linux (Ubuntu/Debian)", "Windows", "Cisco Packet Tracer", "Administration Système"],
      icon: Server,
      color: "red"
    },
    "Outils": {
      items: ["Git", "VS Code", "LaTeX", "Microsoft Office", "Docker"],
      icon: Monitor,
      color: "pink"
    }
  };

  const certifications = [
    {
      title: "Objectif IA : Initiez-vous à l'Intelligence Artificielle",
      issuer: "OpenClassrooms",
      date: "Mai 2024",
      credential: "7875365716"
    },
    {
      title: "Intelligence Artificielle pour tous",
      issuer: "Programme FORCE N",
      date: "2024"
    },
    {
      title: "Pilotage de drone pour l'aéromodélisme",
      issuer: "Formation certifiée",
      date: "2023"
    },
    {
      title: "Formation en Informatique",
      issuer: "SERVICE-INFORMATIQUE-TECHNIQUES-COMMERCE GENERAL DU FASO",
      date: "2022"
    }
  ];

  // Ouvre le modal PDF (url doit être un chemin public, ex: '/files/certificates/mon-certificat.pdf')
  const openPdfModal = (url, title) => {
    setPdfModalUrl(url);
    setPdfModalTitle(title || 'Attestation');
    setPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setPdfModalUrl('');
    setPdfModalTitle('');
  };

  const interests = [
    { name: "Recherche en IA", icon: "🔬" },
    { name: "Design & Cinéma 3D", icon: "🎨" },
    { name: "Football", icon: "⚽" },
    { name: "Musique", icon: "🎵" },
    { name: "Jeux vidéo", icon: "🎮" }
  ];

  const stats = [
    { label: "Projets Complétés", value: "10+", icon: Briefcase },
    { label: "Technologies Maîtrisées", value: "20+", icon: Code },
    { label: "Certifications", value: "4+", icon: Award },
    { label: "Note projet tutoré", value: "18.50/20", icon: Award }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => scrollToSection('home')} className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
              Josias DJIOLGOU
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'about', label: 'À Propos' },
                { id: 'experience', label: 'Expériences' },
                { id: 'skills', label: 'Compétences' },
                { id: 'projects', label: 'Projets' },
                { id: 'contact', label: 'Contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative transition-colors ${
                    activeSection === item.id 
                      ? 'text-blue-500 font-semibold' 
                      : darkMode 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Compteur de visiteurs */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <Eye size={16} className="text-blue-500" />
                <span className="text-sm font-semibold">{visitorCount} visiteurs</span>
              </div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-4 py-2 space-y-2">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'about', label: 'À Propos' },
                { id: 'experience', label: 'Expériences' },
                { id: 'skills', label: 'Compétences' },
                { id: 'projects', label: 'Projets' },
                { id: 'contact', label: 'Contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-blue-500 text-white' 
                      : darkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-2">
  {showWelcome ? (
    <TextExplosionWelcome 
      darkMode={darkMode}
      visitorCount={visitorCount}
      onAnimationComplete={() => setShowWelcome(false)}
    />
  ) : (
    <>
      <p className="text-blue-500 font-semibold text-lg animate-fadeIn text-center">
        👋 Bonjour visiteur <span className="font-bold text-green-500">{visitorCount + 1}</span>, je suis
      </p>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold animate-fadeIn text-center">
        <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
          Josias DJIOLGOU
        </span>
      </h1>
      <div className="h-12 mt-4">
        <div className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} transition-opacity duration-300 text-center`}>
          {typedText}
        </div>
      </div>
    </>
  )}
</div>
          <div className="flex flex-col md:flex-row items-center gap-12 border-2 p-6 rounded-xl shadow-lg transition-colors duration-300">
            <div className="flex-1 space-y-6">
              
              <p className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                Etudiant, développeur Full Stack & IA
              </p>
              <p className={`text-lg md:text-xl max-w-2xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-justify`}>
                Licencié en Informatique avec <span className="font-bold text-blue-500">mention Très Bien</span>. 
                Passionné par l'IA appliquée à la santé et aux objets connectés. Actuellement porteur du projet <span className="font-bold text-blue-500">JD Innov</span> specialisé dans les formations et services bureautique, l'infographie, la programmation et IA.
              </p>
              
              {/* Stats rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="text-2xl font-bold text-blue-500">{stat.value}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="https://github.com/josi1st" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
                >
                  <Github size={20} />
                  GitHub
                </a>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className={`px-6 py-3 rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-all hover:scale-105 ${darkMode ? 'text-white' : 'text-blue-500'}`}
                >
                  Me Contacter
                </button>
                {/* CV download link: place your PDF at frontend/public/files/CV.pdf */}
                <a
                  href="/files/CV.pdf"
                  download
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-green-500 hover:bg-green-500 hover:text-white transition-all hover:scale-105 ${darkMode ? 'text-white' : 'text-green-500'}`}
                  aria-label="Télécharger le CV PDF"
                >
                  <Download size={20} />
                  CV PDF
                </a>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 p-1 animate-pulse">
                  <div className={`w-full h-full rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center justify-center overflow-hidden relative`}>
                    <img
                      src={profileImages[currentImageIndex].src}
                      alt={profileImages[currentImageIndex].label}
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover transition-all duration-500"
                    />
                    <div className="text-sm font-semibold mt-2 text-blue-500">
                      {profileImages[currentImageIndex].label}
                    </div>
                    <div className="absolute bottom-4 flex gap-2">
                      {profileImages.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-2 w-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-blue-500 w-4' : 'bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500 rounded-full opacity-20 animate-bounce delay-100"></div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => scrollToSection('about')} 
            className="mt-12 mx-auto block animate-bounce"
            aria-label="Scroll to about section"
          >
            <ChevronDown size={32} className="text-blue-500" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" data-animate className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              À Propos de Moi
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-2xl font-bold mb-4">Mon Parcours</h3>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                  Jeune diplômé en Informatique de l'<strong>Université Norbert ZONGO</strong> avec une <strong className="text-blue-500">mention Très Bien</strong>, je suis passionné par l'Intelligence Artificielle appliquée à la santé et aux objets connectés.
                </p>
              </div>
              
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-2xl font-bold mb-4">Ma Vision</h3>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                  Mon parcours combine <strong>développement full stack</strong> et <strong>expertise en IA</strong>, notamment à travers mon projet de prédiction de structures protéiques utilisant PyTorch et Biopython. Je vise à contribuer à l'innovation dans le domaine de l'e-santé et la télémédecine. J'aspire également à partager mes connaissances à travers l'enseignement et les formations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <MapPin className="text-blue-500" size={24} />
                  <span className="text-lg">Saaba, Ouagadougou, Burkina Faso</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="text-blue-500" size={24} />
                  <a href="mailto:josiasdjiolgou@gmail.com" className="text-lg hover:text-blue-500 transition-colors">
                    josiasdjiolgou@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <Phone className="text-blue-500" size={24} />
                  <span className="text-lg">+226 77087873 / 62846042</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="text-green-500" size={24} />
                  Formation Académique
                </h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border-l-4 border-blue-500`}>
                    <div className="font-bold text-lg">Licence en Informatique</div>
                    <div className="text-blue-500 font-semibold">Mention Très Bien</div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Université Norbert ZONGO - Juillet 2025
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border-l-4 border-green-500`}>
                    <div className="font-bold text-lg">BAC +2 en Informatique</div>
                    <div className="text-green-500 font-semibold">Mention Bien</div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Université Norbert ZONGO - Juillet 2024
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border-l-4 border-purple-500`}>
                    <div className="font-bold text-lg">Baccalauréat Série D</div>
                    <div className="text-purple-500 font-semibold">Mention Assez Bien</div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Mathématiques et Sciences - Juillet 2021
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
    Compétences Linguistiques
  </h3>
  
  <div className="space-y-6">
    {/* Gulmancema */}
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">BF</span>
        <span className="font-bold text-lg">Gulmancema</span>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
          Langue Maternelle
        </span>
      </div>
      
      <div className="space-y-3 ml-11">
        {/* Écrit */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ecrit
            </span>
            <span className="text-sm font-bold text-yellow-500">50%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '50%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Passable</span>
        </div>
        
        {/* Oral */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Oral
            </span>
            <span className="text-sm font-bold text-yellow-500">50%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '50%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Passable</span>
        </div>
        
        {/* Compréhension */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Compréhension
            </span>
            <span className="text-sm font-bold text-blue-500">75%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '75%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bien</span>
        </div>
      </div>
    </div>  

    {/* Séparateur */}
    <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>

{/* Moore */}
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">BF</span>
        <span className="font-bold text-lg">Moore</span>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
          Langue nationale
        </span>
      </div>
      
      <div className="space-y-3 ml-11">
        {/* Ecrit */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ecrit
            </span>
            <span className="text-sm font-bold text-yellow-500">50%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '50%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Passable</span>
        </div>
        
        {/* Oral */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Oral
            </span>
            <span className="text-sm font-bold text-green-500">95%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '95%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Excellent</span>
        </div>
        
        {/* Compréhension */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Compréhension
            </span>
            <span className="text-sm font-bold text-green-500">100%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '100%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Natif</span>
        </div>
      </div>
    </div>

    {/* Séparateur */}
    <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>

    {/* Français */}
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🇫🇷</span>
        <span className="font-bold text-lg">Français</span>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
          Langue administrative
        </span>
      </div>
      
      <div className="space-y-3 ml-11">
        {/* Écrit */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Écrit
            </span>
            <span className="text-sm font-bold text-green-500">95%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '95%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Excellent</span>
        </div>
        
        {/* Oral */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Oral
            </span>
            <span className="text-sm font-bold text-green-500">95%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '95%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Excellent</span>
        </div>
        
        {/* Compréhension */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Compréhension
            </span>
            <span className="text-sm font-bold text-green-500">100%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '100%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Natif</span>
        </div>
      </div>
    </div>

    {/* Séparateur */}
    <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>

    {/* Anglais */}
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🇬🇧</span>
        <span className="font-bold text-lg">Anglais</span>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
          Niveau Intermédiaire
        </span>
      </div>
      
      <div className="space-y-3 ml-11">
        {/* Écrit */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Écrit
            </span>
            <span className="text-sm font-bold text-blue-500">70%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '70%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bien</span>
        </div>
        
        {/* Oral */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Oral
            </span>
            <span className="text-sm font-bold text-yellow-500">50%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '50%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Passable</span>
        </div>
        
        {/* Compréhension */}
        <div>
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Compréhension
            </span>
            <span className="text-sm font-bold text-blue-500">75%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: '75%' }}
            ></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bien</span>
        </div>
      </div>
    </div>
  </div>

  {/* Légende des niveaux */}
  <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
    <div className="flex flex-wrap gap-3 justify-center text-xs">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Excellent (90-100%)</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Bien (70-89%)</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Passable (50-69%)</span>
      </div>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
<section id="experience" data-animate className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold mb-4 text-center">
      <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
        Expériences Professionnelles
      </span>
    </h2>
    <p className={`text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      Mon parcours professionnel et mes réalisations
    </p>
    
    <div className="space-y-8">
      {experiences.map((exp, idx) => (
        <div 
          key={idx} 
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-2xl transition-all`}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Contenu de l'expérience (2/3) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Briefcase className="text-blue-500 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="text-xl font-bold text-blue-500">{exp.title}</h3>
                      <p className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {exp.company}
                      </p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                        exp.type === 'CDD' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        exp.type === 'Stage' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        exp.type === 'Recherche' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {exp.type}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm mt-2 md:mt-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} px-4 py-2 rounded-full font-semibold whitespace-nowrap`}>
                  📅 {exp.period}
                </span>
              </div>
              
              <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {exp.description}
              </p>
              
              {exp.achievements && (
                <div>
                  <h4 className="font-semibold mb-2 text-green-500">Réalisations clés :</h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {exp.tech.map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm rounded-full font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {exp.links && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {exp.links.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <a 
                        key={i} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors font-semibold hover:underline text-sm"
                      >
                        <Icon size={16} />
                        {link.text} →
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Carrousel d'images (1/3) */}
            <div className="md:col-span-1">
              <div className="h-64 md:h-full min-h-[250px]">
                <ImageCarousel images={exp.images} darkMode={darkMode} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Skills Section */}
      <section id="skills" data-animate className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Compétences Techniques
            </span>
          </h2>
          <p className={`text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Technologies et outils que je maîtrise
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.entries(skills).map(([category, data]) => {
              const Icon = data.icon;
              const colorClasses = {
                blue: 'text-blue-500',
                green: 'text-green-500',
                purple: 'text-purple-500',
                orange: 'text-orange-500',
                red: 'text-red-500',
                pink: 'text-pink-500'
              };
              
              return (
                <div 
                  key={category} 
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-xl transition-all hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={colorClasses[data.color]} size={28} />
                    <h3 className="text-lg font-bold">{category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.items.map((item, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1 text-sm rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'} transition-colors cursor-default shadow-sm`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="text-yellow-500" size={28} />
                Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 text-xl mt-1">✓</span>
                      <div className="flex-1">
                        <div className="font-semibold">{cert.title}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {cert.issuer}
                        </div>
                        <div className="text-sm text-blue-500 mt-1">{cert.date}</div>
                        {cert.credential && (
                          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Credential: {cert.credential}
                          </div>
                        )}
                        {/* Voir le PDF si fourni: ajoutez `pdf: '/files/certificates/nom.pdf'` dans l'objet cert */}
                        {cert.pdf && (
                          <div className="mt-3">
                            <button
                              onClick={() => openPdfModal(cert.pdf, cert.title)}
                              className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                            >
                              Voir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="text-2xl font-bold mb-6">Centres d'Intérêt</h3>
              <div className="space-y-3">
                {interests.map((interest, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} hover:shadow-lg transition-all hover:scale-105 cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{interest.icon}</span>
                      <span className="font-semibold text-lg">{interest.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" data-animate className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Projets Phares
            </span>
          </h2>
          <p className={`text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Découvrez mes réalisations les plus marquantes
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Projet 1: JD Innov */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-5xl">🚀</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  JD Innov
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-green-500">
                Entreprise de Services Numériques
              </h3>
              <div className="mb-4 flex justify-center gap-2 flex-wrap">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                  Entrepreneuriat
                </span>
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                  Services IT
                </span>
              </div>
              
              <p className={`mb-4 text-center font-semibold text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Votre partenaire digital, fiable et créatif"
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-3xl mb-2 text-center">💼</div>
                  <h4 className="font-bold text-center mb-2">Bureautique</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Formation</li>
                    <li>• Saisie de documents</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-3xl mb-2 text-center">🎨</div>
                  <h4 className="font-bold text-center mb-2">Infographie</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Affiches, flyers</li>
                    <li>• Vidéos</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-3xl mb-2 text-center">🔧</div>
                  <h4 className="font-bold text-center mb-2">Maintenance</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Dépannage</li>
                    <li>• Installation</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-3xl mb-2 text-center">💻</div>
                  <h4 className="font-bold text-center mb-2">Développement</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Sites web</li>
                    <li>• Applications IA</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {['Web Design', 'IA', 'Formation', 'Support IT', 'Infographie'].map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm rounded-full font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold text-lg shadow-lg">
                  <Briefcase size={20} />
                  Fondateur & CEO
                </span>
              </div>
            </div>

            {/* Projet 2: Prédiction de Structures Protéiques */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
              <div className="text-6xl mb-4 text-center">🧬</div>
              <h3 className="text-2xl font-bold mb-3 text-center">
                Prédiction de Structures Protéiques
              </h3>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                  Intelligence Artificielle
                </span>
                <span className="inline-block ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                  Bioinformatique
                </span>
              </div>
              
              <p className={`mb-4 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Modèle d'apprentissage automatique innovant utilisant <strong>PyTorch</strong> pour prédire la structure 3D des protéines à partir de séquences d'acides aminés, spécialement optimisé pour fonctionner sur des machines peu performantes.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Pipeline complet de traitement de données biologiques (FASTA, PDB)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Interface de visualisation des résultats en 3D
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Entraînement et déploiement sur Google Colab
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Documentation scientifique complète sur Overleaf
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Python', 'PyTorch', 'Biopython', 'Google Colab', 'NumPy'].map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-3">
                <a 
                  href="https://github.com/josi1st/protein_fold" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                >
                  <Github size={20} />
                  Code Source
                </a>
                <a 
                  href="https://www.overleaf.com/read/zsxbbmdrqgqr#2e9396" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-all font-semibold ${darkMode ? 'text-white' : 'text-blue-500'}`}
                >
                  <ExternalLink size={20} />
                  Documentation
                </a>
              </div>
            </div>

            {/* Projet 1: JD Innov - remplacé par message de préparation */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-all`}>
              <div className="text-5xl mb-4 text-center">🚧</div>
              <h3 className="text-2xl font-bold mb-3 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}">Projet en préparation</h3>
              <p className={`mb-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Mr.JD est actuellement en stage de developpement pour le lancement d'un projet iminent. Le lancement n'a pas encore eu lieu — cette page sera mise à jour dès que le projet sera disponible.
              </p>
              <ul className={`mb-4 list-disc list-inside ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Architecture produit et roadmap</li>
                <li>Design UX et prototypes internes</li>
                <li>Tests internes et préparation du déploiement</li>
              </ul>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Être informé / Me contacter
                </button>
                <button
                  disabled
                  className="px-4 py-2 border rounded-lg text-gray-500 cursor-not-allowed"
                  aria-disabled="true"
                >
                  Page indisponible
                </button>
              </div>
            </div>

          </div>

          {/* Autres projets en grille */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Autres Contributions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Gestion Base de Données",
                  icon: "💾",
                  description: "Interface web pour le Ministère des Infrastructures",
                  tech: ["PostgreSQL", "Symfony", "Laravel"]
                },
                {
                  title: "Formations Étudiantes",
                  icon: "🎓",
                  description: "Organisation de +10 formations en bureautique",
                  tech: ["Microsoft Office", "Pédagogie", "Leadership"]
                },
                {
                  title: "Gestion Associative",
                  icon: "👥",
                  description: "Secrétaire Général du Club les Intellos du Numérique",
                  tech: ["Communication", "Gestion", "Organisation"]
                }
              ].map((project, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                >
                  <div className="text-4xl mb-3 text-center">{project.icon}</div>
                  <h4 className="text-lg font-bold mb-2 text-center">{project.title}</h4>
                  <p className={`text-sm mb-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {project.tech.map((tech, i) => (
                      <span 
                        key={i} 
                        className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" data-animate className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Me Contacter
            </span>
          </h2>
          <p className={`text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            N'hésitez pas à me contacter pour toute opportunité ou collaboration
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire de contact */}
            <div>
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}>
                <h3 className="text-2xl font-semibold mb-4">Envoyez-moi un message</h3>
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors resize-none ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Votre message..."
                    ></textarea>
                  </div>

                  {formStatus.message && (
                    <div className={`p-4 rounded-lg ${
                      formStatus.type === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {formStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all hover:scale-105 shadow-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              </div>

              {/* Informations de disponibilité */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-4">Je suis ouvert à :</h3>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Masters en <strong>e-santé, télémédecine ou bioinformatique</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Stages en <strong>health tech</strong> et <strong>IA médicale</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Postes en <strong>développement IA/IoT</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Collaborations sur des <strong>projets innovants</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Coordonnées et références */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold mb-4">Coordonnées directes</h3>
                <a 
                  href="mailto:josiasdjiolgou@gmail.com" 
                  className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-105 shadow-md`}
                >
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      josiasdjiolgou@gmail.com
                    </div>
                  </div>
                </a>
                
                <a 
                  href="tel:+22677087873" 
                  className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-105 shadow-md`}
                >
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Téléphone</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      +226 77087873 / 62846042
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://github.com/josi1st" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-105 shadow-md`}
                >
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <Github className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">GitHub</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      github.com/josi1st
                    </div>
                  </div>
                </a>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="text-yellow-500" size={24} />
                  Références Académiques & Professionnelles
                </h3>
                
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border-l-4 border-blue-500`}>
                    <div className="font-bold">Pr Frederic OUEDRAOGO</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Université Norbert ZONGO
                    </div>

                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border-l-4 border-green-500`}>
                    <div className="font-bold">Dr Mahamadi BOULOU</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Université Norbert ZONGO
                    </div>
                    
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border-l-4 border-purple-500`}>
                    <div className="font-bold">M. Inoussa MOYENGA</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      DSI Ministère des Infrastructures
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                © 2025 Yienpagdi Josias Sylvestre DJIOLGOU
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Tous droits réservés
              </p>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://github.com/josi1st" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'} transition-colors`}
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:josiasdjiolgou@gmail.com"
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'} transition-colors`}
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Développé avec ❤️ en React & Tailwind CSS
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Spécialisé en IA pour la Santé & IoT | Burkina Faso 🇧🇫
            </p>
            <p className={`text-xs mt-2 flex items-center justify-center gap-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              <Eye size={14} />
              <span>{visitorCount} visiteurs au total</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;