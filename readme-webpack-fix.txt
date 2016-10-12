


- Move the webpack configuration files under “./config”
- What would be a good way to declare paths/path resolution so we don’t have “../../../../” references? Those are very tedious and error-prone.

added aliases to webpack.config

  alias: {
    config: path.join(dirname, './src/config'),
    actions: path.join(dirname, './src/actions'),
    components: path.join(dirname, './src/components'),
  }

and use it

instead of

import {
  PROJECT_SEARCH_PENDING, PROJECT_SEARCH_SUCCESS, PROJECT_SEARCH_FAILURE,
  GET_PROJECTS_PENDING, GET_PROJECTS_SUCCESS, GET_PROJECTS_FAILURE,
  LOAD_MORE_PROJECTS, CLEAR_PROJECT_SEARCH, GET_PROJECTS_SEARCH_CRITERIA
} from '../../config/constants'

use

import {
  PROJECT_SEARCH_PENDING, PROJECT_SEARCH_SUCCESS, PROJECT_SEARCH_FAILURE,
  GET_PROJECTS_PENDING, GET_PROJECTS_SUCCESS, GET_PROJECTS_FAILURE,
  LOAD_MORE_PROJECTS, CLEAR_PROJECT_SEARCH, GET_PROJECTS_SEARCH_CRITERIA
} from 'config/constants'


--------

Unused dependencies

https://github.com/appirio-tech/accounts-app/blob/dev/package.json
There are many unused dependencies that our app doesn't need (angular).
Someone should separate it for example: split angular app and connector to two modules.
 


--------
CSS modules

Temporary, the file must include '.m.scss' to be transformed as a CSS module.
If you rewrite all styles to CSS modules tou can remove this prefix.

Open http://localhost:3000/css to see demo

Components:
SampleCSSModule
SampleSubCSSModule

--------
blueprints

install redux cli:
npm -g  redux-cli

generate component

redux g component MySampleComponent
It will create a component template with CSS modules.
If you don't need unit tests, you can remove blueprints/component/files/src/components/__name__/__name__.spec.js
