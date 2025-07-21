import { ArrowUpRight, ArrowRight } from 'lucide-react'

export default function Footer() {
  const sitemapLinks = [
    { label: 'Index', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Team', href: '/team' },
    { label: 'Studio', href: '/studio' },
    { label: 'Contact', href: '/contact' },
  ]

  const legalLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Cookie', href: '/cookie' },
    { label: 'Terms', href: '/terms' },
  ]

  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/voidlightpictures/?hl=en' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Spotify', href: 'https://open.spotify.com/' },
  ]

  const categories = [
    { label: 'Film', href: '/categories/film' },
    { label: 'Advertising', href: '/categories/advertising' },
    { label: 'Television', href: '/categories/television' },
    { label: 'Documentary', href: '/categories/documentary' },
    { label: 'Branding', href: '/categories/branding' },
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="voidlight-subheading text-2xl text-foreground mb-6">
              Sign Up to our newsletter
            </h3>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-input border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 font-semibold transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-4 text-sm">
              <p className="text-green-500">Thank you! Your submission has been received!</p>
              <p className="text-red-500 hidden">Oops! Something went wrong while submitting the form.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="voidlight-heading text-3xl text-foreground mb-4">VOIDLIGHT PICUTRES</h3>
                <div className="space-y-2 text-foreground/80">
                  <p><span className="text-foreground/60">Company:</span> VOIDLIGHT PICUTRES</p>
                  <p><span className="text-foreground/60">Location:</span> Brooklyn, NYC</p>
                  <p><span className="text-foreground/60">Categories:</span> Film, Advertising, Television</p>
                  <p><span className="text-foreground/60">City:</span> New York, USA</p>
                  <p><span className="text-foreground/60">Services:</span> Feature Film Development & Production</p>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="voidlight-subheading text-lg text-foreground mb-4">Services</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.label}
                      href={category.href}
                      className="text-foreground/80 hover:text-accent transition-colors text-sm"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sitemap */}
            <div>
              <h4 className="voidlight-subheading text-lg text-foreground mb-6">Sitemap</h4>
              <div className="space-y-3">
                {sitemapLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center text-foreground/80 hover:text-accent transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>


          
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center">
                <span className="text-accent font-black text-sm">S</span>
              </div>
              <p className="text-sm text-foreground/60">© 2024 Voidlight Pictures. All nightmares reserved.</p>
              <p className="text-sm text-foreground/60">Crafted in the shadows of independent cinema.</p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {legalLinks.map((link, index) => (
                <span key={link.label} className="flex items-center">
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-foreground/30 mx-3">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
