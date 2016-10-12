


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