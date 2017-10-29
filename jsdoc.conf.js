module.exports = {
  source: {
    include: ['src'],
  },

  opts: {
    destination: './dist/docs/',
    recurse: true,
    template: './',
  },

  plugins: [
    'plugins/markdown',
    './',
  ],

  articles: [
    '**/*.md',
    '**/*.markdown',
  ],

  markdown: {
    idInHeadings: true,
  },

  asdfasdf: 'YES',

  templates: {
    cleverLinks: true,
    baseUrl: '/dist/docs/',
  },
};
