'use client';

import { motion } from 'framer-motion';

const quotes = [
    { text: "If I die, the last thing I want to see is the six that Dhoni hit in the 2011 World Cup final.", author: "Sunil Gavaskar", color: "bg-[#FDB913]", shape: "rounded-tr-none" },
    { text: "Dhoni is the best captain I have played under.", author: "Sachin Tendulkar", color: "bg-[#0078BC]", textColor: "text-white", shape: "rounded-bl-none" },
    { text: "He will always be my captain.", author: "Virat Kohli", color: "bg-white", shape: "rounded-tl-none" },
    { text: "I would go to war with Dhoni by my side.", author: "Gary Kirsten", color: "bg-emerald-400", shape: "rounded-br-none" },
    { text: "If 15 runs are needed off the last over, pressure is on the bowler, not on MS Dhoni.", author: "Ian Bishop", color: "bg-rose-400", shape: "rounded-2xl" },
    { text: "If I am supposed to select a team, Sachin would be the opener and Dhoni would be the captain.", author: "Steve Waugh", color: "bg-orange-400", shape: "rounded-[2rem]" },
    { text: "Dhoni is my hero. He has as much talent as anyone in the game.", author: "Kapil Dev", color: "bg-purple-400", textColor: "text-white", shape: "rounded-tr-3xl rounded-bl-3xl" },
    { text: "Need a six in a pressure situation? Call MS Dhoni.", author: "Ramiz Raja", color: "bg-cyan-400", shape: "rounded-tl-3xl rounded-br-3xl" },
    { text: "He is the greatest captain of our country. His record is proof of that.", author: "Sourav Ganguly", color: "bg-yellow-200", shape: "rounded-xl" },
    { text: "When he walks on the field, the opposition knows they are under pressure.", author: "Ricky Ponting", color: "bg-red-400", textColor: "text-white", shape: "rounded-br-none" },
    { text: "He has the coolest brain I have ever seen.", author: "Kevin Pietersen", color: "bg-lime-400", shape: "rounded-tr-none" },
    { text: "He knows exactly what he is doing. He is a master tactician.", author: "Graeme Smith", color: "bg-indigo-300", shape: "rounded-bl-none" },
    { text: "There is no one better than him in finishing games.", author: "Mike Hussey", color: "bg-amber-300", shape: "rounded-[3rem]" },
    { text: "Dhoni finishes off in style! A magnificent strike into the crowd!", author: "Ravi Shastri", color: "bg-white", border: "border-csk-yellow border-4", shape: "rounded-xl" },
    { text: "He has the Midas touch. Whatever he touches turns to gold.", author: "Nasser Hussain", color: "bg-teal-300", shape: "rounded-tr-3xl" },
    { text: "I am learning the ropes of captaincy from him.", author: "Dwayne Bravo", color: "bg-pink-300", shape: "rounded-bl-3xl" },
    { text: "He is a great leader. He gives you belief.", author: "Shane Watson", color: "bg-blue-300", shape: "rounded-tl-xl" },
    { text: "The era of Dhoni is the greatest era of Indian cricket.", author: "Matthew Hayden", color: "bg-green-300", shape: "rounded-br-xl" },
    { text: "He's the best wicketkeeper-batsman the game has seen.", author: "Adam Gilchrist", color: "bg-yellow-400", shape: "rounded-2xl" },
    { text: "He is ice cool. Nothing fazes him.", author: "VVS Laxman", color: "bg-orange-300", shape: "rounded-tr-none" },
    { text: "He backs his players like no one else.", author: "Rohit Sharma", color: "bg-white", shape: "rounded-bl-none" },
    { text: "My inspiration. My big brother.", author: "Hardik Pandya", color: "bg-cyan-300", shape: "rounded-tl-none" },
    { text: "He told me to just enjoy my game.", author: "Jasprit Bumrah", color: "bg-red-300", shape: "rounded-br-none" },
    { text: "He trusts you when no one else does.", author: "Ravindra Jadeja", color: "bg-purple-300", shape: "rounded-xl" },
    { text: "A bowler's captain.", author: "Zaheer Khan", color: "bg-lime-300", shape: "rounded-[2rem]" },
    { text: "He can read the game better than anyone.", author: "Muttiah Muralitharan", color: "bg-indigo-400", textColor: "text-white", shape: "rounded-tr-3xl" },
    { text: "A mastermind behind the stumps.", author: "Glenn McGrath", color: "bg-amber-400", shape: "rounded-bl-3xl" },
    { text: "He made us believe we can win anywhere.", author: "Gautam Gambhir", color: "bg-rose-300", shape: "rounded-tl-3xl" },
    { text: "The best finisher world cricket has ever seen.", author: "Shoaib Akhtar", color: "bg-emerald-300", shape: "rounded-br-3xl" },
    { text: "He doesn't follow the textbook, he writes it.", author: "Wasim Akram", color: "bg-blue-200", shape: "rounded-2xl" },
    { text: "Most dangerous batsman in death overs.", author: "Sanath Jayasuriya", color: "bg-yellow-300", shape: "rounded-tr-none" },
    { text: "One of the greatest cricketing minds.", author: "Stephen Fleming", color: "bg-orange-200", shape: "rounded-bl-none" },
    { text: "He defines calm.", author: "Faf du Plessis", color: "bg-teal-200", shape: "rounded-tl-none" },
    { text: "I have never seen anyone so humble.", author: "Hashim Amla", color: "bg-pink-200", shape: "rounded-br-none" },
    { text: "He is a legend. Pure and simple.", author: "Brian Lara", color: "bg-red-200", shape: "rounded-xl" },
    { text: "He changed the face of Indian cricket.", author: "Rahul Dravid", color: "bg-purple-200", shape: "rounded-[2rem]" },
    { text: "He taught me how to bowl in T20s.", author: "Ravichandran Ashwin", color: "bg-green-200", shape: "rounded-tr-3xl" },
    { text: "Thala is an emotion.", author: "Suresh Raina", color: "bg-yellow-500", shape: "rounded-bl-3xl" },
    { text: "He gives you freedom to express yourself.", author: "Mohammed Shami", color: "bg-blue-400", textColor: "text-white", shape: "rounded-tl-3xl" },
    { text: "He knows what the batsman will do before he does it.", author: "Kuldeep Yadav", color: "bg-indigo-200", shape: "rounded-br-3xl" },
    { text: "He is my half bowler.", author: "Yuzvendra Chahal", color: "bg-amber-200", shape: "rounded-2xl" },
    { text: "Unbelievable cricket brain.", author: "Devon Conway", color: "bg-rose-200", shape: "rounded-tr-none" },
    { text: "He treats everyone the same.", author: "Ruturaj Gaikwad", color: "bg-emerald-200", shape: "rounded-bl-none" },
    { text: "Amazing human being.", author: "Moeen Ali", color: "bg-cyan-200", shape: "rounded-tl-none" },
    { text: "Just his presence gives you confidence.", author: "Sam Curran", color: "bg-lime-200", shape: "rounded-br-none" },
    { text: "Like a father figure to me.", author: "Matheesha Pathirana", color: "bg-purple-100", shape: "rounded-xl" },
    { text: "The way he manages pressure is a lesson for all.", author: "Kane Williamson", color: "bg-orange-100", shape: "rounded-[2rem]" },
    { text: "He is the heartbeat of CSK.", author: "N Srinivasan", color: "bg-yellow-100", shape: "rounded-tr-3xl" },
    { text: "A complete cricketer.", author: "Jacques Kallis", color: "bg-blue-100", shape: "rounded-bl-3xl" },
    { text: "He won everything there is to win.", author: "Harsha Bhogle", color: "bg-white", border: "border-csk-yellow border-4", shape: "rounded-2xl" }
];

