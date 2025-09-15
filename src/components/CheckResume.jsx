import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import ResumeCheck from '../Api/ResumeCheck'
import * as pdfjsLib from 'pdfjs-dist'

// Import the worker directly
import 'pdfjs-dist/build/pdf.worker.entry'

const CheckResume = () => {
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)

  useEffect(() => {
    // The worker is now automatically loaded by the import above
    // No need to set workerSrc manually
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const convertPdfToText = async (file) => {
    try {
      // console.log('Starting PDF conversion...')
      // console.log('File type:', file.type)
      // console.log('File size:', file.size)

      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      // console.log('File read as ArrayBuffer')

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      // console.log('PDF loaded, number of pages:', pdf.numPages)

      let fullText = ''

      // Get all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i} of ${pdf.numPages}`)
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }

      console.log('PDF conversion completed')
      return fullText
    } catch (error) {
      console.error('Error in PDF conversion:', error)
      if (error.name === 'InvalidPDFException') {
        throw new Error('The file is not a valid PDF or is corrupted.')
      } else if (error.name === 'MissingPDFException') {
        throw new Error('The PDF file is missing or could not be loaded.')
      } else {
        throw new Error(`Failed to convert PDF to text: ${error.message}`)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError(null)
      setAnalysisResult(null) // Clear previous results
      
      if (!data.file || !data.file[0]) {
        throw new Error('Please select a file to upload')
      }

      const file = data.file[0]
      // console.log('Processing file:', file.name)
      // console.log('File type:', file.type)
      
      let resumeText = ''

      // Check if file is PDF (including both MIME types that browsers might use)
      if (file.type === 'application/pdf' || file.type === 'application/x-pdf') {
        resumeText = await convertPdfToText(file)
        if (!resumeText.trim()) {
          throw new Error('Could not extract text from the PDF. The file might be scanned or image-based.')
        }
        // console.log('Text extracted successfully, length:', resumeText.length)
      } else {
        throw new Error(`Invalid file type: ${file.type}. Only PDF files are supported.`)
      }

      // Now send both the description and resume text to your API
      console.log('Sending to API...')
      const result = await ResumeCheck(data.description, resumeText)
      console.log('API Response:', result) // Debug log to see the actual API response
      setAnalysisResult(result)
      
    } catch (error) {
      console.error('Error processing resume:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('File selected:', file.name)
      console.log('File type:', file.type)
      setFileName(file.name)
      setError(null)
    }
  }

  // Helper to split string into array (by newline, comma, or period)
  const splitToList = (str) => {
    if (!str) return [];
    // Try splitting by newline, then by comma, then by period
    let arr = str.split('\n').map(s => s.trim()).filter(Boolean);
    if (arr.length <= 1) arr = str.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length <= 1) arr = str.split('.').map(s => s.trim()).filter(Boolean);
    return arr.filter(Boolean);
  };

  // Component to display analysis results
  const AnalysisResults = ({ results }) => {
    if (!results) return null;

    // Helper icons (you can swap these for better ones or use a library)
    const icons = {
      skills: "🛠️",
      experience: "💼",
      recommendations: "💡",
      score: "⭐"
    };

    // Skills Section
    const skillsList = Array.isArray(results.skills)
      ? results.skills
      : typeof results.skills === 'string'
        ? splitToList(results.skills)
        : [];

    // Experience Section
    const experienceList = Array.isArray(results.experience)
      ? results.experience
      : typeof results.experience === 'string'
        ? splitToList(results.experience)
        : [];

    // Recommendations Section
    const recommendationsList = Array.isArray(results.recommendations)
      ? results.recommendations
      : typeof results.recommendations === 'string'
        ? splitToList(results.recommendations)
        : [];

    return (
      <div className='mt-10 bg-gradient-to-br from-black/60 to-gray-900/80 border border-amber-400/20 rounded-2xl p-8 shadow-2xl'>
        <h3 className='text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight'>
          Analysis Results
        </h3>

        {/* Skills Section */}
        {skillsList.length > 0 && (
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>{icons.skills}</span>
              <h4 className='text-xl font-semibold text-amber-300'>Skills Analysis</h4>
            </div>
            <ul className='list-disc list-inside text-gray-200 space-y-1 pl-6'>
              {skillsList.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
            <hr className='my-6 border-amber-400/10' />
          </div>
        )}

        {/* Experience Section */}
        {experienceList.length > 0 && (
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>{icons.experience}</span>
              <h4 className='text-xl font-semibold text-amber-300'>Experience Analysis</h4>
            </div>
            <ul className='list-disc list-inside text-gray-200 space-y-1 pl-6'>
              {experienceList.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
            <hr className='my-6 border-amber-400/10' />
          </div>
        )}

        {/* Recommendations Section */}
        {recommendationsList.length > 0 && (
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>{icons.recommendations}</span>
              <h4 className='text-xl font-semibold text-amber-300'>Recommendations</h4>
            </div>
            <ul className='list-disc list-inside text-gray-200 space-y-1 pl-6'>
              {recommendationsList.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
            <hr className='my-6 border-amber-400/10' />
          </div>
        )}

        {/* Overall Score */}
        {typeof results.score === 'number' && (
          <div className='mt-6 p-6 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-xl border border-amber-400/30 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>{icons.score}</span>
              <h4 className='text-lg font-semibold text-gray-300'>Overall Score</h4>
            </div>
            <div className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500'>
              {results.score}%
            </div>
            <div className='text-base text-gray-400 ml-4'>
              {results.score >= 80 ? 'Excellent!' :
                results.score >= 60 ? 'Good' :
                  results.score >= 40 ? 'Fair' : 'Needs Improvement'}
            </div>
          </div>
        )}

        {/* Fallback for raw data */}
        {(!results.skills && !results.experience && !results.recommendations && !results.score) && (
          <div className='mt-4 p-6 bg-black/40 rounded-xl border border-gray-700'>
            <h4 className='text-lg font-semibold text-gray-300 mb-2'>Raw Analysis Output</h4>
            <pre className='text-gray-300 whitespace-pre-wrap break-words text-sm'>
              {typeof results === 'string' ? results : JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-32'>
      <div className='container mx-auto px-6'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='text-4xl font-bold mb-2 text-center'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500'>
              Resume Analysis
            </span>
          </h2>
          <p className='text-gray-400 text-center mb-8'>
            Upload your resume to get personalized insights and recommendations
          </p>

          <div className='bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl'>
            {error && (
              <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
                <p className='text-red-400 text-sm'>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-2'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                  Job Description (Optional)
                </label>
                <textarea
                  id='description'
                  rows='4'
                  className='w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors duration-200'
                  placeholder='Paste the job description here to get more targeted recommendations...'
                  {...register('description')}
                />
                <p className='text-xs text-gray-500'>
                  Adding a job description helps us provide more relevant feedback for specific roles
                </p>
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-300'>
                  Upload your resume
                </label>
                <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-amber-400 transition-colors duration-200'>
                  <div className='space-y-1 text-center'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-500'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                      aria-hidden='true'
                    >
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <div className='flex text-sm text-gray-400'>
                      <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-400'
                      >
                        <span>Upload a file</span>
                        <input
                          id='file-upload'
                          type='file'
                          className='sr-only'
                          accept='.pdf,application/pdf'
                          {...register('file', {
                            required: true,
                            validate: {
                              fileType: (files) => {
                                if (!files || !files[0]) return 'Please select a file'
                                const file = files[0]
                                return file.type === 'application/pdf' || file.type === 'application/x-pdf'
                                  ? true
                                  : 'Only PDF files are allowed'
                              }
                            }
                          })}
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className='pl-1'>or drag and drop</p>
                    </div>
                    <p className='text-xs text-gray-500'>PDF files only (up to 10MB)</p>
                    {fileName && (
                      <p className='text-sm text-amber-400 mt-2'>Selected file: {fileName}</p>
                    )}
                  </div>
                </div>
                {errors.file && (
                  <p className='text-sm text-red-400 mt-1'>{errors.file.message || 'Please select a file to upload'}</p>
                )}
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-300 transform hover:scale-[1.02] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? 'Processing...' : 'Analyze Resume'}
              </button>
            </form>

            {/* Display Analysis Results */}
            {analysisResult && <AnalysisResults results={analysisResult} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckResume
