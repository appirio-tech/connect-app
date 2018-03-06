
import { UPDATE_PRODUCT_INDEX, ADD_PRODUCT_TO_PROJECT } from '../../config/constants'

export function updateProductIndex(index) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PRODUCT_INDEX,
      payload: index
    })
  }
}

export function addProductToProject(addingNewProduct) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PRODUCT_TO_PROJECT,
      payload: addingNewProduct
    })
  }
}