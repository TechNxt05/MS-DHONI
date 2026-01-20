'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

/* Content extracted from legacy/MSD/index.html */
const bioSections = [
    {
        title: "The Beginning",
        content: "Dhoni was born on 7 July 1981 in Ranchi, Bihar (now in Jharkhand) in a Hindu Rajput family to Pan Singh and Devaki Devi. His parents hailed from Lwali village in Uttar Pradesh (now Uttarakhand). He was the youngest of three children. Dhoni did his schooling at DAV Jawahar Vidya Mandir where he started playing football as a goalkeeper but later moved to cricket on the suggestion of his coach Keshav Banerjee. From 2001 to 2003, Dhoni worked as a Travelling Ticket Examiner (TTE) at Kharagpur under the South Eastern Railway zone of Indian Railways.",
        image: "/gallery/7.jpeg" // Using one of the migrated images
    },
    {
        title: "Early Career",
        content: "He played as a wicket-keeper for Commando cricket club (1995-1998) and Central Coal Fields Limited (CCL). At CCL, he batted higher up the order and helped the team qualify for the higher division. Based on his performance, he was picked for the Vinoo Mankad Trophy under-16 championship. He eventually made his Ranji Trophy debut for Bihar in the 1999-2000 season. His breakthrough came in the 2003/04 season when he was picked for the India A squad for a tour of Zimbabwe and Kenya, where his hard-hitting batting style gained recognition.",
        image: "/gallery/12.jpeg"
    },
    {
        title: "Rise to Stardom",
        content: "Dhoni made his debut for the Indian cricket team in December 2004. In 2007, he became the captain of the ODI side before taking over in all formats by 2008. Known for his aggressive batting, masterclass captaincy, fast wicket-keeping skills, and epic finishes, he became the face of Indian cricket. Under his captaincy, India won the 2007 ICC World Twenty20, the 2011 Cricket World Cup, and the 2013 ICC Champions Trophy.",
        image: "/gallery/2011.jpg"
    },
    {
        title: "Captain Cool",
        content: "What makes Dhoni special is his amazing leadership. Known as 'Captain Cool,' his ability to stay calm in tough situations reshaped Indian cricket. He led India to the number one spot in ICC Test rankings for the first time. His helicopter shot and lightning-fast stumpings became his trademarks. In the IPL, he led Chennai Super Kings to 5 titles, earning the nickname 'Thala' (Leader) from the adoring fans.",
        image: "/gallery/Msd.webp"
    },
    {
        title: "Personal Life",
        content: "Dhoni married Sakshi Singh Rawat on 4 July 2010. They have a daughter, Ziva. A man of simple tastes despite his massive success, he lives in his farmhouse in Ranchi and is known for his love of motorcycles and cars. He holds an honorary rank of Lieutenant Colonel in the Parachute Regiment of the Indian Territorial Army.",
        image: "/gallery/35.jpeg"
    },
    {
        title: "The Legacy",
        content: "In the world of cricket, few names bring as much joy and admiration. His journey from a small-town boy to a global icon proves that with dedication and hard work, dreams can come true. For his fans, he is more than just a cricketer; he is an emotion. As he walked away from international cricket in 2020, he left behind a legacy that will inspire generations. You will always be our Thala, our Captain Cool, and our forever hero.",
        image: "/gallery/50.jpg"
    }
];

export default function BiographyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            {/* Bio Header */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/gallery/hs.jpg"
                        alt="Dhoni Portrait"
                        fill
                        className="object-cover opacity-40 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center max-w-4xl px-4"
                >
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">
                        The <span className="text-csk-yellow">Biography</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed">
                        "Ticket Collector to Trophy Collector"
                    </p>
                </motion.div>
            </section>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-20 max-w-5xl">
                <div className="space-y-32">
                    {bioSections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Text */}
                            <div className="flex-1 space-y-6">
                                <h2 className="text-4xl font-bold uppercase tracking-wide text-india-blue">
                                    {section.title}
                                </h2>
                                <div className="h-1 w-20 bg-csk-yellow rounded-full" />
                                <p className="text-lg text-zinc-400 leading-loose text-justify">
                                    {section.content}
                                </p>
                            </div>

                            {/* Image */}
                            <div className="flex-1 w-full">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-zinc-800 group hover:border-csk-yellow/50 transition-colors">
                                    <div className="absolute inset-0 bg-csk-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                    <Image
                                        src={section.image}
                                        alt={section.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Closing Qoute */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 text-center"
                >
                    <blockquote className="text-3xl md:text-5xl font-black text-zinc-600 leading-tight">
                        "I tell my wife she is only the third most important thing in my life. I love my country, I love my parents, and then she comes."
                    </blockquote>
                    <cite className="block mt-8 text-xl text-csk-yellow not-italic font-bold">
                        — Mahendra Singh Dhoni
                    </cite>
                </motion.div>
            </div>
        </main>
    );
}
