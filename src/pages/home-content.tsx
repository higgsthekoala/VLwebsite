// src/pages/home-content.tsx
import { Header } from '@/Header'
import HeroSection from '@/HeroSection'
import CategoryGrid from '@/CategoryGrid'
import ProjectShowcase from '@/ProjectShowcase'
import FeaturedSection from '@/FeaturedSection'
import Footer from '@/Footer'
import PageTransition from '@/PageTransition';
import { useGSAPAnimations } from '@/animations';

export default function HomeContent() {
    const { lenis } = useGSAPAnimations();
  return (
    <PageTransition transitionType="wipe" duration={1.2}>
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <Header />
      <div className="relative">
        <HeroSection />
      </div>
      <main>
        <CategoryGrid />
        <ProjectShowcase />
        <FeaturedSection />
      </main>
      <Footer />

      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-background/20 z-50">
        <div
          id="scroll-progress"
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: '0%' }}
        />
      </div>

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-accent/10 rounded-full animate-float" />
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-foreground/5 rounded-full animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 border border-accent/5 rotate-45 animate-spin-slow" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/[0.02] via-transparent to-accent/[0.02]" />
      </div>
      
    </div>
    </PageTransition>
  )
}
