import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'



export default function CategoryGrid() {
  const categories = [
    {
      title: 'Film',
      href: '/categories/film',
      image: 'https://ext.same-assets.com/2289865681/175133043.webp'
    },
    {
      title: 'Advertising',
      href: '/categories/advertising',
      image: 'https://ext.same-assets.com/2289865681/1700900015.webp'
    },
    {
      title: 'Television',
      href: '/categories/television',
      image: 'https://ext.same-assets.com/2289865681/2359192254.webp'
    },
    {
      title: 'Documentary',
      href: '/categories/documentary',
      image: 'https://ext.same-assets.com/2289865681/1777885330.webp'
    },
    {
      title: 'Sonic Branding',
      href: '/categories/sonic-branding',
      image: 'https://ext.same-assets.com/2289865681/3516834077.webp'
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.title}>
              <Link
                href={category.href}
                className="group relative aspect-[3/4] bg-card border border-border overflow-hidden block"
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${category.image}')` }}
                  />
                </motion.div>

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 project-overlay"
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 relative z-10">
                  {/* Top - Arrow icon */}
                  <div className="flex justify-end">
                    <motion.div
                      whileHover={{
                        scale: 1.2,
                        rotate: 45
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17
                      }}
                    >
                      <ArrowUpRight className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </div>

                  {/* Bottom - Title */}
                  <motion.div
                    initial={{ y: 10, opacity: 0.8 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3
                      className="voidlight-subheading text-2xl text-foreground"
                      whileHover={{ letterSpacing: "0.05em" }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-foreground/70 mt-1"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      Explore
                    </motion.p>
                  </motion.div>
                </div>

                {/* Hover effect borders */}
                <motion.div
                  className="absolute inset-0 border-2 border-accent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
