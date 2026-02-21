import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const brandLeftRef = useRef(null);
  const brandRightRef = useRef(null);
  const taglineRef = useRef(null);
  const bottomElementsRef = useRef(null);
  const navRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load animation
    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => setIsLoaded(true),
    });

    // Image reveal
    tl.fromTo(
      imageContainerRef.current,
      { clipPath: "inset(100% 0 0 0)" },
      { 
        clipPath: "inset(0% 0 0 0)", 
        duration: 1.5, 
        ease: "expo.out" 
      }
    )
    .fromTo(
      imageRef.current,
      { scale: 1.2 },
      { scale: 1, duration: 2, ease: "power3.out" },
      "-=1.5"
    );

    // Brand text reveal - slide in from sides
    tl.fromTo(
      brandLeftRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      "-=1.2"
    )
    .fromTo(
      brandRightRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
      "-=1.2"
    );

    // Fade in other elements
    tl.fromTo(
      [taglineRef.current, bottomElementsRef.current],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" },
      "-=0.8"
    );

    // Scroll parallax setup
    const triggers = [];

    // Image parallax
    triggers.push(
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.to(imageRef.current, {
          y: "20%",
          scale: 1.05,
          ease: "none",
        }),
      })
    );

    // Brand text scroll effect (move outwards and fade)
    triggers.push(
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.timeline()
          .to(brandLeftRef.current, { x: -200, opacity: 0, ease: "none" }, 0)
          .to(brandRightRef.current, { x: 200, opacity: 0, ease: "none" }, 0)
          .to(taglineRef.current, { y: -50, opacity: 0, ease: "none" }, 0),
      })
    );

    return () => {
      tl.kill();
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col justify-center"
    >
      {/* Background noise texture */}
      <div className="noise-overlay" />

      {/* Brand Name - Split */}
      <div className="absolute inset-0 flex items-center justify-between px-4 lg:px-20 z-10 pointer-events-none mt-16">
        <h1
          ref={brandLeftRef}
          className="text-[12vw] font-medium text-white/90 tracking-tighter leading-none will-change-transform museo-headline"
        >
          LUXE
        </h1>
        <h1
          ref={brandRightRef}
          className="text-[12vw] font-medium text-white/90 tracking-tighter leading-none will-change-transform museo-headline"
        >
          MARKET
        </h1>
      </div>

      {/* Center Image Container */}
      <div className="relative w-full h-[60vh] md:h-[70vh] max-w-[800px] mx-auto z-20 mt-16">
        <div
          ref={imageContainerRef}
          className="w-full h-full overflow-hidden will-change-transform bg-[#0a0a0a]"
        >
          <img
            ref={imageRef}
            src={heroConfig.backgroundImage}
            alt="Hero"
            className="w-full h-full object-cover will-change-transform transition-all duration-700 hover:scale-105"
          />
        </div>

        {/* Tagline overlaid on image bottom */}
        <div 
          ref={taglineRef}
          className="absolute bottom-[-1rem] lg:bottom-[-2rem] right-0 lg:right-[-4rem] bg-[#050505] p-6 lg:p-8 border border-white/5 z-30"
        >
          <p className="museo-headline text-xl md:text-2xl text-white mb-2 leading-tight">
            {heroConfig.subtitle}
          </p>
          <div className="w-12 h-[1px] bg-[#ea0000] mt-4" />
        </div>
      </div>

      {/* Bottom Elements */}
      <div 
        ref={bottomElementsRef}
        className="absolute bottom-8 left-0 w-full px-8 lg:px-16 flex items-end justify-between z-30 pointer-events-none"
      >
        <div className="flex flex-col gap-1">
          <span className="museo-label text-white/40 uppercase text-[10px] tracking-widest">{heroConfig.servicesLabel}</span>
          <span className="museo-label text-white/40 uppercase text-[10px] tracking-widest">{heroConfig.copyright}</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="museo-label text-white/40 uppercase text-[10px] tracking-widest rotate-90 origin-bottom translate-y-8">
            Scroll to explore
          </span>
          <div className="w-[1px] h-16 bg-white/20 overflow-hidden relative mt-8">
            <div className="w-full h-full bg-white absolute top-[-100%] animate-[scroll-down_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
