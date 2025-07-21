import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
// @ts-expect-error - Vimeo player types not available
import Player from '@vimeo/player'

interface VideoPlayerProps {
  vimeoId?: string
  videoUrl?: string
  poster?: string
  title?: string
  autoplay?: boolean
  controls?: boolean
  className?: string
}

export default function VideoPlayer({
  vimeoId,
  videoUrl,
  poster,
  title,
  autoplay = false,
  controls = true,
  className = ''
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const vimeoRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [player, setPlayer] = useState<Player | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(1)

  // Initialize Vimeo player
  useEffect(() => {
    if (!vimeoId || !vimeoRef.current) return

    const vimeoPlayer = new Player(vimeoRef.current, {
      id: parseInt(vimeoId),
      width: 1920,
      height: 1080,
      controls: false,
      autoplay: autoplay,
      muted: false,
      loop: false,
      responsive: true,
      dnt: true,
      quality: 'auto'
    })

    setPlayer(vimeoPlayer)

    // Setup event listeners
    vimeoPlayer.on('loaded', () => {
      setIsLoading(false)
      vimeoPlayer.getDuration().then(setDuration)
    })

    vimeoPlayer.on('play', () => setIsPlaying(true))
    vimeoPlayer.on('pause', () => setIsPlaying(false))
    vimeoPlayer.on('timeupdate', (data: { seconds: number }) => setCurrentTime(data.seconds))
    vimeoPlayer.on('volumechange', (data: { volume: number }) => {
      setVolume(data.volume)
      setIsMuted(data.volume === 0)
    })

    return () => {
      vimeoPlayer.destroy()
    }
  }, [vimeoId, autoplay])

  // Auto-hide controls
  useEffect(() => {
    if (!controls) return

    let timeout: NodeJS.Timeout
    const resetTimeout = () => {
      clearTimeout(timeout)
      setShowControls(true)
      timeout = setTimeout(() => setShowControls(false), 3000)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', resetTimeout)
      container.addEventListener('mouseleave', () => {
        clearTimeout(timeout)
        setShowControls(false)
      })
    }

    return () => {
      clearTimeout(timeout)
      if (container) {
        container.removeEventListener('mousemove', resetTimeout)
        container.removeEventListener('mouseleave', () => setShowControls(false))
      }
    }
  }, [controls])

  // Animate controls visibility
  useEffect(() => {
    if (!controlsRef.current) return

    gsap.to(controlsRef.current, {
      opacity: showControls ? 1 : 0,
      y: showControls ? 0 : 20,
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [showControls])

  // Update progress bar
  useEffect(() => {
    if (!progressRef.current || duration === 0) return

    const progress = (currentTime / duration) * 100
    gsap.to(progressRef.current, {
      width: `${progress}%`,
      duration: 0.1,
      ease: 'none'
    })
  }, [currentTime, duration])

  const togglePlay = () => {
    if (!player) return

    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }

  const toggleMute = () => {
    if (!player) return

    if (isMuted) {
      player.setVolume(volume || 0.5)
    } else {
      player.setVolume(0)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const seekTime = percentage * duration

    player.setCurrentTime(seekTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return

    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    player.setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const enterFullscreen = () => {
    if (!containerRef.current) return

    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen()
    }
  }

  const restart = () => {
    if (!player) return
    player.setCurrentTime(0)
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden group ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Video Container */}
      {vimeoId ? (
        <div ref={vimeoRef} className="absolute inset-0" />
      ) : videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster={poster}
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: poster ? `url(${poster})` : undefined }}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/80 text-sm uppercase tracking-widest">Loading Video</p>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-accent/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent transition-all duration-300 hover:scale-110 border border-accent/20"
          >
            <Play className="w-8 h-8 text-accent-foreground fill-current ml-1" />
          </button>
        </div>
      )}

      {/* Custom Controls */}
      {controls && (
        <div
          ref={controlsRef}
          className="absolute bottom-0 left-0 right-0 p-6"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative space-y-4">
            {/* Progress Bar */}
            <div
              ref={timelineRef}
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative group"
              onClick={handleSeek}
            >
              <div
                ref={progressRef}
                className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all duration-100"
                style={{ width: '0%' }}
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-accent transition-colors p-2"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                </button>

                {/* Restart */}
                <button
                  onClick={restart}
                  className="text-white hover:text-accent transition-colors p-2"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-accent transition-colors p-2"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none slider"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Title */}
                {title && (
                  <span className="text-white text-sm mr-4">{title}</span>
                )}

                {/* Fullscreen */}
                <button
                  onClick={enterFullscreen}
                  className="text-white hover:text-accent transition-colors p-2"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(178, 132, 80, 1);
          cursor: pointer;
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(178, 132, 80, 1);
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  )
}
