import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-gray-900 text-white p-2 sm:px-11 md:px-12 md:p-4 sticky top-0 z-10">
      <div className="mx-auto max-w-[84rem] flex justify-between items-center">
        <nav className="flex items-center">
          {/* Logo */}
          <NavLink
            to="/"
            className="inline-flex items-center py-6 px-3 mr-4 text-white text-2xl md:text-4xl font-bold tracking-widest hover:text-blue-400 transition-colors duration-300 ease-in-out"
            onClick={() => {
              window.scrollTo(0, 0);
              closeMenu();
            }}
            style={{
              fontFamily: window.innerWidth < 768 ? '"Playfair Display", serif' : '"Poppins", cursive',
            }}
          >
            Delon
          </NavLink>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `inline-flex items-center py-3 px-3 my-4 rounded ${isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-white hover:text-blue-400 duration-300 ease-in-out'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/project"
              onClick={closeMenu}
              className={({ isActive }) =>
                `inline-flex items-center py-3 px-3 my-4 rounded ${isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-white hover:text-blue-400 duration-300 ease-in-out'
                }`
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/games"
              onClick={closeMenu}
              className={({ isActive }) =>
                `inline-flex items-center py-3 px-3 my-4 rounded ${isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-white hover:text-blue-400 duration-300 ease-in-out'
                }`
              }
            >
              Games
            </NavLink>
          </div>
        </nav>

        {/* Social Icons (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          <SocialIcon url="https://x.com/ansahdelon?s=21" fgColor="#fff" bgColor="transparent" target="_blank" style={{ height: 35, width: 35 }} />
          <SocialIcon url="https://github.com/DelonAnsah" target="_blank" fgColor="#fff" bgColor="transparent" style={{ height: 35, width: 35 }} />
          <SocialIcon url="https://www.linkedin.com/in/delon-ansah" target="_blank" fgColor="#fff" bgColor="transparent" style={{ height: 35, width: 35 }} />
        </div>

        {/* Hamburger button (mobile only) */}
        <div className="md:hidden">
          <button onClick={handleClick} className="flex flex-col justify-center items-center w-8 h-8 relative z-50">
            <div
              className={`w-6 h-0.5 bg-white mb-1 transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white mb-1 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'
                }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 transition-all duration-500 ease-in-out  ${isOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="flex flex-col items-center">
          <NavLink to="/" onClick={closeMenu} className="py-2 text-white hover:text-blue-400">
            Home
          </NavLink>
          <NavLink to="/project" onClick={closeMenu} className="py-2 text-white hover:text-blue-400">
            Projects
          </NavLink>
          <NavLink to="/games" onClick={closeMenu} className="py-2 text-white hover:text-blue-400">
            Games
          </NavLink>
          <div className="flex space-x-4 mt-4">
            <SocialIcon url="https://x.com/ansahdelon?s=21" fgColor="#fff" bgColor="transparent" target="_blank" style={{ height: 30, width: 30 }} />
            <SocialIcon url="https://github.com/DelonAnsah" target="_blank" fgColor="#fff" bgColor="transparent" style={{ height: 30, width: 30 }} />
            <SocialIcon url="https://www.linkedin.com/in/delon-ansah" target="_blank" fgColor="#fff" bgColor="transparent" style={{ height: 30, width: 30 }} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
