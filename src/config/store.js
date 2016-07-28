import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from '../reducers'
// import jwt from '../middleware/jwt'

const middleware = [thunk]

if (process.env.ENV === 'DEV') {
  const createLogger = require('redux-logger')
  const logger = createLogger()
  middleware.push(logger)
}

const store = createStore(reducers, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export default store
