'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const styles = [
    {
        title: 'Oil Painting',
        description: 'Classic, rich textures perfect for formal portraits and heirlooms.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop', // Placeholder
        slug: 'oil'
    },
    {
        title: 'Charcoal Sketch',
        description: 'Dramatic contrast and emotion, capturing the soul in black and white.',
        image: 'https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=800&auto=format&fit=crop', // Placeholder
        slug: 'charcoal'
    },
    {
        title: 'Watercolor',
        description: 'Soft, ethereal, and dreamy. Perfect for children and pets.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop', // Placeholder
        slug: 'watercolor'
    },
    {
        title: 'Digital Art',
        description: 'Modern, vibrant, and versatile. Great for social media avatars and gifts.',
        image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop', // Placeholder
        slug: 'digital'
    }
];

export default function StyleGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">Choose Your <span className="italic">Style</span></h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        We offer a variety of artistic mediums to perfectly match the mood and memory you want to preserve.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {styles.map((style, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-100">
                                <Image
                                    src={style.image}
                                    alt={style.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-2xl font-serif mb-2">{style.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">
                                {style.description}
                            </p>
                            <Link
                                href={`/style/${style.slug}`}
                                className="text-sm border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-400 transition-colors uppercase tracking-wide"
                            >
                                View Examples
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
