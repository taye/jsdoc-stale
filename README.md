# IMPORTANT FEEDBCK FOR jsdoc-stale

Do not mintain this as a fork of minami. Please please make another repository for your project ! Why? 

1) I cannot report issues to yours !
2) I cannot pull request to your projecy
3) you really want to have a separate - new project - with a new name and a new life !!

Because I cannot report issues to jsdoc-stale I'm doing it here: 

# ISSUE 1 (important):  installation instructions doesn't work !! Example: 

mkdir test
cd test
npm init -y
npm install --save-dev jsdoc git+https://git@github.com/taye/jsdoc-stale

That will fail - probably because your installation scripts assume users have 'jsdoc' and 'node-sass' global executables in their systems... Please remove those scripts from installation ! 


# ISSUE 2 : npm publish

Please publish this in npm is very very simple with the command 'npm publish'


Thanks!

P/D: I'm including this template in my jsdoc - templates collection : https://github.com/cancerberoSgx/jsdoc-templates-demo




# jsdoc-stale

A clean, responsive documentation template theme for JSDoc 3 inspired by
[slate](https://github.com/lord/slate) and based on
[minami](https://github.com/nijikokun/minami).

![jsdoc-stale Screenshot](preview.png)


## Install

With npm:

```sh
$ npm install --save-dev jsdoc git+https://git@github.com/taye/jsdoc-stale
```

## configure jsdoc

In your `.jsdoc.json` file, add a template option.

```json
"opts": {
  "template": "node_modules/jsdoc-stale"
}
```

## generate

```bash
$ jsdoc -c .jsdoc.json entry-file.js
```


### Example JSDoc Config

```json
{
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc"]
    },
    "source": {
        "include": ["lib", "package.json", "README.md"],
        "includePattern": ".js$",
        "excludePattern": "(node_modules/|docs)"
    },
    "plugins": [
        "plugins/markdown"
    ],
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": true,
        "useLongnameInNav": false,
        "showInheritedInNav": true
    },
    "opts": {
        "destination": "./docs/",
        "encoding": "utf8",
        "private": true,
        "recurse": true,
        "template": "./node_modules/jsdoc-stale"
    }
}
```

Specifying a number for useLongnameInNav it will be the max number of path elements to show in nav (starting from Class).


## License

Licensed under the Apache2 license.
