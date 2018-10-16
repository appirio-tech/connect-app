/**
 * EnhancedDropdown Component For Notifications
 */
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'

class EnhancedDropdown extends Dropdown{
  constructor(props) {
    super(props)
    this.onClickOutside = this.onClickOutside.bind(this)
  }

  onClickOutside(evt) {
    let currNode = evt.target
    let isDropdown = false
    console.log('onClickOutside')

    do {
      if (currNode.className
        && currNode.className.indexOf
        && currNode.className.indexOf('dropdown-wrap') > -1) {
        isDropdown = true
        break
      }

      currNode = currNode.parentNode

      if (!currNode)
        break
    } while (currNode.tagName)

    if (!isDropdown) {
      this.setState({ isOpen: false }, () => {
        this.props.onToggle()
        this.refreshEventHandlers()
      })
    }
  }

}
export default EnhancedDropdown
