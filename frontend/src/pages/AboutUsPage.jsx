import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Dribbble } from 'lucide-react';
import axios from 'axios';

const AboutUsPage = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/about-us');
        setContent(data);
      } catch (error) {
        console.error("Could not fetch About Us content", error);
      }
    };
    fetchContent();
  }, []);

  if (!content) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-gray-800">
          {content.title}
        </h1>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          {content.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
        {content.teamMembers.map((member, index) => (
          <motion.div
            key={member.name || index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <img src={member.image} alt={member.name} className="w-48 h-48 rounded-full mx-auto shadow-lg object-cover" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mt-6">{member.name}</h3>
            <p className="text-[var(--theme-pink)] font-semibold">{member.role}</p>
            <p className="text-gray-600 mt-2 text-sm">{member.bio}</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors"><Linkedin /></a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors"><Dribbble /></a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsPage;