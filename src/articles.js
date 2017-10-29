/**
 * This JSDoc plugin allows Markdown articles to be generated and
 * linked to in JSDoc comments. {@link articles:articles/index This article} is
 * an example.
 *
 * @module articles
 */
const fs= require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const walkSync = require('walk-sync');

const jsdocEnv = require('jsdoc/env');
const parseMd = require('jsdoc/util/markdown').getParser();
const templateHelper = require('jsdoc/util/templateHelper');

const confBase = path.dirname(path.join(jsdocEnv.pwd, jsdocEnv.opts.configure));
const dest = path.normalize(jsdocEnv.opts.destination);

module.exports = {
  /**
   * Get the list of articles and register links for them
   */
  getArticles () {
    const filenames = module.exports.getArticlePaths(confBase)
      .map(filename => path.relative(confBase, filename));
    const articles = {};

    for (const filename of filenames) {
      const source = fs.readFileSync(path.join(confBase, filename)).toString();
      const name = filename.replace(/(^[./]+)|([.][^.]*$)/g, '');

      const titleLine = source.match(/^[#\r\n]*(.+)([\r\n]|$)/);
      const title = titleLine ? titleLine[1].trim() : name;

      const article = {
        source,
        name,
        filename,
        title,
        longname: `article:${name}`,
        content: null,
        outfilename: `${name}.html`,
        kind: 'article',
      };

      templateHelper.registerLink(article.longname, article.outfilename);

      articles[filename] = article;
    }

    return articles;
  },

  renderArticles ({ articles, writeOutput = false, resolveLinks = false }) {
    for (const filename in articles) {
      const article = articles[filename];
      let content = parseMd(article.source);

      if (resolveLinks) {
        content = templateHelper.resolveLinks(content);
      }

      article.content = content;

      if (writeOutput) {
        const writePath = path.join(dest, article.outfilename);

        mkdirp(path.dirname(writePath));
        fs.writeFileSync(writePath, article.content);
      }
    }
  },

  getArticlePaths (root) {
    let globs = jsdocEnv.conf.articles || ['./**/*.md', '**/*.markdown'];
    let ignore = (jsdocEnv.conf.source.excludePaths || []).concat(['**/node_modules/**']);

    if (typeof globs === 'string') {
      globs = globs.split(/\s+/g);
    }

    try {
      const gitignore = fs.readFileSync(path.join(root, '.gitignore')).toString();
      ignore = ignore.concat(gitignore.split(/\r?\n/g));
    }
    catch (e) {}

    const filenames = walkSync(root, {
      globs,
      ignore,
      root,
      dot: false,
      directories: false,
    });

    return filenames;
  },
};
