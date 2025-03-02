import React from 'react';
import Header from './components/Header';
import PoleScene from './components/PoleScene';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 relative">
          <PoleScene />
        </div>
      </div>
    </div>
  );
}

export default App;