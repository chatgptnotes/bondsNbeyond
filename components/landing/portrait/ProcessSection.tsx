'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        title: 'Upload',
        description: 'Select your favorite photo. High resolution works best for capturing details.'
    },
    {
        title: 'Create',
        description: 'Our expert artists hand-craft your portrait using your chosen medium.'
    },
    {
        title: 'Deliver',
        description: 'Receive your masterpiece at your doorstep, framed and ready to hang.'
    }
];

export default function ProcessSection() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                            Freedom to be <br />
                            <span className="italic text-gray-600">Creative</span>
                        </h2>
                        <div className="w-20 h-1 bg-black mb-8" />

                        <h3 className="text-2xl font-serif mb-6">Our Process</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We believe that every face tells a story. Our process is designed to result in a
                            collaborative masterpiece that honors that story. From the initial photo selection
                            to the final brushstroke, we ensure your vision is realized with precision and soul.
                        </p>

                        <div className="space-y-8">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex">
                                    <div className="mr-6 flex-shrink-0">
                                        <span className="text-5xl font-serif text-gray-200">0{idx + 1}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif mb-2">{step.title}</h4>
                                        <p className="text-gray-500 text-sm">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative h-[600px] w-full"
                >
                    <div className="absolute inset-0 bg-gray-200" />
                    {/* Placeholder for process image */}
                    <img
                        src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop"
                        alt="Artist at work"
                        className="object-cover w-full h-full"
                    />
                </motion.div>

            </div>
        </section>
    );
}
