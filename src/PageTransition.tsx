import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface PageTransitionProps {
  children: React.ReactNode
  transitionType?: 'slide' | 'fade' | 'wipe' | 'curtain' | 'fragment'
  duration?: number
}

export default function PageTransition({
  children,
  transitionType = 'wipe',
  duration = 1.2
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const fragmentsRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = useCurrentPath();

  // Create transition overlays
  useEffect(() => {
    if (!overlayRef.current || !fragmentsRef.current || !curtainRef.current) return

    // Initialize all transition elements
    gsap.set([overlayRef.current, fragmentsRef.current, curtainRef.current], {
      opacity: 0,
      visibility: 'hidden'
    })

    // Create fragment elements for fragment transition
    const fragmentContainer = fragmentsRef.current
    fragmentContainer.innerHTML = ''

    for (let i = 0; i < 20; i++) {
      const fragment = document.createElement('div')
      fragment.className = 'fragment'
      fragment.style.cssText = `
        position: absolute;
        background: #2a2d2f;
        width: ${Math.random() * 300 + 100}px;
        height: ${Math.random() * 300 + 100}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        transform: rotate(${Math.random() * 360}deg);
        transform-origin: center;
      `
      fragmentContainer.appendChild(fragment)
    }

    // Create curtain panels
    const curtainContainer = curtainRef.current
    curtainContainer.innerHTML = ''

    for (let i = 0; i < 5; i++) {
      const panel = document.createElement('div')
      panel.className = 'curtain-panel'
      panel.style.cssText = `
        position: absolute;
        background: linear-gradient(45deg, #2a2d2f, #1a1d1f);
        width: 20%;
        height: 100%;
        left: ${i * 20}%;
        top: 0;
        transform: translateY(-100%);
      `
      curtainContainer.appendChild(panel)
    }
  }, [])

  // Trigger transition on route change
  useEffect(() => {
    performTransition()
  }, [pathname])

  const performTransition = () => {
    setIsTransitioning(true)

    switch (transitionType) {
      case 'slide':
        performSlideTransition()
        break
      case 'fade':
        performFadeTransition()
        break
      case 'wipe':
        performWipeTransition()
        break
      case 'curtain':
        performCurtainTransition()
        break
      case 'fragment':
        performFragmentTransition()
        break
      default:
        performWipeTransition()
    }
  }

  const performSlideTransition = () => {
    if (!containerRef.current || !overlayRef.current) return

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false)
    })

    tl.set(overlayRef.current, {
      visibility: 'visible',
      background: 'linear-gradient(45deg, #2a2d2f, #b28450)',
      x: '-100%'
    })
    .to(overlayRef.current, {
      x: '0%',
      duration: duration * 0.6,
      ease: 'power4.inOut'
    })
    .to(containerRef.current.children[1], {
      opacity: 0,
      scale: 0.95,
      duration: duration * 0.3,
      ease: 'power2.out'
    }, 0)
    .to(containerRef.current.children[1], {
      opacity: 1,
      scale: 1,
      duration: duration * 0.4,
      ease: 'power2.out'
    }, duration * 0.3)
    .to(overlayRef.current, {
      x: '100%',
      duration: duration * 0.6,
      ease: 'power4.inOut'
    }, duration * 0.4)
    .set(overlayRef.current, { visibility: 'hidden' })
  }

  const performFadeTransition = () => {
    if (!containerRef.current || !overlayRef.current) return

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false)
    })

    tl.set(overlayRef.current, {
      visibility: 'visible',
      background: '#2a2d2f',
      opacity: 0
    })
    .to(overlayRef.current, {
      opacity: 1,
      duration: duration * 0.5,
      ease: 'power2.inOut'
    })
    .to(containerRef.current.children[1], {
      opacity: 0,
      y: 30,
      duration: duration * 0.3,
      ease: 'power2.out'
    }, 0)
    .to(containerRef.current.children[1], {
      opacity: 1,
      y: 0,
      duration: duration * 0.4,
      ease: 'power2.out'
    }, duration * 0.3)
    .to(overlayRef.current, {
      opacity: 0,
      duration: duration * 0.5,
      ease: 'power2.inOut'
    }, duration * 0.5)
    .set(overlayRef.current, { visibility: 'hidden' })
  }

  const performWipeTransition = () => {
    if (!containerRef.current || !overlayRef.current) return

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false)
    })

    // Create multiple wipe elements
    const wipeElements: HTMLDivElement[] = []
    for (let i = 0; i < 3; i++) {
      const wipe = document.createElement('div')
      wipe.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: ${i === 0 ? '#2a2d2f' : i === 1 ? '#b28450' : '#409ea6'};
        transform: translateX(-100%);
        z-index: ${10 - i};
      `
      overlayRef.current.appendChild(wipe)
      wipeElements.push(wipe)
    }

    tl.set(overlayRef.current, { visibility: 'visible' })
    .to(wipeElements, {
      x: '0%',
      duration: duration * 0.4,
      stagger: 0.1,
      ease: 'power3.inOut'
    })
    .to(containerRef.current.children[1], {
      opacity: 0,
      rotationX: -10,
      duration: duration * 0.2,
      ease: 'power2.out'
    }, duration * 0.2)
    .to(containerRef.current.children[1], {
      opacity: 1,
      rotationX: 0,
      duration: duration * 0.3,
      ease: 'back.out(1.7)'
    }, duration * 0.4)
    .to(wipeElements, {
      x: '100%',
      duration: duration * 0.4,
      stagger: 0.1,
      ease: 'power3.inOut'
    }, duration * 0.6)
    .set(overlayRef.current, { visibility: 'hidden' })
    .call(() => {
      wipeElements.forEach(el => el.remove())
    })
  }

  const performCurtainTransition = () => {
    if (!curtainRef.current) return

    const panels = curtainRef.current.querySelectorAll('.curtain-panel')
    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false)
    })

    tl.set(curtainRef.current, { visibility: 'visible' })
    .to(panels, {
      y: '0%',
      duration: duration * 0.6,
      stagger: 0.05,
      ease: 'power4.out'
    })

    if (containerRef.current?.children[1]) {
      tl.to(containerRef.current.children[1], {
        opacity: 0,
        scale: 0.9,
        duration: duration * 0.3,
        ease: 'power2.out'
      }, duration * 0.2)
      .to(containerRef.current.children[1], {
        opacity: 1,
        scale: 1,
        duration: duration * 0.4,
        ease: 'elastic.out(1, 0.5)'
      }, duration * 0.4)
    }

    tl.to(panels, {
      y: '100%',
      duration: duration * 0.6,
      stagger: 0.05,
      ease: 'power4.in'
    }, duration * 0.6)
    .set(curtainRef.current, { visibility: 'hidden' })
  }

  const performFragmentTransition = () => {
    if (!fragmentsRef.current) return

    const fragments = fragmentsRef.current.querySelectorAll('.fragment')
    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false)
    })

    tl.set(fragmentsRef.current, { visibility: 'visible' })
    .set(fragments, {
      scale: 0,
      rotation: 'random(-180, 180)',
      opacity: 0
    })
    .to(fragments, {
      scale: 'random(0.8, 1.5)',
      opacity: 'random(0.7, 1)',
      duration: duration * 0.4,
      stagger: 0.02,
      ease: 'back.out(1.7)'
    })

    if (containerRef.current?.children[1]) {
      tl.to(containerRef.current.children[1], {
        opacity: 0,
        scale: 1.1,
        blur: 10,
        duration: duration * 0.3,
        ease: 'power2.out'
      }, duration * 0.1)
      .to(containerRef.current.children[1], {
        opacity: 1,
        scale: 1,
        blur: 0,
        duration: duration * 0.4,
        ease: 'power2.out'
      }, duration * 0.4)
    }

    tl.to(fragments, {
      scale: 0,
      opacity: 0,
      rotation: 'random(-360, 360)',
      duration: duration * 0.5,
      stagger: 0.02,
      ease: 'power3.in'
    }, duration * 0.7)
    .set(fragmentsRef.current, { visibility: 'hidden' })
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Transition Overlays */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
      />

      <div
        ref={fragmentsRef}
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      />

      <div
        ref={curtainRef}
        className="fixed inset-0 z-50 pointer-events-none"
      />

      {/* Page Content */}
      <div className={isTransitioning ? 'pointer-events-none' : ''}>
        {children}
      </div>

      {/* Transition Progress Indicator */}
      {isTransitioning && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex items-center space-x-2 text-accent">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-mono uppercase tracking-widest">
              Transitioning
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for programmatic transitions
export function usePageTransition() {
  const triggerTransition = (
    type: 'slide' | 'fade' | 'wipe' | 'curtain' | 'fragment' = 'wipe',
    callback?: () => void
  ) => {
    // This would be connected to a global transition context
    // For now, we'll use a simple approach
    if (callback) {
      setTimeout(callback, 100)
    }
  }

  return { triggerTransition }
}

// Loading transition component
export function LoadingTransition({ isLoading }: { isLoading: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current) return

    if (isLoading) {
      gsap.set(overlayRef.current, { visibility: 'visible' })
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(overlayRef.current, { visibility: 'hidden' })
        }
      })
    }
  }, [isLoading])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      style={{ visibility: 'hidden', opacity: 0 }}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Animated logo */}
        <div className="text-4xl font-black tracking-tight text-foreground">
          VOIDLIGHT
        </div>

        {/* Loading animation */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-accent rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <p className="text-foreground/60 text-sm uppercase tracking-widest">
          Loading Experience
        </p>
      </div>
    </div>
  )
}
// ADD THIS CUSTOM PATH HOOK
function useCurrentPath() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}

// IN YOUR COMPONENT
const pathname = useCurrentPath();