const { getArticlePaths, createArticle } = require('./src/articles');

// { filename: { source, name, outFile, ... }, }
let isArticleFile = null;

module.exports = {

  handlers: {
    parseBegin: (event) => {
      const filenames = getArticlePaths();

      isArticleFile = {};

      for (const filename of filenames) {
        event.sourcefiles.push(filename);
        isArticleFile[filename] = true;
      }
    },

    beforeParse: (event) => {
      if (!isArticleFile[event.filename]) {
        return;
      }

      // TODO: make a doclet for each heading in the article
      event.source = `/** @article ${event.filename} **/`;
    },
  },

  /**
   * define the @article tag
   */
  defineTags: dictionary => {
    dictionary.defineTag('article', {
      onTagged: (doclet, tag) => {
        const filename = tag.text;

        doclet.kind = 'article';
        Object.assign(doclet, createArticle(filename));
      },
    });
  },
};

