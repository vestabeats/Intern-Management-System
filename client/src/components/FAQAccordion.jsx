import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className={`accordion-button ${isOpen ? 'active' : ''}`}
          type="button"
          onClick={toggleAccordion}
        >
          {question}
          <FaPlus className="ml-auto" style={{ verticalAlign: 'middle' }} />
        </button>
      </h2>
      <div className={`accordion-collapse ${isOpen ? 'show' : ''}`}>
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  return (
    <div className="w-full py-16 text-blue-600 px-4">
      <div className="max-w-[1240px] mx-auto">
        <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold mb-8">
          Frequently Asked Questions
        </h1>
        <div className="accordion" id="faqAccordion">
          <AccordionItem
            question="What is an internship program?"
            answer="An internship program is a structured work experience that provides students and recent graduates with the opportunity to gain practical experience in their field of study or interest."
          />
          <AccordionItem
            question="What is an apprentice workshop?"
            answer="An apprentice workshop is a training program designed to provide hands-on experience and skill development in a specific trade or profession."
          />
          <AccordionItem
            question="What are the benefits of doing an internship?"
            answer=" Internships play a vital role in preparing individuals for the transition from academia to the professional world, equipping them with the knowledge, skills, and experiences necessary for future success in their chosen careers."
          />
          {/* Add more FAQ items as needed */}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
