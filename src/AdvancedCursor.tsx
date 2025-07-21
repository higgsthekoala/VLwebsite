import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

interface CursorState {
  type: 'default' | 'hover' | 'click' | 'text' | 'video' | 'drag' | 'loading'
  scale: number
  color: string
  blur: number
  mix: string
}

interface TrailParticle {
  x: number
  y: number
  opacity: number
  scale: number
  life: number
  id: number
}

export default function AdvancedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const magneticAreaRef = useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>({
    type: 'default',
    scale: 1,
    color: '#b28450',
    blur: 0,
    mix: 'difference'
  })

  const trailParticles = useRef<TrailParticle[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetPosition = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const isMouseDown = useRef(false)
  const particleId = useRef(0)

  // Cursor states configuration
  const cursorStates: Record<string, Partial<CursorState>> = {
    default: { scale: 1, color: '#b28450', blur: 0, mix: 'difference' },
    hover: { scale: 1.5, color: '#e3e2db', blur: 2, mix: 'normal' },
    click: { scale: 0.8, color: '#409ea6', blur: 0, mix: 'multiply' },
    text: { scale: 0.5, color: '#b28450', blur: 1, mix: 'difference' },
    video: { scale: 2, color: '#e3e2db', blur: 3, mix: 'screen' },
    drag: { scale: 1.2, color: '#c5a284', blur: 1, mix: 'overlay' },
    loading: { scale: 1.3, color: '#b28450', blur: 4, mix: 'normal' }
  }

  // Check if mounted on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize cursor
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    // Set initial position
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      scale: 0
    })

    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }

      // Calculate velocity
      velocity.current.x = e.clientX - targetPosition.current.x
      velocity.current.y = e.clientY - targetPosition.current.y

      targetPosition.current = { x: e.clientX, y: e.clientY }

      if (!isVisible) {
        setIsVisible(true)
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      }

      // Add trail particles
      addTrailParticle(e.clientX, e.clientY)
    }

    const handleMouseDown = () => {
      isMouseDown.current = true
      setCursorState(prev => ({ ...prev, type: 'click' }))
    }

    const handleMouseUp = () => {
      isMouseDown.current = false
      setCursorState(prev => ({ ...prev, type: 'default' }))
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      gsap.to(cursorRef.current, {
        scale: 0,
        duration: 0.2,
        ease: 'power2.in'
      })
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  // Element hover detection
  useEffect(() => {
    const updateCursorState = (element: Element, state: string) => {
      const newState = cursorStates[state]
      if (newState) {
        setCursorState(prev => ({ ...prev, ...newState, type: state as CursorState['type'] }))
      }
    }

    const handleElementHover = (e: Event) => {
      const target = e.target as Element

      // Check for specific data attributes
      if (target.hasAttribute('data-cursor')) {
        const cursorType = target.getAttribute('data-cursor')!
        updateCursorState(target, cursorType)
        return
      }

      // Auto-detect element types
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
        updateCursorState(target, 'hover')
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable) {
        updateCursorState(target, 'text')
      } else if (target.tagName === 'VIDEO' || target.classList.contains('video-player')) {
        updateCursorState(target, 'video')
      } else if ((target as HTMLElement).draggable) {
        updateCursorState(target, 'drag')
      }
    }

    const handleElementLeave = () => {
      setCursorState(prev => ({ ...prev, ...cursorStates.default, type: 'default' }))
    }

    // Add event listeners to all interactive elements
    const addElementListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"], [data-cursor], video, [draggable="true"]')

      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', handleElementHover)
        element.addEventListener('mouseleave', handleElementLeave)
      })

      return () => {
        interactiveElements.forEach(element => {
          element.removeEventListener('mouseenter', handleElementHover)
          element.removeEventListener('mouseleave', handleElementLeave)
        })
      }
    }

    const cleanup = addElementListeners()

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addElementListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cleanup()
      observer.disconnect()
    }
  }, [])

  // Cursor animation loop
  useEffect(() => {
    const animate = () => {
      const cursor = cursorRef.current
      if (!cursor || !isVisible) return

      // Smooth cursor movement with lag
      gsap.to(cursor, {
        x: targetPosition.current.x,
        y: targetPosition.current.y,
        duration: 0.1,
        ease: 'power2.out'
      })

      // Update cursor appearance based on state
      gsap.to(cursor, {
        scale: cursorState.scale,
        filter: `blur(${cursorState.blur}px)`,
        duration: 0.3,
        ease: 'power2.out'
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [isVisible, cursorState])

  // Trail particle system
  const addTrailParticle = useCallback((x: number, y: number) => {
    if (Math.random() > 0.3) return // Reduce particle frequency

    const particle: TrailParticle = {
      x,
      y,
      opacity: 0.8,
      scale: Math.random() * 0.5 + 0.3,
      life: 1,
      id: particleId.current++
    }

    trailParticles.current.push(particle)

    // Limit particle count
    if (trailParticles.current.length > 20) {
      trailParticles.current.shift()
    }
  }, [])

  // Update trail particles
  useEffect(() => {
    const updateTrail = () => {
      const trail = trailRef.current
      if (!trail) return

      // Clear previous particles
      trail.innerHTML = ''

      // Update and render particles
      trailParticles.current = trailParticles.current.filter(particle => {
        particle.life -= 0.05
        particle.opacity = particle.life * 0.8
        particle.scale *= 0.98

        if (particle.life <= 0) return false

        // Create particle element
        const particleEl = document.createElement('div')
        particleEl.style.cssText = `
          position: fixed;
          left: ${particle.x}px;
          top: ${particle.y}px;
          width: ${particle.scale * 10}px;
          height: ${particle.scale * 10}px;
          background: ${cursorState.color};
          border-radius: 50%;
          opacity: ${particle.opacity};
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9998;
          mix-blend-mode: ${cursorState.mix};
        `
        trail.appendChild(particleEl)

        return true
      })

      requestAnimationFrame(updateTrail)
    }

    updateTrail()
  }, [cursorState.color, cursorState.mix])

  // Magnetic effect for special elements
  useEffect(() => {
    const handleMagneticEffect = () => {
      const magneticElements = document.querySelectorAll('[data-magnetic]')

      magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(
          Math.pow(mousePosition.current.x - centerX, 2) +
          Math.pow(mousePosition.current.y - centerY, 2)
        )

        if (distance < 100) {
          const force = (100 - distance) / 100
          const deltaX = (mousePosition.current.x - centerX) * force * 0.3
          const deltaY = (mousePosition.current.y - centerY) * force * 0.3

          gsap.to(element, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
          })

          // Update cursor for magnetic attraction
          if (cursorRef.current) {
            gsap.to(cursorRef.current, {
              x: centerX + deltaX * 0.5,
              y: centerY + deltaY * 0.5,
              duration: 0.2,
              ease: 'power2.out'
            })
          }
        } else {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      })

      requestAnimationFrame(handleMagneticEffect)
    }

    handleMagneticEffect()
  }, [])

  // Loading state animation
  useEffect(() => {
    if (cursorState.type === 'loading') {
      const cursor = cursorRef.current
      if (!cursor) return

      const tl = gsap.timeline({ repeat: -1 })
      tl.to(cursor, {
        rotation: 360,
        duration: 1,
        ease: 'none'
      })
      .to(cursor, {
        scale: cursorState.scale * 1.2,
        duration: 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      }, 0)

      return () => {
        tl.kill()
      }
    }
  }, [cursorState.type, cursorState.scale])

  if (typeof window === 'undefined' || !isMounted) return null

  return (
    <>
      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: cursorState.color,
          borderRadius: '50%',
          mixBlendMode: cursorState.mix as React.CSSProperties['mixBlendMode'],
          border: cursorState.type === 'hover' ? '2px solid rgba(255,255,255,0.3)' : 'none'
        }}
      />

      {/* Trail Container */}
      <div ref={trailRef} className="pointer-events-none" />

      {/* Cursor Ring for Certain States */}
      {(cursorState.type === 'hover' || cursorState.type === 'video') && (
        <div
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: targetPosition.current.x,
            top: targetPosition.current.y,
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            border: '2px solid rgba(178, 132, 80, 0.3)',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite'
          }}
        />
      )}

      {/* Click Ripple Effect */}
      {cursorState.type === 'click' && (
        <div
          className="fixed pointer-events-none z-[9997]"
          style={{
            left: targetPosition.current.x,
            top: targetPosition.current.y,
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            border: '2px solid rgba(64, 158, 166, 0.6)',
            borderRadius: '50%',
            animation: 'ripple 0.6s ease-out'
          }}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
        }

        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

        /* Hide cursor on mobile */
        @media (max-width: 768px) {
          div { display: none !important; }
        }
      `}</style>
    </>
  )
}

// Hook to control cursor state from components
export function useCursor() {
  const setCursorState = (state: 'default' | 'hover' | 'click' | 'text' | 'video' | 'drag' | 'loading') => {
    // This would ideally connect to a global cursor context
    // For now, we can use data attributes
    document.body.setAttribute('data-cursor-state', state)
  }

  const setCursorLoading = (loading: boolean) => {
    setCursorState(loading ? 'loading' : 'default')
  }

  return { setCursorState, setCursorLoading }
}
