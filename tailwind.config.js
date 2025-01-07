module.exports = { 
    corePlugins: { 
      preflight: false, // Disable preflight CSS reset to prevent interference with Bootstrap
    }, 
    content: [ 
      "./src/**/*.{js,jsx,ts,tsx}",
      "!./src/**/Navbar.{js,jsx,ts,tsx}", // Exclude Navbar
      "!./src/**/navbar.{js,jsx,ts,tsx}", // Exclude any navbar-related files
    ], 
    theme: { 
      extend: {}, 
    }, 
    plugins: [], 
};