'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GalleryPreview() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">Recent <span className="italic">Commissioned Works</span></h2>
                    <p className="text-gray-500">Discover the masterpieces we have created for families around the world.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="aspect-square bg-gray-100 relative overflow-hidden group"
                        >
                            <img
                                src={`https://source.unsplash.com/random/800x800?portrait&sig=${i}`} // Note: Source unsplash might be deprecated, using reliable one in real app.
                                // Using the reliable placeholder link for now
                                srcSet={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop`}
                                alt="Gallery Item"
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/gallery"
                        className="inline-block px-8 py-3 border border-black text-black text-sm tracking-widest hover:bg-black hover:text-white transition-colors uppercase"
                    >
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
}
