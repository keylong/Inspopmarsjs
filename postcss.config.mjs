const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 在生产环境中使用 cssnano 压缩 CSS
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
        }],
      },
    } : {}),
  },
};

export default config;
