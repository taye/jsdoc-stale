/**
 * @module articles
 */
const fs= require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const walkSync = require('walk-sync');

const jsdocEnv = require('jsdoc/env');
const parseMd = require('jsdoc/util/markdown').getParser();
const templateHelper = require('jsdoc/util/templateHelper');

const confBase = path.dirname(path.relative(jsdocEnv.pwd, jsdocEnv.opts.configure));
const dest = path.normalize(jsdocEnv.opts.destination);

module.exports = {
  /**
   * get the props for an article doclet including source and longname, then
   * register a link
   */
  createArticle (filename) {
    filename = path.relative(confBase, filename);

    let source = fs.readFileSync(path.join(confBase, filename)).toString();
    const name = filename.replace(/(^[./]+)|([.][^.]*$)/g, '');

    const titleLine = source.match(/^[#\r\n]*(.+)([\r\n]|$)/);
    const title = titleLine ? titleLine[1].trim() : name;

    // the template layout adds the title to the html documetn so remove it
    // from the source
    if (titleLine) {
      source = source.substr(titleLine[0].length);
    }

    const article = {
      source,
      name,
      filename,
      title,
      longname: `article:${name}`,
      description: source,
      outfilename: `${name}.html`,
      kind: 'article',
    };

    templateHelper.registerLink(article.longname, article.outfilename);

    return article;
  },

  /**
   * ```js
   * renderArticles{ articles: [], writeOutput: true, resolveLinks: true });
   * ```
   *
   * Render article markdown and optionally resolve
   * links and write output
   */
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

  /**
   * Get an array of article filenames relative to the config file directory
   */
  getArticlePaths (root = confBase) {
    let globs = jsdocEnv.conf.articles || ['**/*.md', '**/*.markdown', '**/*.html'];
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

    return filenames.map(filename => path.relative(confBase, filename));
  },
};
