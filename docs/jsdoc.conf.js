module.exports = {
  source: {
    include: ['../src', '../plugin.js'],
  },

  opts: {
    destination: '../dist/docs/',
    recurse: true,
    // template is set by the plugin
    // template: '../',
  },

  plugins: [
    'plugins/markdown',
    '../',
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
