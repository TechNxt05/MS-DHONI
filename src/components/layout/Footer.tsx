import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-12 bg-zinc-950 border-t border-zinc-900 text-center text-zinc-500">
            <div className="container mx-auto px-4">
                <p className="flex items-center justify-center gap-2 mb-4 text-zinc-300 font-semibold">
                    Made with <Heart className="w-4 h-4 text-csk-yellow" /> by Amritanshu Yadav
                </p>
                <p className="text-sm mb-2">
                    Tribute-first experience for MS Dhoni, with Fan Universe as a dedicated sub-feature.
                </p>
                <p className="text-xs text-zinc-600 mb-2">
                    2007 • 2011 • 2013 | The Captain Cool Legacy
                </p>
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} MS Dhoni Tribute. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
