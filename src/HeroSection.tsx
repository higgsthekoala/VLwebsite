import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateTextReveal, animateParallax, useMagneticEffect } from '@/animations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  // Magnetic effect for the CTA button
  useMagneticEffect(buttonRef)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonRef.current], {
        opacity: 0,
        y: 100
      })

      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: 30
      })

      // Background parallax setup
      if (bgImageRef.current) {
        gsap.set(bgImageRef.current, { scale: 1.2 })

        gsap.to(bgImageRef.current, {
          scale: 1,
          duration: 8,
          ease: 'power2.out'
        })

        // Parallax effect on scroll
        gsap.to(bgImageRef.current, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // Main animation timeline
      const tl = gsap.timeline({
        delay: 0.5
      })

      // Subtitle animation
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Title animation with stagger
      tl.to(titleRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out'
      }, '-=0.4')

      // Description fade in
      tl.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.6')

      // Button entrance
      tl.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.4')

      // Scroll indicator
      tl.to(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.2')

      // Continuous scroll indicator animation
      const scrollDot = scrollIndicatorRef.current?.querySelector('.scroll-dot')
      if (scrollDot) {
        gsap.to(scrollDot, {
          y: 15,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        })
      }

      // Text reveal animations for title words
      if (titleRef.current) {
        const titleElements = titleRef.current.querySelectorAll('h1')
        titleElements.forEach((element, index) => {
          animateTextReveal(element as HTMLElement, {
            delay: 1 + index * 0.3,
            duration: 1.5,
            stagger: 0.03
          })
        })
      }

      // Mouse follow effect for background
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const xPercent = (clientX / innerWidth - 0.5) * 2
        const yPercent = (clientY / innerHeight - 0.5) * 2

        gsap.to(bgImageRef.current, {
          x: xPercent * 20,
          y: yPercent * 20,
          duration: 2,
          ease: 'power2.out'
        })
      }

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url('https://ext.same-assets.com/2289865681/4143233605.webp')`
        }}
      >
        {/* Dynamic overlay with gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

        {/* Animated noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] bg-noise mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm text-foreground/80 tracking-[0.3em] uppercase mb-8 font-light animate-on-load"
        >
          A Music and Sound Studio
        </p>

        {/* Main Heading with sophisticated typography */}
        <div
          ref={titleRef}
          className="space-y-4 mb-12"
        >
          <h1 className="hero-text text-foreground animate-on-load">
            <span className="italic font-light">the</span>
          </h1>
          <h1 className="hero-text text-foreground animate-on-load">
            <span className="font-black tracking-tighter">Sound</span>
          </h1>
          <h1 className="hero-text text-foreground animate-on-load">
            <span className="italic font-light">of</span>
          </h1>
          <h1 className="hero-text text-foreground animate-on-load">
            <span className="font-black tracking-tighter"> VOIDLIGHT PICTURES</span>
          </h1>
        </div>

        {/* Description with refined typography */}
        <div
          ref={descriptionRef}
          className="max-w-4xl mx-auto mb-12 animate-on-load"
        >
          <p className="text-lg text-foreground/90 leading-relaxed font-light">
            We seek disturbing, daring, and deeply human stories that hide in the shadows, and bring
            them into the light. Our work is driven by the genre's power to explore fear, trauma, and the 
            unknown. We collaborate with fearless storytellers to craft films that don't just scare, they 
            resonate.
            We forge horror from trauma's raw bones, the secrets we bury, and the ashes of the selves we thought we knew.
          </p>
        </div>

        {/* CTA Button with magnetic effect */}
        <div
          ref={buttonRef}
          className="animate-on-load"
        >
          <Link
            href="/projects/the-convert"
            className="inline-flex items-center bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold tracking-wide transition-all duration-300 relative overflow-hidden group border border-accent/20"
            data-cursor="hover"
            data-magnetic="true"
          >
            <span className="relative z-10">View Project</span>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            {/* Dotted border animation */}
            <div className="absolute inset-0 border border-dashed border-accent/30 animate-pulse" />
          </Link>
        </div>
      </div>

      {/* Advanced Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-foreground/50 rounded-full flex justify-center relative overflow-hidden">
            <div
              className="scroll-dot w-1 h-3 bg-foreground/50 rounded-full mt-2 will-change-transform"
            />
          </div>
          <p className="text-xs text-foreground/60 uppercase tracking-widest">Scroll</p>
        </div>
      </div>

      {/* Floating elements for depth */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-accent/30 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-16 w-1 h-1 bg-foreground/20 rounded-full animate-ping" />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 border border-accent/20 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
    </section>
  )
}
