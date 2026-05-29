import React, { useState } from 'react';
import Studio from './pages/Studio';
import Support from './pages/Support';

export default function App() {
  const [currentPage, setCurrentPage] = useState('studio');

  return (
    <>
      {currentPage === 'studio' ? (
        <Studio onOpenSupport={() => setCurrentPage('support')} />
      ) : (
        <Support onBack={() => setCurrentPage('studio')} />
      )}
    </>
  );
}
