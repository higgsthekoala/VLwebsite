import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const useGSAPAnimations = () => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),




    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(() => {})
    }
  }, [])

  return { lenis: lenisRef.current }
}

// Text reveal animation
export const animateTextReveal = (element: HTMLElement, options = {}) => {
  const defaults = {
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0.05,
    delay: 0,
  }
  const config = { ...defaults, ...options }

  if (typeof window !== 'undefined' && element) {
    // Custom text splitting
    const text = element.textContent || ''
    const chars: HTMLSpanElement[] = []

    element.innerHTML = ''

    Array.from(text).forEach((char, index) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.className = 'split-char'
      element.appendChild(span)
      chars.push(span)
    })

    gsap.set(chars, {
      y: 100,
      opacity: 0,
      rotationX: -90,
      transformOrigin: '0% 50% -50px'
    })

    const tl = gsap.timeline()

    return tl.to(chars, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger,
      delay: config.delay,
    })
  }
}

// Parallax image animation
export const animateParallax = (element: HTMLElement, options = {}) => {
  const defaults = {
    yPercent: -50,
    ease: 'none',
  }
  const config = { ...defaults, ...options }

  if (typeof window !== 'undefined' && element) {
    return gsap.to(element, {
      yPercent: config.yPercent,
      ease: config.ease,
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })
  }
}

// Magnetic effect
export const useMagneticEffect = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current
    if (!element || typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const deltaX = (clientX - centerX) * 0.2
      const deltaY = (clientY - centerY) * 0.2

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref])
}

// Scroll-triggered fade in animation
export const animateScrollFadeIn = (elements: HTMLElement[], options = {}) => {
  const defaults = {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
  }
  const config = { ...defaults, ...options }

  if (typeof window !== 'undefined' && elements.length) {
    gsap.set(elements, { y: config.y, opacity: config.opacity })

    return gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    })
  }
}

// Loading animation
export const animatePageLoad = () => {
  if (typeof window === 'undefined') return

  const tl = gsap.timeline()

  // Hide everything initially
  gsap.set('.animate-on-load', { opacity: 0, y: 50 })

  return tl
    .to('.animate-on-load', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    })
}

// Video hover animation
export const animateVideoHover = (element: HTMLElement) => {
  if (typeof window === 'undefined' || !element) return

  const video = element.querySelector('video')
  const overlay = element.querySelector('.video-overlay')
  const playButton = element.querySelector('.play-button')

  const tl = gsap.timeline({ paused: true })

  tl.to(video, {
    scale: 1.1,
    duration: 0.6,
    ease: 'power2.out',
  })
  .to(overlay, {
    opacity: 0.8,
    duration: 0.3,
  }, 0)
  .to(playButton, {
    scale: 1.2,
    rotation: 90,
    duration: 0.4,
    ease: 'back.out(1.7)',
  }, 0.2)

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
  }
}

// Dotted border animation (common pattern on Sonar site)
export const animateDottedBorder = (element: HTMLElement) => {
  if (typeof window === 'undefined' || !element) return

  // Create animated dotted border
  const borderElement = document.createElement('div')
  borderElement.className = 'absolute inset-0 pointer-events-none'
  borderElement.style.background = `
    linear-gradient(90deg, transparent 50%, rgba(178, 132, 80, 0.5) 50%),
    linear-gradient(90deg, transparent 50%, rgba(178, 132, 80, 0.5) 50%),
    linear-gradient(0deg, transparent 50%, rgba(178, 132, 80, 0.5) 50%),
    linear-gradient(0deg, transparent 50%, rgba(178, 132, 80, 0.5) 50%)
  `
  borderElement.style.backgroundSize = '20px 2px, 20px 2px, 2px 20px, 2px 20px'
  borderElement.style.backgroundPosition = '0 0, 0 100%, 0 0, 100% 0'
  borderElement.style.backgroundRepeat = 'repeat-x, repeat-x, repeat-y, repeat-y'

  element.appendChild(borderElement)

  // Animate the border
  gsap.to(borderElement, {
    backgroundPosition: '20px 0, -20px 100%, 0 -20px, 100% 20px',
    duration: 2,
    ease: 'none',
    repeat: -1,
  })
}

export default {
  useGSAPAnimations,
  animateTextReveal,
  animateParallax,
  useMagneticEffect,
  animateScrollFadeIn,
  animatePageLoad,
  animateVideoHover,
  animateDottedBorder,
}
