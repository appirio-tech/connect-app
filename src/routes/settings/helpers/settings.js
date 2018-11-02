/**
 * Setting related helper methods
 */
import _ from 'lodash'

/**
 * Format row member traits data to the format which can be rendered by the form 
 * on profile settings page.
 * 
 * @param {Array<Object>} traits list of member traits
 * 
 * @returns {Object} data formated for profile settings page form
 */
export const formatProfileSettings = (traits) => {
  // TODO Revert to 'connect_info' again
  const connectTrait = _.find(traits, ['traitId', 'customer_info'])
  let data = {}

  if (connectTrait) {
    const traitData = _.get(connectTrait, 'traits.data')
    if (traitData && traitData.length > 0) {
      data = traitData[0]
    }
  }

  const basicTrait = _.find(traits, ['traitId', 'basic_info'])
  if (basicTrait) {
    const traitData = _.get(basicTrait, 'traits.data')
    if (traitData && traitData.length > 0) {
      data.photoUrl = traitData[0].photoURL
      data.firstNLastName = `${traitData[0].firstName} ${traitData[0].lastName}`
    }
  }

  return data
}

/**
 * Applies profile settings from the form to row member traits data.
 * This method doesn't mutate traits.
 * 
 * @param {Array<Object>} traits   list of member traits
 * @param {Object} profileSettings profile settings
 * 
 * @returns {Array<Object>} updated member traits data 
 */
export const applyProfileSettingsToTraits = (traits, profileSettings) => {
  const updatedTraits = traits.map((trait) => {
    // we put all the info from profile settings to `customer_info` trait as it is, skipping `photoUrl`
    // TODO Revert to 'connect_info' again
    if (trait.traitId === 'customer_info') {
      const updatedTrait = {...trait}
      const updatedProps = _.omit(profileSettings, 'photoUrl')
      
      updatedTrait.traits = {
        ...trait.traits,
        data: [{
          ..._.get(trait, 'traits.data[0]'),
          ...updatedProps
        }]
      }
      
      return updatedTrait
    }

    // to the `basic_info` we put just photoUrl, firstName and lastName
    if (trait.traitId === 'basic_info') {
      const updatedTrait = {...trait}
      const [firstName, lastName] = profileSettings.firstNLastName ? profileSettings.firstNLastName.split(/\s+/) : []
      const photoURL = profileSettings.photoUrl

      // update only if new values are defined
      const updatedProps = _.omitBy({
        photoURL,
        firstName,
        lastName,
      }, _.isUndefined)
      
      updatedTrait.traits = {
        ...trait.traits,
        data: [{
          ..._.get(trait, 'traits.data[0]'),
          ...updatedProps
        }]
      }
      
      return updatedTrait
    }

    return trait
  })

  return updatedTraits
}