import React from 'react';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Zap className="text-yellow-400 mr-2" size={24} />
        <h1 className="text-xl font-bold">Utility Pole Training Simulator</h1>
      </div>
      
      <nav>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Training
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Gallery
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Help
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;