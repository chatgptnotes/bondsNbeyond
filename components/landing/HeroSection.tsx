'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BrushIcon from '@mui/icons-material/Brush';
import PaletteIcon from '@mui/icons-material/Palette';
import LanguageIcon from '@mui/icons-material/Language';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';

// Icon aliases
const ChevronRight = ChevronRightIcon;
const Sparkles = AutoAwesomeIcon;
const Brush = BrushIcon;
const Palette = PaletteIcon;
const Globe = LanguageIcon;
const Verified = VerifiedIcon;
const Shipping = LocalShippingIcon;
const Security = SecurityIcon;

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      rotateY: 15,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const valueBadges = [
    { icon: Brush, text: "Original Artworks" },
    { icon: Palette, text: "Custom Portraits" },
    { icon: Verified, text: "Certified Artists" },
    { icon: Shipping, text: "Worldwide Delivery" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-rose-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(217, 119, 6) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Announcement Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-2 text-sm font-medium text-amber-800 dark:text-amber-300">
              <Sparkles className="mr-2 h-4 w-4" />
              Exclusive Collection: Commission Your Custom Portrait Today
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Discover Extraordinary
            <span className="block bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
              Art & Portraits
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-gray-600 dark:text-gray-300"
          >
            Bring beauty into your space with our curated collection of original paintings, handcrafted sculptures, and custom portraits. From stunning oil paintings to contemporary sculptures and personalized portraits that capture your essence — find the perfect piece to transform your home or gift a masterpiece to someone special.
          </motion.p>

          {/* Value Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {valueBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2 shadow-md"
              >
                <badge.icon className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {badge.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/templates"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-rose-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform transition hover:scale-105"
            >
              Explore Gallery
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/founding-member"
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Commission a Portrait
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Authentic Artwork
            </div>
            <div className="flex items-center">
              <Security className="mr-2 h-5 w-5 text-green-500" />
              Secure Payment
            </div>
            <div className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-500" />
              Global Shipping
            </div>
          </motion.div>
        </motion.div>

        {/* Art Gallery Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {/* Main Painting */}
              <motion.div
                className="col-span-2 row-span-2 relative z-10"
                whileHover="hover"
                variants={cardVariants}
                style={{ perspective: 1000 }}
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-100 via-rose-50 to-amber-50 dark:from-amber-900/30 dark:via-rose-900/20 dark:to-amber-900/30 p-4 shadow-2xl overflow-hidden">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-amber-100 dark:from-amber-800/40 dark:via-rose-800/30 dark:to-amber-800/40 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Brush className="h-16 w-16 mx-auto text-amber-600 dark:text-amber-400 mb-4" />
                      <div className="text-xl font-bold text-gray-800 dark:text-white">Original Oil Painting</div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">&quot;Sunset Reflections&quot; by Master Artist</div>
                      <div className="mt-3 text-lg font-semibold text-amber-600 dark:text-amber-400">From $299</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Portrait */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/20 p-3 shadow-lg">
                  <div className="h-full w-full rounded-lg bg-gradient-to-br from-rose-200 to-pink-100 dark:from-rose-800/40 dark:to-pink-800/30 flex items-center justify-center">
                    <div className="text-center p-3">
                      <Palette className="h-10 w-10 mx-auto text-rose-600 dark:text-rose-400 mb-2" />
                      <div className="text-sm font-bold text-gray-800 dark:text-white">Custom Portrait</div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">From $199</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sculpture */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-gray-100 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/30 p-3 shadow-lg">
                  <div className="h-full w-full rounded-lg bg-gradient-to-br from-gray-200 to-slate-100 dark:from-gray-700/50 dark:to-slate-700/30 flex items-center justify-center">
                    <div className="text-center p-3">
                      <svg className="h-10 w-10 mx-auto text-gray-600 dark:text-gray-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <div className="text-sm font-bold text-gray-800 dark:text-white">Sculptures</div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">From $399</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -left-10 top-10 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Hand-Painted</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -right-10 top-20 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium">Certified Artists</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -left-5 bottom-10 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-sm font-medium">Custom Orders</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-xs mb-1">Scroll to explore</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;