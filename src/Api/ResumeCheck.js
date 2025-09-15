import axios from "axios";

const ResumeCheck = async (resumeText, jobDescription) => {
    const apiKey = import.meta.env.VITE_APP_API_KEY
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const data = {
        contents: [
            {
                parts: [{
                    text: `You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in the tech industry, including but not limited to software engineering, data science, data analysis, big data engineering. Your primary task is to meticulously evaluate resumes based on the provided job description. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

Responsibilities:

1. Assess resumes with a high degree of accuracy against the job description.
2. Identify and highlight missing keywords crucial for the role.
3. Provide a percentage match score reflecting the resume's alignment with the job requirements on the scale of 1-100.
4. Offer detailed feedback for improvement to help candidates stand out.
5. Analyze the Resume, Job description, and industry trends and provide personalized suggestions for skills, keywords, and achievements that can enhance the provided resume.
6. Provide suggestions for improving the language, tone, and clarity of the resume content.
7. Provide users with insights into the performance of their resumes. Track metrics such as:
    a) Application success rates
    b) Views
    c) Engagement.
These offer valuable feedback to improve the candidate's chances in the job market.

Resume:  
${resumeText}

Description:  
${jobDescription}

I want the only response in 4 sectors as follows:  
• Job Description Match:  

• Missing Keywords:  

• Profile Summary:  

• Personalized suggestions for skills, keywords, and achievements that can enhance the provided resume:  

• Application Success rates:  
`
                }],
            },
        ],
    };

    try {
        const response = await axios.post(url, data, { headers });
        const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        // console.log('Response:', content);
        return content;
    } catch (error) {
        console.log('Error:', error);
    }
};

export default ResumeCheck;
