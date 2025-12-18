'use client';

import { motion } from 'framer-motion';

export default function Newsletter() {
    return (
        <section className="py-24 bg-black text-white text-center">
            <div className="max-w-xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-serif mb-4">Sign Up For Our Newsletter</h2>
                    <p className="text-gray-400 mb-8">
                        Don't miss out on special offers, artist interviews, and inspiration.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 bg-transparent border-b border-gray-600 py-3 px-2 text-white focus:outline-none focus:border-white transition-colors"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-white text-black font-medium text-sm lg:text-base tracking-wider hover:bg-gray-200 transition-colors uppercase"
                        >
                            Subscribe
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
