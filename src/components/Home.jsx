import React from 'react'
import Nav from './Nav'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white'>
      {/* <Nav /> */}
      <div className='container mx-auto px-6 pt-32 md:pt-40 pb-16 md:pb-24'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
          {/* Left Content */}
          <div className='w-full md:w-1/2 space-y-8'>
            <h1 className='font-bold text-5xl md:text-7xl leading-tight'>
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500'>
                Analyze Your Resume
              </span>
              <br />
              <span className='text-white'>for Success!</span>
            </h1>
            <p className='text-lg md:text-xl text-gray-300 leading-relaxed'>
              Streamline your job search with our AI-driven resume analysis. 
              Get personalized insights to improve readability, highlight your strengths, 
              and make a lasting impression on recruiters.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <button className='px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg font-semibold text-lg hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105'>
                Analyze Resume
              </button>
              <button className='px-8 py-4 border-2 border-amber-400 rounded-lg font-semibold text-lg hover:bg-amber-400 hover:text-black transition-all duration-300'>
                Learn More
              </button>
            </div>
            <div className='flex items-center gap-4 text-gray-400'>
              <div className='flex -space-x-2'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-900'></div>
                ))}
              </div>
              <p>Trusted by 10,000+ job seekers</p>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className='w-full md:w-1/2 relative'>
            <div className='relative w-full h-[400px] md:h-[500px]'>
              <div className='absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl backdrop-blur-sm'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-3/4 h-3/4 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-xl backdrop-blur-sm border border-white/10 shadow-2xl'></div>
              </div>
              {/* Decorative elements */}
              <div className='absolute top-1/4 left-1/4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl'></div>
              <div className='absolute bottom-1/4 right-1/4 w-32 h-32 bg-orange-500/20 rounded-full blur-xl'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
