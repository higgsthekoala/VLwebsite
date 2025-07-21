import { ArrowUpRight } from 'lucide-react'

const Link = ({ href, children }) => (
  <a href={href} onClick={(e) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  }}>
    {children}
  </a>
);

export default function FeaturedSection() {
  return (
    <>
      {/* OUT NOW Section */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative aspect-[4/3] bg-card border border-border overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://ext.same-assets.com/2289865681/4084296907.jpeg')" }}
              />
              <div className="absolute inset-0 project-overlay" />
              <div className="absolute bottom-6 left-6">
                <h3 className="voidlight-subheading text-xl text-foreground mb-1">The Art Of Sound</h3>
                <p className="text-sm text-foreground/70 uppercase tracking-wide">Documentary</p>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <p className="text-sm text-accent uppercase tracking-widest font-semibold mb-4">Featured</p>
                <h2 className="voidlight-heading text-6xl text-foreground mb-6">
                  OUT<br />Now
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  'The Art Of Sound | Episode 1'<br />
                  <br />
                  Available to stream on Youtube.
                </p>
              </div>

              <a
                href="https://www.youtube.com/watch?v=JrVeKpqf-KA"
                className="inline-flex items-center text-foreground hover:text-accent transition-colors group"
              >
                <span className="font-semibold">Watch Now</span>
                <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Introduction Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div>
                <p className="text-sm text-accent uppercase tracking-widest font-semibold mb-4">The Introduction</p>
                <h2 className="hero-text text-foreground text-6xl">
                  <span className="italic font-light">the</span><br />
                  <span className="font-black">Sound</span><br />
                  <span className="italic font-light">of</span><br />
                  <span className="font-black">VOIDLIGHT PICTURES</span>
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  VoidLight Pictures ("VoidLight") is a feature film production company, started in 2025 and
                  operating across North America, Europe, the UK, and Australia. VoidLight offers
                  development and production services in feature film and narrative series, as well as
                  producing its own first-class features with a growing number of signed writers.
                </p>

                <p className="text-lg text-foreground/80 leading-relaxed">
                  VoidLight leverages its ability to access international locations, maximising the budget dollar
                  spend through regional grants, tax incentives, and local experience.
                  The business' focus in 2025 is building a horror-genre slate that is both appealing to
                  audience trends, and executable given the current market conditions.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold tracking-wide transition-colors"
              >
                Contact Us
              </Link>
            </div>

            {/* Right - Decorative element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
              <div className="relative bg-card border border-border p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-accent-foreground border-y-[8px] border-y-transparent ml-1" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60 uppercase tracking-wide">Premium Sound Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
