import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav className='w-full bg-black/50 backdrop-blur-md border-b border-white/10 fixed top-0 z-50'>
      <div className='container mx-auto px-6'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link to="/" className='flex items-center space-x-2'>
            <span className='text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text'>
              ResumeChecker
            </span>
          </Link>

          {/* Navigation */}
          <div className='flex items-center space-x-8'>
            <Link to="/" className='text-gray-300 hover:text-amber-400 transition-colors duration-300'>
              Home
            </Link>
            <Link to="/features" className='text-gray-300 hover:text-amber-400 transition-colors duration-300'>
              Features
            </Link>
            <Link to="/pricing" className='text-gray-300 hover:text-amber-400 transition-colors duration-300'>
              Pricing
            </Link>
            <Link to="/check" className='px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg text-black font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-300'>
              Check Resume
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
