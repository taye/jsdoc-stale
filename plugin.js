/**
 * This JSDoc plugin allows Markdown articles to be generated and
 * linked to in JSDoc comments. {@link article:index This article} is
 * an example.
 *
 * @module plugin
 */

const jsdocEnv = require('jsdoc/env');

// set the JSDoc template
jsdocEnv.conf.opts.template = jsdocEnv.opts.template = __dirname;

const { getArticlePaths, createArticle } = require('./src/articles');

// { filename: { source, name, outFile, ... }, }
let isArticleFile = null;

module.exports = {

  /**
   * handlers called on JSDoc parse events
   */
  handlers: {
    /**
     * search for articles and push them onto jsdoc's list of sourcefiles
     */
    parseBegin: (event) => {
      const filenames = getArticlePaths();

      isArticleFile = {};

      for (const filename of filenames) {
        event.sourcefiles.push(filename);
        isArticleFile[filename] = true;
      }
    },

    /**
     * replace article sources with a single @article tag with the filename as
     * the tag value
    */
    beforeParse: (event) => {
      if (!isArticleFile[event.filename]) {
        return;
      }

      // TODO: make a doclet for each heading in the article
      event.source = `/** @article ${event.filename} **/`;
    },
  },

  /**
   * define the `@article` tag
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

