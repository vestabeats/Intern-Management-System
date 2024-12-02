import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { FaDribbbleSquare, FaFacebookSquare, FaGithubSquare, FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import epbhome1 from "../assets/epbhome1.jpg";
import epbhome from "../assets/epbhome.jpg";
import workshop from "../assets/workshop.jpg";
import proj from "../assets/proj.jpg";
import events from "../assets/events.jpg";
import { useNavigate } from 'react-router-dom';
import epb from "../assets/epb.jpg";
import FAQAccordion from '../components/FAQAccordion';

const Home = () => {
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const internshipRef = useRef(null);
    const resourcesRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const homeRef = useRef(null);

    const handleNav = () => {
        setNav(!nav);
    };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 2000,
        autoplay: true,
        autoplaySpeed: 10000,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className='w-full pl-2 h-auto overflow-hidden'>
            <div className='fixed top-0  w-full z-50 bg-white shadow'>
                <div className='mx-auto  px-2'>
                    <div className='flex justify-between items-center h-24 '>
                        <div className='flex items-center ml-4'>
                            {/*<p className='bg-blue-600 rounded-full p-1'> </p>*/}
                                <img src={epb} className='h-6 lg:h-10 rounded' alt="BPE Logo" />
                           
                            <h1 className='sm:text-lg ml-2 lg:text-2xl font-bold text-blue-600'>Bejaia Port Intern System</h1>
                        </div>
                        <div className='flex cursor-pointer items-center mr-4'>
                            <ul className='hidden text-blue-600 md:flex mr-14'>
                                <li className='p-4' onClick={() => scrollToSection(homeRef)}>Home</li>
                                <li className='p-4' onClick={() => scrollToSection(internshipRef)}>Internship</li>
                                <li className='p-4' onClick={() => scrollToSection(resourcesRef)} >FAQ</li>
                                <li className='p-4' onClick={() => scrollToSection(aboutRef)}>Activities</li>
                                <li className='p-4' onClick={() => scrollToSection(contactRef)}>Contact</li>
                            </ul>
                            <button onClick={() => navigate("/login")} className='hidden md:flex bg-blue-500 text-white text-lg lg:text-xl p-1  rounded pl-4 pr-4'>Login</button>
                        </div>
                        <div onClick={handleNav} className='text-blue-600 block mr-2 md:hidden'>
                            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                        </div>
                        <ul className={nav ? 'fixed left-0  cursor-pointer  z-10 top-24 lg:hidden w-[60%] h-full bg-blue-600 border-r border-r-gray-300 text-white ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%]'}>
                            <li className='p-4 border-b border-gray-600'onClick={() => scrollToSection(homeRef)}>Home</li>
                            <li className='p-4 border-b border-gray-600' onClick={() => scrollToSection(internshipRef)}>Internship</li>
                            <li className='p-4 border-b border-gray-600' onClick={() => scrollToSection(resourcesRef)}>FAQ</li>
                            <li className='p-4 border-b border-gray-600' onClick={() => scrollToSection(aboutRef)}>Activities</li>
                            <li className='p-4'onClick={() => scrollToSection(contactRef)}>Contact</li>
                            <button onClick={() => navigate("/login")} className=' bg-gray-900 text-blue-600 text-sm  p-1  ml-2 rounded pl-4 pr-4 '>Login</button>
                        </ul>
                    </div>
                </div>
            </div>
            <div ref={homeRef} className='mt-24 '> {/* Add mt-24 to adjust for the fixed navbar */}
            <Slider {...sliderSettings}>
   
        <div className="relative carousel-inner">
           
            <img className='w-full md:h-screen object-cover pointer-events-none ' src={epbhome} alt="Slider Image 1" />
         
           
        </div>
        <div className="relative carousel-inner">
           
            <img className='w-full md:h-screen object-cover pointer-events-none ' src={epbhome1} alt="Slider Image 1" />
         
           
        </div>
   
    
   
</Slider>


            </div>
            {/* Analytics */}
            <div  ref={internshipRef} className='w-full bg-white py-16 px-4'>
                <div className='max-w-[1240px] mx-auto grid md:grid-cols-2'>
                    <div className='w-full md:w-[500px] mx-auto my-4'>
                        {/* Replace with your analytics component or content */}
                        <p className='text-blue-600 font-bold '>INTERNSHIP PERFORMANCE INSIGHTS</p>
                        <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>Empowering Your Internship Program</h1>
                        <p>
                            Track and analyze internship performance metrics to optimize your program's effectiveness. Gain valuable insights into intern engagement, project completion rates, skill development, and more.
                        </p>
                        <button onClick={() => navigate("/login")} className='bg-blue-600 text-white w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>Login</button>
                    </div>
                </div>
            </div>
            {/* Frequently asked questions */}
            <div  ref={resourcesRef}>
           <FAQAccordion />
           </div>
            {/* Cards */}
            <div  ref={aboutRef} className='w-full py-[10rem] px-4 bg-white'>
                <h1 className='md:text-5xl text-blue-600 sm:text-3xl text-2xl text-center mb-24 font-bold py-2'>
                    Intern & Apprentice Activities
                </h1>
                <div className='max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8'>
                    <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                        <img className='w-full h-auto mx-auto mt-[-3rem] bg-white' src={proj} alt="Internship Project" />
                        <h2 className='text-2xl font-bold text-center py-8'>Internship Project</h2>
                        <div className='text-center font-medium'>
                            <p className='py-2 border-b mx-8 mt-8'>Hands-on Projects</p>
                            <p className='py-2 border-b mx-8'>Supervised Learning</p>
                            <p className='py-2 border-b mx-8'>Industry Insights</p>
                        </div>
                        <button  onClick={() => navigate("/login")} className='bg-blue-600 text-white w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>Get Started</button>
                    </div>
                    <div className='w-full shadow-xl bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300'>
                        <img className='w-full h-auto mx-auto mt-[-3rem] bg-transparent' src={workshop} alt="Apprentice Workshop" />
                        <h2 className='text-2xl font-bold text-center py-8'>Apprentice Workshop</h2>
                        <div className='text-center font-medium'>
                            <p className='py-2 border-b mx-8 mt-8'>Interactive Workshops</p>
                            <p className='py-2 border-b mx-8'>Expert Mentoring</p>
                            <p className='py-2 border-b mx-8'>Practical Training</p>
                        </div>
                        <button  onClick={() => navigate("/login")}  className='bg-black text-blue-600 w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>Get Started</button>
                    </div>
                    <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                        <img className='w-full h-auto mx-auto mt-[-3rem] bg-white' src={events} alt="Internship Event" />
                        <h2 className='text-2xl font-bold text-center py-8'>Internship Event</h2>
                        <div className='text-center font-medium'>
                            <p className='py-2 border-b mx-8 mt-8'>Networking Events</p>
                            <p className='py-2 border-b mx-8'>Career Development</p>
                            <p className='py-2 border-b mx-8'>Project Presentations</p>
                        </div>
                        <button  onClick={() => navigate("/login")}  className='bg-blue-600 text-white  w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3'>Get Started</button>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div  ref={contactRef} className='mx-auto py-16 px-14 grid lg:grid-cols-3 bg-blue-600 gap-8 text-white'>
                <div>
                    <h1 className='w-full text-3xl font-bold text-white'>Bejaia Port Enterprise</h1>
                    <p className='py-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id odit ullam iste repellat consequatur libero reiciendis, blanditiis accusantium.</p>
                    <div className='flex justify-between md:w-[75%] my-6'>
                        <FaFacebookSquare size={30} />
                        <FaInstagram size={30} />
                        <FaTwitterSquare size={30} />
                        <FaGithubSquare size={30} />
                        <FaDribbbleSquare size={30} />
                    </div>
                </div>
                <div className='lg:col-span-2 flex justify-between mt-6'>
                    <div>
                        <h6 className='font-medium text-gray-400'>Solutions</h6>
                        <ul>
                            <li className='py-2 text-sm'>Analytics</li>
                            <li className='py-2 text-sm'>Marketing</li>
                            <li className='py-2 text-sm'>Commerce</li>
                            <li className='py-2 text-sm'>Insights</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className='font-medium text-gray-400'>Support</h6>
                        <ul>
                            <li className='py-2 text-sm'>Pricing</li>
                            <li className='py-2 text-sm'>Documentation</li>
                            <li className='py-2 text-sm'>Guides</li>
                            <li className='py-2 text-sm'>API Status</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className='font-medium text-gray-400'>Company</h6>
                        <ul>
                            <li className='py-2 text-sm'>About</li>
                            <li className='py-2 text-sm'>Blog</li>
                            <li className='py-2 text-sm'>Jobs</li>
                            <li className='py-2 text-sm'>Press</li>
                            <li className='py-2 text-sm'>Careers</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className='font-medium text-gray-400'>Legal</h6>
                        <ul>
                            <li className='py-2 text-sm'>Claim</li>
                            <li className='py-2 text-sm'>Policy</li>
                            <li className='py-2 text-sm'>Terms</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
