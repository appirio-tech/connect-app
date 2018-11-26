# Topcoder Connect App

Topcoder Connect is client facing application of Topcoder. Customers use Topcoder Connect to input requirements of their projects, then managers and
copilots take it from there. 

## Requirements

- Node.js 8+
- Npm 5+

## Run locally for development

Prior to running the application locally you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder-dev.com`.

- `$ npm install` - Installs all dependencies.
- `$ npm start` - Run application in development mode against Topcoder development environment using [dev](https://github.com/appirio-tech/connect-app/blob/dev/config/constants/dev.js) config. In this case the frontend is build in memory by webpack server and uses dev tools like redux-logger.

Open browser with URL http://local.topcoder-dev.com:3000.

## NPM commands

- `$ npm start` - Run application in development mode against Topcoder development environment. In this case the frontend is build in memory by webpack server and uses dev tools like redux-logger.
- `$ npm build` - Create build for production in `/dest` folder. In this case built app is configured to run against Topcoder production environment using [prod](https://github.com/appirio-tech/connect-app/blob/dev/config/constants/master.js) config. Files are being minimized and `gzipped`.
- `$ npm run lint` - Check js code linting.
- `$ npm run lint:fix` - Check js code linting and trying to fix errors automatically.
- `$ npm run test` - Performs tests running. **Note** we don't really have tests, so we only keep this command run successfully.
- `$ npm run test:watch` - Performs tests on files changes.

## TC Deployment Notes
_[TC Deployment Notes should always be kept up to date **on the default branch**. Update these notes when changes to this information occur]_

**General Deployment:** This software is deployed to AWS S3 by CircleCI. It's ultimately delivered through AWS Cloudfront, which is fed from the S3 bucket. There are no EC2 systems involved in the delivery (althought Connect is fed from various micro-services).

**Branches:**

* Any commits to ```dev``` will will trigger a build and deploy to the _dev_ AWS environment
* Any commits to ```feature/deep-links``` will will trigger a build and deploy to the _dev_ AWS environment
* Any commits to ```master``` will trigger a build and deploy to the _prod_ AWS environment

**Development Flow:** This repo uses typical Gitflow (```feature/[feature name]```, ```hotfix/[fix name]```, ...etc). Generally changes to prod should be merged from dev to master. Hotfixes should be merged to master and dev at the same time.

**Additional Notes:**

* The _circle.yml_ file controls the build - see this file if you need to confirm if your commit will deploy anything
* Circle-ci builds can be easily cancelled - please do so if you accidentally trigger an undesired build

## Contributing

### Pull Requests

To contribute to the repository, please create a feature branch off of the dev branch. Once you're finished working on the feature, make a pull request to merge it into dev. Please make sure that every pull request has passed the build checks, which appear just before the "Merge pull request" button in github.

### Code Style

***Checkout the code and comments in `src/components/ExampleComponent` for an example React component, `.scss` file, and tests.***

React
  - Most components should be stateless and use the [functional component](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components) pattern
  - If you need a stateful component, use [ES6 classes](http://facebook.github.io/react/docs/reusable-components.html#es6-classes)
  - Always use [PropTypes](http://facebook.github.io/react/docs/reusable-components.html#prop-validation) for all props
  - Use `classnames` for dynamic classes. See `ExampleComponent` for an example.

JavaScript
  - Make sure your variable names are easy to understand and descriptive. No acronyms, except for common ones like `i` or `err`.
  - Use `lodash` and functional JavaScript if it makes the code clearer.
  - Please use ES2015 syntax whenever possible
  - Specific rules are enforced via `.eslintrc.json`
  - Run `npm run lint` to check your code against the linter

SCSS Files
  - This repository uses flexbox for arranging content
  - The use of any extra CSS libraries should be discussed with the team
  - Use SCSS syntax, but do not overly nest
  - Use 2 spaces for indentation
  - Use variables, mixins, and classes as much as possible from our [style guide](https://github.com/appirio-tech/styles/tree/master/styles/topcoder)
  - To include variables from the style guide mentioned above, place `@import 'topcoder/tc-includes;'` at the top of your `.scss` file. Locally, you can look in `./node_modules/appirio-styles/styles/topcoder/_tc-colors.scss` to find many colors already defined (e.g. `#A3A3AE` => `$accent-gray`)
  - When adding media queries, nest them inside the element, rather than creating a new section
  ```
  @import 'topcoder/tc-includes;'

  $my-local-var: 50px;

  .box {
    height: $my-local-var;
    width: 50px;
    color: $medium-gray;
    @media screen and (min-width: 768px) {
      height: 100px;
      width: 100px;
      color: $dark-gray;
    }

    .inside-box {
      font-size: 14px;
      @media screen and (min-width: 768px) {
        font-size: 18px;
      }
    }
  }
SVG Icons
  - This repository uses plugin babel-plugin-inline-react-svg
  - The plugin is used to inline-embed svg icons inside the markup

  Steps to adding new icons
  - Insert the svg file in the ~/src/assets/images/ directory
  - Add a new icon component file in directory ~/src/components/Icons/Icon-Name.jsx and reference it on the global
    icon component in the ~/src/components/icons/ directory
  - Wrap the svg icon inside an object for caching to optimize on perfomance.
  ```

### Writing Tests
- `npm test` will run the current tests
- `npm run test:watch` will rerun tests when files change
- Place your test files in the same directory as the component it's testing
- Test files should be named `ComponentName.spec.js`
- Checkout the ExampleComponent directory in `/src/components`

## Recommended Developer Tools

### Syntax highlighting for ES6 and React JSX
- Install [babel](https://packagecontrol.io/packages/Babel) via the package manager in Sublime Text
  - **Note:** Sublime Text 3 is required for this plugin
- Set the plugin as the default syntax for a particular extension
  - Open a file with the `.js` extension
  - Select `View` from the menu
  - Then `Syntax -> Open all with current extension as...`
  - Then `Babel -> JavaScript (Babel)`
  - Repeat for any other extensions, e.g. `.jsx`

### Recommended Theme
- Install [Oceanic Next Color Theme](https://github.com/voronianski/oceanic-next-color-scheme) via the Sublime Text package manager.
- Add the following to `Sublime Text -> Preferences -> Settings-User` (`⌘ + ,` on Mac)
```
{
  "color_scheme": "Packages/Oceanic Next Color Scheme/Oceanic Next.tmTheme",
  "theme": "Oceanic Next.sublime-theme"
}
```

### Automatic JavaScript linting in Sublime Text
- Install [SublimeLinter](http://sublimelinter.readthedocs.org/en/latest/installation.html) following the instructions under "Installing via Package Control"
- Install [SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint) with the package manager. The package is called `SublimeLinter-contrib-eslint`

### Code expander
- Examples:
  - `div.cool-class` becomes `<div className="cool-class"></div>`
  - `a` becomes `<a href=""></a>`
- Install [Emmet](https://github.com/sergeche/emmet-sublime) via Sublime Text package manager
- Configure Emmet to work with React, e.g. classes expand to `className` instead of `class`
- Follow the instructions under [Get Emmet working](http://www.nitinh.com/2015/02/setting-sublime-text-react-jsx-development/)
  - **Note:** Add the last snippet of code to `reg_replace.sublime-settings` by navigating to  `Sublime Text -> Preferences -> Package Settings -> Reg Replace -> Settings-User`

© 2017 Topcoder. All Rights Reserved
