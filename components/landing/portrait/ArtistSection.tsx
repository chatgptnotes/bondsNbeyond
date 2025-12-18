'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ArtistSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">Meet The <span className="italic">Artists</span></h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-[3/4] bg-gray-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
                            alt="Lead Artist"
                            className="object-cover w-full h-full"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-serif mb-4">Master Artists Collective</h3>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Our studio is home to a collective of award-winning portrait artists, each specializing in
                            different mediums. With over 30 years of combined experience, we have mastered the art
                            of translating photographs into emotional, living pieces of art.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            Whether it is a hyper-realistic charcoal sketch or an impressionistic oil painting,
                            our team approaches every commission with the same level of dedication and passion.
                        </p>

                        <Link
                            href="/artists"
                            className="inline-block px-8 py-3 bg-black text-white text-sm tracking-widest hover:bg-gray-800 transition-colors uppercase"
                        >
                            View Portfolio
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
