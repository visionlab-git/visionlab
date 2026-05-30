import React, { useState } from 'react';
import { 
  BookOpen, 
  Mail, 
  MessageCircle, 
  Heart, 
  ChevronLeft,
  GraduationCap,
  User,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Code,
  Layers,
  Cpu,
  MousePointer2,
  ExternalLink,
  GitBranch,
  PlayCircle,
  HelpCircle,
  Wand2,
  Focus,
  Eye,
  FileCode,
  History,
  Terminal,
  Coffee
} from 'lucide-react';

/**
 * Support.jsx - Guide Utilisateur Complet VisionLab
 * Conçu pour l'excellence académique à l'Université de Yaoundé 1.
 * Contient les instructions détaillées pour l'utilisation des chapitres 1 à 6.
 */
export default function Support({ onBack }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [showDonateSuccess, setShowDonateSuccess] = useState(false);

  const chapterDetails = [
    {
      id: 'ch1',
      title: "Chapitre 1 : Traitement de base",
      shortDesc: "Manipulation fondamentale de l'image : luminosité, contraste, histogramme et transformations géométriques simples.",
      icon: <Zap className="text-blue-400" />,
      howItWorks: "Le traitement de base opère directement sur les pixels individuels (opérations ponctuelles). On transforme chaque intensité f(x,y) en une nouvelle intensité g(x,y) par une fonction de transfert.",
      features: [
        {
          name: "Luminosité & Contraste",
          desc: "Ajuste la clarté globale et la dynamique des couleurs de l'image.",
          usage: "Utilisez les curseurs rotatifs pour augmenter ou diminuer l'intensité lumineuse. Un contraste élevé sépare mieux les zones claires des zones sombres."
        },
        {
          name: "Égalisation d'Histogramme",
          desc: "Rééquilibre automatiquement la distribution des niveaux de gris pour améliorer les détails.",
          usage: "Cliquez sur le bouton 'Égalisation' pour étaler les niveaux de gris sur toute la plage [0-255]. Idéal pour les images trop sombres ou délavées."
        },
        {
          name: "Opérations Arithmétiques",
          desc: "Addition, soustraction et multiplication entre deux images.",
          usage: "Sélectionnez une opération, puis téléchargez une seconde image. L'application combinera les pixels des deux sources selon l'opérateur choisi."
        },
        {
          name: "Interpolation d'Image",
          desc: "Re-échantillonnage de l'image (Plus Proche Voisin, Bilinéaire, Bicubique).",
          usage: "Essentiel pour observer comment les algorithmes recréent des pixels manquants lors de l'agrandissement."
        },
        {
          name: "Recadrage (Crop)",
          desc: "Sélection d'une sous-zone spécifique de l'image originale.",
          usage: "Activez le recadrage pour isoler une partie de l'image. Les coordonnées X/Y et la taille sont définies en pourcentage pour une précision maximale."
        },
        {
          name: "Super Résolution (10K+)",
          desc: "Augmentation massive des pixels par interpolation et filtrage de netteté.",
          usage: "Permet d'exporter une image de basse résolution vers des formats pro (4K, 5K, 10K). L'algorithme combine l'interpolation Bicubique et un masque de netteté pour rendre l'image plus claire."
        }
      ]
    },
    {
      id: 'ch2',
      title: "Chapitre 2 : Convolution",
      shortDesc: "Filtrage spatial utilisant des masques de convolution pour le lissage et le rehaussement.",
      icon: <ShieldCheck className="text-purple-400" />,
      howItWorks: "La convolution déplace un masque (kernel) sur toute l'image. Chaque nouveau pixel est la somme pondérée du pixel original et de ses voisins proches.",
      features: [
        {
          name: "Filtres Passe-bas (Moyenneur/Gaussien)",
          desc: "Réduit les détails fins et les bruits haute fréquence (floutage).",
          usage: "Appliquez le filtre de moyenne pour un flou uniforme ou le lissage gaussien pour un résultat plus naturel respectant mieux les structures."
        },
        {
          name: "Filtre Médian",
          desc: "Excellent pour supprimer le bruit de type 'poivre et sel' sans trop dégrader les contours.",
          usage: "Remplace chaque pixel par la valeur médiane de son voisinage. Très efficace pour le nettoyage d'images dégradées."
        },
        {
          name: "Filtre Passe-haut",
          desc: "Accentue les transitions brusques de luminosité.",
          usage: "Utilisé pour rehausser les détails fins et les bords. Attention : ce filtre augmente également la visibilité du bruit."
        }
      ]
    },
    {
      id: 'ch3',
      title: "Chapitre 3 : Transformée de Fourier",
      shortDesc: "Analyse fréquentielle de l'image via la Fast Fourier Transform (FFT).",
      icon: <Globe className="text-pink-400" />,
      howItWorks: "On passe du domaine spatial au domaine fréquentiel. L'image est décomposée en une somme de sinus et de cosinus de différentes fréquences et orientations.",
      features: [
        {
          name: "Spectre de Magnitude",
          desc: "Visualise l'énergie de l'image dans le domaine complexe.",
          usage: "Affiche une carte où le centre représente les basses fréquences. Les points lumineux éloignés du centre indiquent des motifs périodiques."
        },
        {
          name: "Filtrage Idéal (LPF/HPF)",
          desc: "Coupe les fréquences au-delà ou en deçà d'un certain rayon.",
          usage: "Le Passe-bas de Fourier (Ideal LPF) conserve uniquement le centre du spectre, produisant un flou parfait."
        }
      ]
    },
    {
      id: 'ch4',
      title: "Chapitre 4 : Détection de Contours",
      shortDesc: "Extraction des frontières d'objets par calcul de gradients et laplaciens.",
      icon: <Focus className="text-orange-400" />,
      howItWorks: "Les contours correspondent aux zones de changement brusque d'intensité. On utilise des opérateurs de dérivation (Gradient, Laplacien) pour les mettre en évidence.",
      features: [
        {
          name: "Opérateurs Sobel & Prewitt",
          desc: "Méthodes basées sur le gradient pour détecter les bords verticaux et horizontaux.",
          usage: "Combine les dérivées partielles en X et Y pour calculer la magnitude globale du contour."
        },
        {
          name: "Laplacien",
          desc: "Dérivée seconde de l'image pour trouver les points d'inflexion.",
          usage: "Détecte les contours de manière isotrope (dans toutes les directions simultanément)."
        }
      ]
    },
    {
      id: 'ch5',
      title: "Chapitre 5 : Segmentation",
      shortDesc: "Extraction de régions d'intérêt par analyse de seuils.",
      icon: <Eye className="text-green-400" />,
      howItWorks: "La segmentation divise l'image en parties homogènes. Le seuillage est la méthode la plus simple, transformant l'image en binaire (noir et blanc).",
      features: [
        {
          name: "Seuillage Manuel",
          desc: "Définit un niveau fixe pour binariser l'image.",
          usage: "Ajustez le curseur de seuil : tout pixel au-dessus devient blanc, tout pixel en-dessous devient noir."
        },
        {
          name: "Méthode d'Otsu",
          desc: "Calcul automatique du seuil optimal en maximisant la variance inter-classe.",
          usage: "Parfait quand l'histogramme de l'image possède deux pics distincts (objet et fond)."
        }
      ]
    },
    {
      id: 'ch6',
      title: "Chapitre 6 : Morphologie Mathématique",
      shortDesc: "Traitement non-linéaire basé sur la forme des objets.",
      icon: <Wand2 className="text-teal-400" />,
      howItWorks: "La morphologie utilise un 'élément structurant' pour sonder l'image. On compare la forme locale de l'image avec celle du masque.",
      features: [
        {
          name: "Érosion & Dilatation",
          desc: "Opérations de base pour réduire ou étendre les formes.",
          usage: "L'érosion élimine les petits bruits blancs ; la dilatation bouche les petits trous noirs dans les objets."
        },
        {
          name: "Ouverture & Fermeture",
          desc: "Combinaisons pour nettoyer l'image sans changer radicalement la taille des objets.",
          usage: "L'ouverture supprime les petits éléments ; la fermeture fusionne les éléments proches."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-indigo-600/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 h-16 md:h-20 glass z-50 border-b border-slate-800/50 px-3 md:px-12 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-slate-800/50 hover:bg-slate-700 transition-all text-xs md:text-sm font-bold uppercase tracking-wider border border-slate-700 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Retour au</span> Studio
        </button>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Documentation Interactive</span>
          </div>
          <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-sm md:text-xl font-black uppercase tracking-tighter">Vision<span className="text-blue-500">Lab</span> <span className="hidden sm:inline">Support</span></h1>
        </div>
        </div>
      </header>

      <main className="relative pt-24 md:pt-32 pb-16 md:pb-32 px-4 md:px-6 max-w-6xl mx-auto z-10">
        {/* Intro Hero Section */}
        <section className="text-center space-y-6 md:space-y-10 mb-16 md:mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex p-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[40px] text-blue-500 mb-4 shadow-2xl relative group overflow-hidden border border-slate-800">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl group-hover:blur-3xl transition-all"></div>
            <img src="/logo.png" alt="VisionLab Big Logo" className="w-20 h-20 md:w-32 md:h-32 object-cover relative z-10" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-8xl font-black text-white leading-[1] tracking-tighter">
            Guide du <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Labo Numérique
            </span>
          </h2>
          <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium px-2">
            Explorez les fondements mathématiques du traitement d'image. Ce manuel interactif vous accompagne dans l'utilisation de VisionLab pour vos projets académiques et personnels.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 pt-4 md:pt-6">
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800 text-xs md:text-sm font-bold text-slate-400 hover:border-blue-500/30 transition-colors">
              <Terminal size={14} className="text-blue-400" /> Algorithmes JS
            </div>
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800 text-xs md:text-sm font-bold text-slate-400 hover:border-purple-500/30 transition-colors">
              <Cpu size={14} className="text-purple-400" /> GPU-Friendly
            </div>
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800 text-xs md:text-sm font-bold text-slate-400 hover:border-teal-500/30 transition-colors">
              <Layers size={14} className="text-teal-400" /> Binaire
            </div>
          </div>
        </section>

        {/* User Guide Workflow */}
        <section className="mb-16 md:mb-32 space-y-10 md:space-y-16">
            <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
                <div className="px-4 py-1.5 rounded-full bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Flux de Travail</div>
                <h3 className="text-2xl md:text-4xl font-black text-white">Comment démarrer ?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative">
                <div className="hidden md:block absolute top-[25%] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                
                {[
                    { step: "01", title: "Importation", desc: "Téléchargez votre image source (JPG, PNG) dans la zone de dépôt interactive.", icon: <ArrowRight /> },
                    { step: "02", title: "Sélection du Module", desc: "Choisissez l'un des 6 chapitres dans la barre latérale selon vos besoins d'analyse.", icon: <PlayCircle /> },
                    { step: "03", title: "Exportation", desc: "Comparez vos résultats et téléchargez l'image traitée en haute résolution.", icon: <ExternalLink /> }
                ].map((item, i) => (
                    <div key={i} className="relative z-10 p-5 md:p-8 rounded-2xl md:rounded-[40px] bg-slate-900/40 border border-slate-800/50 flex flex-col items-center text-center space-y-4 md:space-y-6">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xl font-black text-blue-500 shadow-xl">
                            {item.step}
                        </div>
                        <h4 className="text-xl font-bold text-white">{item.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Interactive Chapters Grid */}
        <section className="space-y-12 md:space-y-20 mb-16 md:mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800"></div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Exploration des Chapitres</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {chapterDetails.map((chapter) => (
              <div 
                key={chapter.id} 
                className={`flex flex-col rounded-2xl md:rounded-[32px] bg-slate-900/40 border transition-all duration-700 overflow-hidden group/card ${
                  expandedSection === chapter.id 
                    ? 'border-blue-500/50 ring-1 ring-blue-500/50 shadow-[0_0_80px_rgba(59,130,246,0.15)] md:col-span-2 bg-slate-900/80' 
                    : 'border-slate-800/50 hover:bg-slate-900/60 hover:border-slate-700 hover:-translate-y-1'
                }`}
              >
                <div className="p-5 md:p-10 flex-1 space-y-5 md:space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="p-3 md:p-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl shadow-inner group-hover/card:scale-110 transition-transform duration-500">
                      {chapter.icon}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-slate-800">
                        {chapter.id.toUpperCase()}
                        </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-xl md:text-3xl font-black text-white group-hover/card:text-blue-400 transition-colors">{chapter.title}</h4>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">{chapter.shortDesc}</p>
                  </div>

                  {expandedSection === chapter.id && (
                    <div className="pt-6 md:pt-10 border-t border-slate-800 animate-in fade-in zoom-in duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                          <div className="space-y-10">
                            <h5 className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
                                <Info size={14} /> Concepts Clefs
                            </h5>
                            {chapter.features.map((feature, idx) => (
                                <div key={idx} className="group/feat space-y-3 md:space-y-4 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-950/50 border border-slate-800 transition-all hover:border-blue-500/30">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                                        <CheckCircle2 size={16} />
                                      </div>
                                      <h6 className="font-black text-lg text-slate-100">{feature.name}</h6>
                                    </div>
                                    <p className="text-sm text-slate-400 pl-1 leading-relaxed">{feature.desc}</p>
                                    <div className="pl-1 pt-2 flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-900 border-dashed">
                                        <MousePointer2 size={14} className="text-blue-400 mt-0.5 shrink-0" />
                                        <p className="text-[12px] text-blue-300 font-medium leading-relaxed">{feature.usage}</p>
                                    </div>
                                </div>
                            ))}
                          </div>
                          <div className="space-y-8">
                             <h5 className="flex items-center gap-2 text-xs font-black text-purple-500 uppercase tracking-widest">
                                <FileCode size={14} /> Vue Technique
                            </h5>
                            <div className="p-5 md:p-8 rounded-2xl md:rounded-[40px] bg-slate-950 border border-slate-800 space-y-4 md:space-y-6">
                                <div className="flex items-center gap-3">
                                    <Terminal size={20} className="text-purple-400" />
                                    <span className="text-xs font-bold text-slate-500">Logique mathématique</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed italic">
                                    "{chapter.howItWorks}"
                                </p>
                                <div className="pt-6 space-y-4 border-t border-slate-800">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Complexité Algorithmique</span>
                                        <span className="text-purple-400">O(N × M)</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <History size={14} className="text-blue-500" />
                                    <span className="text-[10px] font-bold text-blue-300/80 uppercase">Historique d'implémentation v1.2</span>
                                </div>
                            </div>
                            <div className="p-5 md:p-8 rounded-2xl md:rounded-[40px] bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-indigo-500/10 space-y-3 md:space-y-4">
                                <h6 className="text-sm font-black text-slate-100 flex items-center gap-2">
                                    <HelpCircle size={14} className="text-indigo-400" /> Astuce d'Expert
                                </h6>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Pour un résultat optimal, assurez-vous que l'image source est bien contrastée avant d'appliquer les filtres du chapitre {chapter.id.replace('ch','')}.
                                </p>
                            </div>
                          </div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setExpandedSection(expandedSection === chapter.id ? null : chapter.id)}
                    className={`mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                      expandedSection === chapter.id 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_15px_40px_rgba(59,130,246,0.3)] scale-[1.02]' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {expandedSection === chapter.id ? "Masquer les détails" : "Voir plus de détails"}
                    <ArrowRight size={16} className={`transition-transform duration-500 ${expandedSection === chapter.id ? '-rotate-90 scale-125' : 'rotate-0'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Troubleshooting & FAQ */}
        <section className="mb-48 grid lg:grid-cols-1 gap-8">
           <div className="flex flex-col items-center gap-4 text-center mb-12">
              <div className="px-4 py-1.5 rounded-full bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Résolution de Problèmes</div>
              <h3 className="text-2xl md:text-4xl font-black text-white">Questions Fréquentes</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { 
                  q: "Pourquoi certains filtres sont-ils plus lents ?", 
                  a: "Les algorithmes comme la FFT (C3) ou le Filtre Médian (C2) effectuent des calculs sur des millions de pixels simultanément. VisionLab utilise des 'Typed Arrays' pour optimiser les performances, mais le temps dépend de votre image originale.",
                  icon: <Cpu className="text-blue-500" />
                },
                { 
                  q: "Puis-je combiner les chapitres ?", 
                  a: "Oui, l'application fonctionne par accumulation. Vous pouvez filtrer (C2), segmenter (C5) puis appliquer de la morphologie (C6). C'est la base de tout pipeline de Computer Vision.",
                  icon: <Layers className="text-purple-500" />
                },
                { 
                  q: "Le mode Comparaison ne s'affiche pas ?", 
                  a: "Le mode comparaison nécessite qu'un traitement ait été appliqué avec succès. Cliquez sur un module, puis activez 'Comparer' pour voir le slider interactif séparant l'original du résultat.",
                  icon: <AlertCircle className="text-pink-500" />
                },
                { 
                  q: "Support des formats d'images", 
                  a: "VisionLab supporte les formats JPG, PNG et WebP. Pour de meilleurs résultats avec Otsu ou Fourier, préférez des images avec une résolution entre 512px et 2048px.",
                  icon: <Globe className="text-teal-500" />
                }
              ].map((item, i) => (
                <div key={i} className="p-5 md:p-8 rounded-2xl md:rounded-[40px] bg-white/5 border border-white/5 space-y-3 md:space-y-4 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl group-hover:bg-slate-800 transition-colors">
                        {item.icon}
                    </div>
                    <h4 className="font-black text-lg text-white leading-tight">{item.q}</h4>
                  </div>
                  <p className="text-sm text-slate-400 pl-1 leading-relaxed">{item.a}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Academic Detailed Credits & Contact */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start mb-24 md:mb-48">
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-blue-500/20">
                Pôle Excellence Académique
              </div>
              <h2 className="text-3xl md:text-6xl font-black text-white leading-[1] tracking-tighter">Université de <br/>Yaoundé 1</h2>
              <div className="space-y-6">
                <p className="text-base md:text-xl text-slate-400 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 md:pl-8">
                  "L'excellence académique au service de l'innovation numérique et du rayonnement scientifique du Cameroun." 
                </p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest pl-8">
                    — Département d'Informatique, Faculté des Sciences.
                </p>
              </div>
            </div>

            <div className="grid gap-8">
              <div className="group flex flex-col sm:flex-row items-start gap-4 md:gap-8 p-6 md:p-10 rounded-2xl md:rounded-[48px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl transition-all hover:border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]"></div>
                <div className="p-3 md:p-5 bg-blue-600 rounded-xl md:rounded-[28px] text-white shadow-2xl shadow-blue-600/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0">
                  <User size={24} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Supervision Académique</h4>
                  <p className="text-lg md:text-3xl font-black text-white tracking-tighter leading-tight">Pr TAPAMO KENFACK HIPPOLYTE</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Spécialiste de renommée en Vision par Ordinateur et Intelligence Artificielle.</p>
                </div>
              </div>

              <div className="group flex flex-col sm:flex-row items-start gap-4 md:gap-8 p-6 md:p-10 rounded-2xl md:rounded-[48px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl transition-all hover:border-purple-500/30 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px]"></div>
                <div className="p-3 md:p-5 bg-purple-600 rounded-xl md:rounded-[28px] text-white shadow-2xl shadow-purple-600/40 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-1">Architecture & Code</h4>
                  <p className="text-lg md:text-3xl font-black text-white tracking-tighter leading-tight">NASSARAMADJI NASAIRE</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Étudiant Licence 3 - Informatique (Promotion 2026).</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-8 pt-6 md:pt-8 px-2 md:px-6">
                <div className="flex -space-x-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xl relative group/avatar">
                           <img src={`https://i.pravatar.cc/100?img=${i+40}`} alt="Collaborateur" className="opacity-70 grayscale group-hover/avatar:grayscale-0 group-hover/avatar:scale-110 transition-all cursor-pointer" />
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-slate-950 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-2xl">
                        +24
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Communauté VisionLab</p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none">Faculté des Sciences, UY1</p>
                </div>
            </div>
          </div>

          {/* Form & Support Card with Glassmorphism */}
          <div className="lg:sticky lg:top-32 glass-panel p-6 md:p-12 rounded-2xl md:rounded-[56px] space-y-8 md:space-y-12 border-slate-700/30 shadow-[0_50px_150px_rgba(0,0,0,0.5)] relative overflow-hidden group/formCard">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] group-hover/formCard:bg-blue-600/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-[120px] group-hover/formCard:bg-purple-600/20 transition-all duration-1000"></div>
            
            <div className="space-y-6 relative z-10">
                <div className="p-4 bg-slate-950/80 rounded-3xl w-fit border border-slate-800 shadow-inner">
                    <ChatBubble size={24} className="text-blue-500" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none">Restons en Contact</h3>
                    <p className="text-slate-400 text-base leading-relaxed font-medium font-serif italic text-center sm:text-left">"Construisons ensemble l'avenir de l'imagerie numérique."</p>
                </div>
            </div>
            
            <div className="grid gap-5 relative z-10">
              <a 
                href="mailto:visionlab.contacts@gmail.com" 
                className="flex items-center justify-between p-4 md:p-8 rounded-xl md:rounded-[36px] bg-slate-900/40 hover:bg-slate-800 border border-slate-800/50 hover:border-blue-500/50 transition-all group/link"
              >
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="p-3 md:p-4 bg-blue-600/10 rounded-xl md:rounded-2xl text-blue-400 group-hover/link:bg-blue-600 group-hover/link:text-white group-hover/link:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="text-left space-y-1 min-w-0">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Support Technique</p>
                    <span className="font-bold text-xs md:text-base text-slate-100 italic truncate block">visionlab.contacts@gmail.com</span>
                  </div>
                </div>
                <ArrowRight size={24} className="text-slate-800 group-hover/link:text-blue-500 group-hover/link:translate-x-3 transition-all duration-500" />
              </a>

              <a 
                href="https://wa.me/237686013300" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 md:p-8 rounded-xl md:rounded-[36px] bg-slate-900/40 hover:bg-slate-800 border border-slate-800/50 hover:border-green-500/50 transition-all group/link"
              >
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="p-3 md:p-4 bg-green-600/10 rounded-xl md:rounded-2xl text-green-400 group-hover/link:bg-green-600 group-hover/link:text-white group-hover/link:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-500 shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div className="text-left space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Ligne Directe</p>
                    <span className="font-bold text-lg text-slate-100 italic">Contacter par WhatsApp</span>
                  </div>
                </div>
                <ArrowRight size={24} className="text-slate-800 group-hover/link:text-green-500 group-hover/link:translate-x-3 transition-all duration-500" />
              </a>
            </div>

            <div className="pt-4 space-y-4">
               {showDonateSuccess ? (
                 <div className="p-8 rounded-[36px] bg-green-500/10 border border-green-500/20 text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-black text-white">Merci pour votre Don !</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Nous avons bien reçu vos informations. Un membre de l'équipe VisionLab vous recontactera très prochainement à l'adresse <strong>{donorEmail}</strong>.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowDonateSuccess(false)}
                        className="px-8 py-3 bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
                    >
                        Fermer
                    </button>
                 </div>
               ) : (
                 <form className="space-y-6 pt-12 border-t border-slate-800 relative z-10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                        <Heart size={16} className="text-rose-500 animate-bounce" /> Soutien & Maintenance Project
                    </h4>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/5 border border-rose-500/20">
                        <Coffee size={10} className="text-rose-500" />
                        <span className="text-[10px] font-black text-rose-500 uppercase">Support</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="relative group/input">
                        <input 
                          type="text" 
                          placeholder="Votre Nom" 
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-[28px] px-8 py-5 text-sm font-bold focus:outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all text-white placeholder:text-slate-700 shadow-inner"
                        />
                      </div>
                      <div className="relative group/input">
                        <input 
                          type="email" 
                          placeholder="Votre Email" 
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-[28px] px-8 py-5 text-sm font-bold focus:outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all text-white placeholder:text-slate-700 shadow-inner"
                        />
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="relative group/input">
                        <input 
                          type="number" 
                          placeholder="Montant du Don (XAF)" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-[28px] px-5 md:px-8 py-4 md:py-6 text-base md:text-lg font-black focus:outline-none focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all text-white placeholder:text-slate-700 shadow-inner"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-800 uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-xl">XAF</div>
                      </div>
                      
                      <div className="relative group/input">
                        <textarea 
                          placeholder="Votre message à l'équipe..." 
                          rows="3"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-[28px] px-5 md:px-8 py-4 md:py-6 text-sm font-bold focus:outline-none focus:border-purple-500/50 focus:ring-8 focus:ring-purple-500/5 transition-all text-white placeholder:text-slate-700 shadow-inner resize-none"
                        ></textarea>
                      </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                        if(!donorName || !donorEmail) {
                            alert('Veuillez remplir vos informations de contact (Nom et Email).');
                            return;
                        }
                        setShowDonateSuccess(true);
                    }}
                    className="w-full py-4 md:py-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl md:rounded-[28px] font-black uppercase tracking-[0.15em] md:tracking-[0.3em] text-[10px] md:text-[11px] text-white shadow-[0_20px_50px_rgba(59,130,246,0.35)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center gap-3">
                        Effectuer le Don <ArrowRight size={18} />
                    </span>
                  </button>

                  <div className="flex flex-col gap-6 text-center animate-pulse">
                      <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">Propulsé par VisionLab Engine v2.0</p>
                  </div>
                </form>
               )}
            </div>
          </div>
        </section>

        {/* Technical Footer Stack */}
        <section className="pt-24 border-t border-slate-900 flex flex-col items-center gap-12">
            <div className="flex flex-wrap justify-center gap-4">
                {['React 19.0.0', 'Vite 8.0.0', 'Tailwind 4.0', 'Lucide 1.8', 'Typed Arrays', 'FFT Core', 'Grayscale Morpho', 'Otsu Segmentation', 'Canny Edges', 'Laplacian Kernels'].map((tag, i) => (
                    <div key={i} className="px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-900 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:border-blue-500/20 hover:text-blue-500/50 transition-all cursor-default">
                        {tag}
                    </div>
                ))}
            </div>
            
            <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-slate-900 pt-12 gap-8">
                <div className="flex items-center gap-4 md:gap-8 px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[40px] bg-slate-950/50 border border-slate-900">
                    <a href="#" className="p-3 bg-slate-900 rounded-2xl text-slate-600 hover:text-white hover:bg-slate-800 transition-all"><GitBranch size={24} /></a>
                    <a href="#" className="p-3 bg-slate-900 rounded-2xl text-slate-600 hover:text-white hover:bg-slate-800 transition-all"><ExternalLink size={24} /></a>
                    <div className="h-8 w-px bg-slate-800 mx-2"></div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Version du Support</p>
                        <p className="text-xs font-bold text-white">2.4.0 Final Release</p>
                    </div>
                </div>
                
                <div className="text-center md:text-right space-y-3">
                    <div className="flex items-center justify-center md:justify-end gap-3 text-blue-500 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Système Actif</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.3em] leading-none">VisionLab Framework & UI Library</p>
                    <p className="text-[9px] text-slate-800 font-bold uppercase tracking-widest leading-none">Academic Open Source - MIT License - 2026</p>
                </div>
            </div>
        </section>
      </main>

      {/* Extreme Footer */}
      <footer className="py-32 border-t border-slate-900/50 bg-slate-950 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
            <div className="flex justify-center gap-10 opacity-30">
                <div className="w-24 h-px self-center bg-gradient-to-r from-transparent to-white"></div>
                <GraduationCap size={40} className="text-white" />
                <div className="w-24 h-px self-center bg-gradient-to-l from-transparent to-white"></div>
            </div>
            
            <div className="space-y-6">
                <p className="text-sm text-slate-500 font-black uppercase tracking-[0.5em] leading-relaxed">
                  Laboratoire Numérique du Département d'Informatique <br/>
                  <span className="text-white/30 text-xs">Propulse par VisionLab Core Architecture</span>
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 text-slate-800 text-[9px] font-black uppercase tracking-[0.3em]">
                    <span>Maths</span> • <span>Optique</span> • <span>Algorithmique</span> • <span>Signal</span>
                </div>
            </div>

            <div className="pt-12 flex flex-col items-center gap-4">
                <div className="px-6 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-600 font-bold">
                    © 2026 Université de Yaoundé 1 - Faculté des Sciences
                </div>
                <p className="text-slate-800 text-[8px] uppercase font-black tracking-[1em]">LICENCE 3 PROJECT</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

// Utility icon placeholder
function ChatBubble({ size, className }) {
    return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={className}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}
