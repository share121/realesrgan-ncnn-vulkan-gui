module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 4,
      minimumVendorImplementations: 3
    },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}
