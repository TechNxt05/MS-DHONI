import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-12 bg-zinc-950 border-t border-zinc-900 text-center text-zinc-500">
            <div className="container mx-auto px-4">
                <p className="flex items-center justify-center gap-2 mb-4">
                    Made by Amritanshu Yadav
                </p>
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} MS Dhoni Tribute. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
