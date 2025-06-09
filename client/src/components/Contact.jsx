import React, { useState } from 'react'
import { SectionWrapper } from '../hoc';
import { motion } from "framer-motion";
import { slideIn } from '../Utils/motion';
import { styles } from '../styles';
import { EarthCanvas } from './canvas';

const Contact = () => {

  const formInitialDetails = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});


  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, subject, message } = formDetails;

    if (!name || !email || !subject || !message) {
      setStatus({ success: false, message: 'Please fill in all required fields (Name, Email, Subject, Message).' });
      return;
    }

    setButtonText('Sending...');

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(formDetails),
      })

      const result = await response.json();
      setButtonText('Send');
      setFormDetails(formInitialDetails);
      

      if (result.code == 200) {
        setStatus({ success: true, message: 'Message sent successfully' });
      } else {
        setStatus({ success: false, message: 'Something went wrong, please try again later.' });
      }
    } catch (error) {
      setButtonText('Send');
      setStatus({ success: false, message: 'An error occurred. Please try again later.' });
    }
  }

  return (
    <div id='Contact'>
      <h2 className="text-4xl md:text-4xl font-bold text-center mb-6 ">
        Get In <span className="text-[#915EFF]">Touch</span>
      </h2>
      <p className="text-white text-center max-w-3xl mx-auto mb-16">
        Have a project in mind or want to discuss potential opportunities? Feel free to reach out using the form below or connect with me directly.
      </p>
      <section className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className='flex-[0.75] bg-black-100 p-8 rounded-2xl'>
          <h3 className={styles.sectionHeadText}>Contact.</h3>

          <form onSubmit={handleSubmit} className='w-full'>
            <div className="flex flex-wrap -mx-1">
              <div className="w-full sm:w-1/2 px-1 mb-4">
                <input
                  type="text"
                  value={formDetails.name}
                  placeholder="Full Name"
                  onChange={(e) => onFormUpdate('name', e.target.value)}
                  className="w-full bg-opacity-10 bg-white border border-white/50 rounded-xl text-white py-4 px-6 font-medium text-base tracking-wide transition-all duration-300 focus:bg-white focus:text-gray-900 focus:outline-none"

                />
              </div>
              <div className="w-full sm:w-1/2 px-1 mb-4">
                <input
                  type="email"
                  value={formDetails.email}
                  placeholder="Email Address"
                  onChange={(e) => onFormUpdate('email', e.target.value)}
                  className="w-full bg-opacity-10 bg-white border border-white/50 rounded-xl text-white py-4 px-6 font-medium text-base tracking-wide transition-all duration-300 focus:bg-white focus:text-gray-900 focus:outline-none"

                />
              </div>
              <div className="w-full px-1 mb-4">
                <select
                 value={formDetails.subject}
                  onChange={(e) => onFormUpdate('subject', e.target.value)}
                  className="w-full bg-opacity-10 bg-white border border-white/50 rounded-xl text-gray-300 py-4 px-6 font-medium text-base tracking-wide transition-none  focus:bg-white focus:text-gray-900 focus:outline-none "
                >
                  <option value="">Select a subject</option>
                  <option value="project">Project Inquiry</option>
                  <option value="job">Job Opportunity</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="w-full px-1 mb-4">
                <textarea
                  rows="6"
                  value={formDetails.message}
                  placeholder="Message"
                  onChange={(e) => onFormUpdate('message', e.target.value)}
                  className="w-full bg-opacity-10 bg-white border border-white/50 rounded-xl text-white py-4 px-6 font-medium text-base tracking-wide transition-all duration-300 focus:bg-white focus:text-gray-900 focus:outline-none"

                ></textarea>
              </div>
              <div className="w-full px-1">
                <button
                  type="submit"
                  className="font-bold text-black bg-white py-4 px-12 text-lg mt-6 rounded-none relative group hover:text-white transition duration-300 ease-in-out"

                >
                  <span className="relative z-10">{buttonText}</span>
                  <span className="absolute inset-0 bg-black w-0 group-hover:w-full h-full transition-all duration-300 ease-in-out"></span>

                </button>
              </div>
              {status.message && (
                <div className="w-full mt-4">
                  <p className={status.success === false ? "text-red-500" : "text-green-500"}>
                    {status.message}
                  </p>
                </div>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
        >
          <EarthCanvas />
        </motion.div>

      </section>

    </div>
  )
}

export default SectionWrapper(Contact, "contact")
