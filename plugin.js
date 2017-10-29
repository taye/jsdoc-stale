const { getArticles, renderArticles } = require('./src/articles');

// { filename: { source, name, outFile, ... }, }
let _articles = null;
let _doclets;

module.exports = {

  handlers: {
    parseBegin: (event) => {
      _articles = getArticles();
      _doclets = [];

      for (const filename in _articles) {
        event.sourcefiles.push(filename);
      }
    },

    beforeParse: (event) => {
      if (!_articles[event.filename]) {
        return;
      }

      // TODO: make a doclet for each heading in the article
      event.source = `/** @article ${event.filename} **/`;
    },

    parseComplete: () => {
      renderArticles({
        articles: _articles,
      });

      for (const doclet of _doclets) {
        doclet.content = _articles[doclet.filename].content;
      }
    },
  },

  /**
   * define the @article tag
   */
  defineTags: dictionary => {
    dictionary.defineTag('article', {
      onTagged: (doclet, tag) => {
        doclet.kind = 'article';
        Object.assign(doclet, _articles[tag.text]);

        _doclets.push(doclet);
      },
    });
  },
};

