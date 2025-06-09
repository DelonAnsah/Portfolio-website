import React from 'react'
import {  FaArrowUp, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { SocialIcon } from 'react-social-icons'

const socialLinks = [
  'https://x.com/ansahdelon?s=21',
  'https://github.com/DelonAnsah',
  'https://www.linkedin.com/in/delon-ansah',
];

const Footer = () => {
  return (
    <footer className=" bg-gray-900 text-white py-10 px-5 md:px-16">
      <div className='mx-auto max-w-[82rem]'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12" >
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-widest"   style={{ fontFamily: 'Playfair, cursive' }}>Delon</h3>
            <p className="text-gray-400 mb-4">
              Frontend Engineer blending design and code to build fast, scalable, and data-driven digital experiences.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((url, index) => (
                <div
                  key={index}
                  className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <SocialIcon
                    url={url}
                    fgColor="#9CA3AF"
                    bgColor="transparent"
                    target="_blank"
                    style={{ height: 35, width: 35 }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
             <h3 className="text-xl font-bold mb-4">Quick Links</h3>
             <ul className="space-y-2">
                <li>
                  <button  
                  onClick={() => window.scrollTo(0, 0)
                  }className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer !rounded-button whitespace-nowrap">
                    Home
                  </button>
                </li>
                 <li>
                  <a href="#aboutme" className='text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap'>
                    About
                  </a>
                </li>
                 <li>
                  <a href="#projects" className='text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap'>
                    Projects
                  </a>
                </li>
                  <li>
                  <a href="#tech" className='text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap'>
                    Skills
                  </a>
                </li>
                 <li>
                  <a href="#contact" className='text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap'>
                    Contact
                  </a>
                </li>
             </ul>
          </div>
          <div>
             <h3 className="text-xl font-bold mb-4">Contact Info</h3>
             <ul className="space-y-2">
                <li className="flex items-center">
                  <FaMapMarkerAlt className='text-blue-500 mr-3' />
                  <span className="text-gray-400">Ghana, Accra</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className='text-blue-500 mr-3' />
                  <span className="text-gray-400">delonansah87@gmail.com</span>
                </li>
                <li className="flex items-center">
                  <FaPhoneAlt className='text-blue-500 mr-3' />
                  <span className="text-gray-400">+233 249678172</span>
                </li>
             </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Delon. All rights reserved. 
          </p>
          <button
          onClick={() => window.scrollTo(0, 0)}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
