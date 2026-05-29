import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function UploadZone({ onImageSelected }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          onImageSelected(event.target.result, img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="glass-panel w-full max-w-2xl min-h-[300px] md:h-80 rounded-[2rem] flex flex-col items-center justify-center p-6 md:p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all cursor-pointer z-10 group"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4 md:mb-6 shadow-2xl text-blue-400 group-hover:text-blue-300">
        <Upload size={window.innerWidth < 768 ? 24 : 32} />
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Importer une image</h2>
      <p className="text-slate-500 text-center max-w-sm text-sm md:text-base leading-relaxed">
        Glissez-déposez votre fichier ici, ou cliquez pour parcourir vos dossiers <span className="text-slate-600 block text-xs mt-1">(JPG, PNG, WEBP)</span>
      </p>
      <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
    </div>
  );
}
