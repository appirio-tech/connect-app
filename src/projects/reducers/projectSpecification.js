import { UPDATE_PRODUCT_INDEX, ADD_PRODUCT_TO_PROJECT } from '../../config/constants'

const initialState = {
  productIndex: 0,
  addingNewProduct: false
}

export const projectSpecification = function (state=initialState, action) {
  switch (action.type) {
  case UPDATE_PRODUCT_INDEX:
    return Object.assign({}, state, {
      productIndex : action.payload
    })

  case ADD_PRODUCT_TO_PROJECT:
    return Object.assign({}, state, {
      addingNewProduct : action.payload
    })

  default:
    return state
  }
}
