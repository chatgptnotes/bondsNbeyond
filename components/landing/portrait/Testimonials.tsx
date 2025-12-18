'use client';

import { motion } from 'framer-motion';

const reviews = [
    {
        name: 'Anuja Nagpal',
        role: 'Art Collector',
        text: "The portrait of my late grandmother brought tears to my eyes. It wasn't just a copy of the photo; they captured her warmth and spirit perfectly."
    },
    {
        name: 'Kunj Mehta',
        role: 'Interior Designer',
        text: "I commission pieces for my clients regularly. The quality, consistency, and professionalism of this studio are unmatched in the industry."
    },
    {
        name: 'Toru Jhaveri',
        role: 'Writer',
        text: "A truly seamless experience. From the initial consultation to the final reveal, I felt involved and heard. The final piece hangs proudly in my study."
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif">What Our <span className="italic">Clients Say</span></h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 shadow-sm border border-gray-100"
                        >
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"{review.text}"</p>
                            <div>
                                <h4 className="font-serif text-lg">{review.name}</h4>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">{review.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
