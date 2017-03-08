# Customer-App

This repository houses new Customer pages, using React, Redux, and Webpack.

## Installation dsa

We use node 5.x and npm 3.x, so you may need to download a new version of node. The easiest way is to download [nvm](https://github.com/creationix/nvm). We have a `.nvmrc` file in the root of the project, so you can just run `nvm use` to switch to the correct version of node.

Install dependencies by running the following in the root of the project:
 - `npm i`
 - **Note:** You must use npm 3. Type `npm -v` to ensure you have a 3.x version.

## NPM Commands
- To run locally, run `npm start` and head to `http://localhost:3000/search/challenges`
- Run tests with `npm test` or use `npm run test:watch` to rerun tests after files change
- To make sure your code passes linting: `npm run lint`
- To create the build: `npm run build`

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
