module.exports = {
  output: "dist",
  templates: "src/templates",
  static: "public",
  plugins: [
    // Add your custom plugins here if needed
    // Example: require('@sygnal/sse-plugin-myplugin')()
  ],
  buildOptions: {
    // Enable React Fast Refresh in development
    fastRefresh: true,
    
    // Configure CSS handling (Tailwind support)
    css: {
      modules: false,
      postcss: {
        plugins: [
          require('tailwindcss')(),
          require('autoprefixer')()
        ]
      }
    }
  }
};