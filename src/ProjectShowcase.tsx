import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagneticEffect, animateScrollFadeIn, animateDottedBorder } from '@/animations'
import VideoPlayer from './VideoPlayer'
import { useState } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Project {
  title: string
  category: string
  href: string
  thumbnail: string
  aspectRatio?: 'square' | 'wide' | 'tall'
  featured?: boolean
  vimeoId?: string
  videoUrl?: string
  duration?: string
}

const Link = ({ href, children }) => (
  <a href={href} onClick={(e) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  }}>
    {children}
  </a>
);

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const projects: Project[] = [
    {
      title: 'Speedo',
      category: 'Advertising',
      href: '/projects/speedo',
      thumbnail: 'https://ext.same-assets.com/2289865681/2561723403.jpeg',
      aspectRatio: 'wide',
      vimeoId: '76979871', // Example Vimeo ID
      duration: '02:15'
    },
    {
      title: 'Ladies In Black',
      category: 'Television',
      href: '/projects/ladies-in-black',
      thumbnail: 'https://ext.same-assets.com/2289865681/35352939.jpeg',
      aspectRatio: 'square',
      vimeoId: '198488177',
      duration: '01:42'
    },
    {
      title: 'The Speedway Murders',
      category: 'Documentary',
      href: '/projects/the-speedway-murders',
      thumbnail: 'https://ext.same-assets.com/2289865681/2253921971.jpeg',
      aspectRatio: 'square',
      vimeoId: '167434033',
      duration: '03:28'
    },
    {
      title: 'The Art Of Sound',
      category: 'Documentary',
      href: '/projects/the-art-of-sound',
      thumbnail: 'https://ext.same-assets.com/2289865681/4084296907.jpeg',
      aspectRatio: 'tall',
      featured: true,
      vimeoId: '115098447',
      duration: '04:12'
    },
    {
      title: 'The Convert',
      category: 'Film',
      href: '/projects/the-convert',
      thumbnail: 'https://ext.same-assets.com/2289865681/2818299650.jpeg',
      aspectRatio: 'square',
      vimeoId: '125095515',
      duration: '02:45'
    },
    {
      title: 'Gold',
      category: 'Film',
      href: '/projects/gold',
      thumbnail: 'https://ext.same-assets.com/2289865681/3205710169.jpeg',
      aspectRatio: 'square',
      vimeoId: '148003889',
      duration: '01:58'
    },
    {
      title: 'The Hunter',
      category: 'Film',
      href: '/projects/the-hunter',
      thumbnail: 'https://ext.same-assets.com/2289865681/83454339.jpeg',
      aspectRatio: 'square',
      vimeoId: '108018156',
      duration: '02:33'
    },
    {
      title: 'The Artful Dodger',
      category: 'Television',
      href: '/projects/the-artful-dodger',
      thumbnail: 'https://ext.same-assets.com/2289865681/2365154974.webp',
      aspectRatio: 'wide',
      vimeoId: '194276412',
      duration: '03:07'
    }
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Initial setup
      const cards = gridRef.current?.querySelectorAll('.project-card')
      if (cards) {
        gsap.set(cards, {
          opacity: 0,
          y: 100,
          scale: 0.9
        })

        // Staggered entrance animation
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
          }
        })

        // Add dotted border animations to random cards
        cards.forEach((card, index) => {
          if (index % 3 === 0) { // Every third card gets dotted border
            animateDottedBorder(card as HTMLElement)
          }
        })
      }

      // Parallax effect for thumbnails
      cards?.forEach((card) => {
        const thumbnail = card.querySelector('.project-thumbnail')
        if (thumbnail) {
          gsap.to(thumbnail, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          })
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(178, 132, 80, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with animation */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black text-foreground mb-4 animate-on-load">Featured Work</h2>
          <div className="w-20 h-1 bg-accent mx-auto animate-on-load" />
        </div>

        {/* Masonry-style grid with sophisticated animations */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isPlaying={playingVideo === project.title}
              onPlay={() => setPlayingVideo(project.title)}
              onStop={() => setPlayingVideo(null)}
            />
          ))}
        </div>
      </div>

      {/* Floating animation elements */}
      <div className="absolute top-20 left-10 w-4 h-4 border border-accent/20 rotate-45 animate-pulse" />
      <div className="absolute bottom-32 right-16 w-2 h-2 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-foreground/10 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isPlaying,
  onPlay,
  onStop
}: {
  project: Project;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const thumbnailRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Magnetic effect
  useMagneticEffect(cardRef)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const card = cardRef.current
    const thumbnail = thumbnailRef.current
    const playButton = playButtonRef.current
    const overlay = overlayRef.current

    if (!card || !thumbnail || !playButton || !overlay) return

    // Hover animation timeline
    const hoverTl = gsap.timeline({ paused: true })

    hoverTl
      .to(thumbnail, {
        scale: 1.1,
        duration: 0.8,
        ease: 'power2.out'
      })
      .to(overlay, {
        opacity: 0.9,
        duration: 0.4
      }, 0)
      .to(playButton, {
        scale: 1.2,
        rotation: 180,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, 0.2)
      .to(card.querySelector('.project-info'), {
        y: -10,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.3)

    // Mouse events
    const handleMouseEnter = () => {
      hoverTl.play()

      // Cursor follow effect
      gsap.set(playButton, { transformOrigin: 'center center' })
    }

    const handleMouseLeave = () => {
      hoverTl.reverse()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(playButton, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)
    card.addEventListener('mousemove', handleMouseMove)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
      card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const getAspectRatioClass = () => {
    switch (project.aspectRatio) {
      case 'wide':
        return 'aspect-[16/9] md:col-span-2'
      case 'tall':
        return 'aspect-[3/4] md:row-span-2'
      case 'square':
      default:
        return 'aspect-square'
    }
  }

  return (
    <div
      ref={cardRef}
      className={`project-card group relative bg-card border border-border overflow-hidden will-change-transform ${getAspectRatioClass()}`}
      data-cursor="video"
      data-magnetic="true"
    >
      <div className="block w-full h-full relative">
        {/* Video Player or Thumbnail */}
        {isPlaying && project.vimeoId ? (
          <VideoPlayer
            vimeoId={project.vimeoId}
            poster={project.thumbnail}
            title={project.title}
            autoplay={true}
            controls={true}
            className="absolute inset-0"
          />
        ) : (
          <div
            ref={thumbnailRef}
            className="project-thumbnail absolute inset-0 bg-cover bg-center will-change-transform cursor-pointer"
            style={{ backgroundImage: `url('${project.thumbnail}')` }}
            onClick={onPlay}
          />
        )}

        {/* Video thumbnail overlay simulation */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Animated overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 opacity-60 transition-opacity duration-500"
        />

        {/* Play button with sophisticated animation */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              ref={playButtonRef}
              onClick={onPlay}
              className="bg-foreground/20 backdrop-blur-sm rounded-full p-6 border border-foreground/10 will-change-transform hover:bg-accent/90 transition-colors duration-300"
              data-cursor="hover"
            >
              <Play className="w-8 h-8 text-foreground fill-current" />
            </button>
          </div>
        )}

        {/* Content with staggered animations */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 relative z-10">
          {/* Top right - Arrow icon with magnetic effect */}
          <div className="flex justify-end">
            <div className="hover-arrow-icon">
              <ArrowUpRight className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>

          {/* Bottom - Project info */}
          <div className="project-info">
            <Link
              href={project.href}
              className="block"
              data-cursor="hover"
            >
              <h3 className="voidlight-subheading text-xl text-foreground mb-1 group-hover:tracking-wide transition-all duration-300 hover:text-accent">
                {project.title}
              </h3>
            </Link>
            <p className="text-sm text-foreground/70 uppercase tracking-wide group-hover:text-accent transition-colors duration-300">
              {project.category}
            </p>

            {/* Featured badge with pulse animation */}
            {project.featured && (
              <div className="mt-2">
                <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold uppercase tracking-wide relative overflow-hidden">
                  <span className="relative z-10">Featured</span>
                  <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Video duration indicator */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-black/60 text-white px-2 py-1 text-xs font-mono border border-white/10">
            {isPlaying ? 'PLAYING' : project.duration || '02:30'}
          </span>
        </div>

        {/* Video controls overlay */}
        {isPlaying && (
          <div className="absolute top-4 right-4 z-20 flex space-x-2">
            <button
              onClick={onStop}
              className="bg-black/60 text-white px-3 py-1 text-xs font-mono border border-white/10 hover:bg-accent/80 transition-colors"
              data-cursor="hover"
            >
              STOP
            </button>
          </div>
        )}

        {/* Glitch effect overlay for hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        </div>

        {/* Border glow effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors duration-500" />

        {/* Corner accent elements */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-accent/0 group-hover:border-accent/50 transition-colors duration-500" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-accent/0 group-hover:border-accent/50 transition-colors duration-500" />
      </div>
    </div>
  )
}