export default function LegacyClient() {
    // Split quotes into 3 columns for Masonry layout
    const col1 = quotes.filter((_, i) => i % 3 === 0);
    const col2 = quotes.filter((_, i) => i % 3 === 1);
    const col3 = quotes.filter((_, i) => i % 3 === 2);

    return (
        <section className="relative w-full min-h-screen py-20 px-4 md:px-8 overflow-hidden bg-[#1a1a1a]">
            {/* Background Texture Logic - Preserved from previous iteration if needed, or simple dark bg */}

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">

                {/* Column 1 */}
                <div className="flex flex-col gap-12 pt-0 text-left">
                    {col1.map((item, index) => <QuoteCard key={`c1-${index}`} item={item} />)}
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-12 md:pt-24 text-left">
                    {col2.map((item, index) => <QuoteCard key={`c2-${index}`} item={item} />)}
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-12 pt-0 md:pt-12 text-left">
                    {col3.map((item, index) => <QuoteCard key={`c3-${index}`} item={item} />)}
                </div>

            </div>
        </section>
    );
}

function QuoteCard({ item }: { item: any }) {
    // Random float duration for each card to keep them unsyced
    const duration = Math.random() * 3 + 4;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={`relative p-8 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${item.shape} ${item.color} ${item.textColor || 'text-black'} flex flex-col justify-between min-h-[200px] transition-transform hover:scale-[1.02]`}
            >
                {/* Straight Triangle Tail */}
                <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-black">
                    <div className={`absolute -top-[17px] -left-[12px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] ${item.color.replace('bg-', 'border-t-')}`} />
                </div>

                <p className="font-bold text-xl md:text-2xl leading-tight mb-6 font-comic uppercase tracking-tight">
                    "{item.text}"
                </p>
                <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-black/20 rounded-full" />
                    <span className="text-sm font-black uppercase tracking-widest opacity-70">
                        {item.author}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}
