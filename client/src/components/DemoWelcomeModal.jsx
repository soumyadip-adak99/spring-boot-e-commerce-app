import { useState, useEffect } from "react";
import { X, Copy, CheckCircle2 } from "lucide-react";

function DemoWelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedPass, setCopiedPass] = useState(false);

    useEffect(() => {
        const hasSeenDemoWelcome = localStorage.getItem("demo_welcomed");
        if (!hasSeenDemoWelcome) {
            // Small delay so it animates in smoothly after initial paint
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem("demo_welcomed", "true");
            }, 1000);
        }
    }, []);

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } else {
            setCopiedPass(true);
            setTimeout(() => setCopiedPass(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/80 backdrop-blur-md px-4 sm:px-0 opacity-0 animate-[fade-in_0.5s_ease-out_forwards]">
            <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 text-white shadow-2xl translate-y-8 animate-[slide-up_0.6s_spring_forwards]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={20} strokeWidth={1.5} />
                </button>

                <h2 className="museo-headline text-3xl mb-4">Welcome to the Demo</h2>
                <p className="museo-body text-white/60 mb-8 leading-relaxed">
                    This is a <strong className="text-white">standalone demonstration variant</strong> of the platform. It functions entirely without a backend server. 
                    All data, products, orders, and authentication states are fully interactive and mocked entirely within your browser's LocalStorage.
                </p>

                <div className="space-y-6">
                    <div>
                        <span className="block museo-label text-[10px] text-white/40 tracking-widest uppercase mb-2">Test Environment Credentials</span>
                        <p className="text-sm text-white/70 mb-4">Use these details to access the profile features and test the checkout flow immediately:</p>
                        
                        <div className="space-y-3">
                            {/* Email Row */}
                            <div className="flex items-center justify-between bg-[#111] border border-white/5 p-4 group">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 museo-label tracking-widest">EMAIL</span>
                                    <span className="font-mono mt-1">abc@email.com</span>
                                </div>
                                <button 
                                    onClick={() => copyToClipboard('abc@email.com', 'email')}
                                    className="text-white/40 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    {copiedEmail ? <CheckCircle2 size={16} className="text-[#ea0000]" /> : <Copy size={16} />}
                                </button>
                            </div>

                            {/* Password Row */}
                            <div className="flex items-center justify-between bg-[#111] border border-white/5 p-4 group">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 museo-label tracking-widest">PASSWORD</span>
                                    <span className="font-mono mt-1">123456</span>
                                </div>
                                <button 
                                    onClick={() => copyToClipboard('123456', 'password')}
                                    className="text-white/40 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    {copiedPass ? <CheckCircle2 size={16} className="text-[#ea0000]" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-8 py-4 bg-white text-black museo-label text-[10px] tracking-widest uppercase hover:bg-[#ea0000] hover:text-white transition-colors"
                    >
                        Explore Platform
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slide-up {
                    0% { transform: translateY(40px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default DemoWelcomeModal;
