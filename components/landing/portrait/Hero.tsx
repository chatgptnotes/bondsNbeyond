'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gray-300">
        <img
          src="/landing-bg.jpg"
          alt="Art Studio Background"
          className="object-cover w-full h-full opacity-60"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl font-light mb-4 tracking-widest uppercase"
        >
          Customized Portraits
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-tight"
        >
          Turn Your Moments <br /> Into <span className="italic">Timeless Art</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/welcome-to-bondsnbeyond"
            className="inline-block border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Start Your Portrait
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
