import React, {PropTypes} from 'react'
import './ColorSelector.scss'
import { SketchPicker } from 'react-color'
import { HOC as hoc } from 'formsy-react'
import {PROJECT_MAX_COLORS} from '../../config/constants'
import { Icons } from 'appirio-tech-react-components'

class ColorSelector extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      isPickerVisible: false,
      newColor: '#fff'
    }
  }
  
  render() {
    const {getValue, name, onChange, setValue, defaultColors } = this.props
    const value = getValue() || defaultColors
    const {isPickerVisible, newColor} = this.state

    const onColorToggle = (color) => {
      const index = value.indexOf(color)
      let newValue
      if (index === -1) {
        newValue = [...value, color]
      } else {
        const tmp = [...value]
        tmp.splice(index, 1)
        newValue = tmp
      }

      setValue(newValue)
      onChange(name, newValue)
    }
    
    return (
      <div className="colorSelector">
        {value.map((color) =>
          <a
            key={color}
            href="javascript:"
            onClick={() => onColorToggle(color)}
            className="color-card"
            style={{backgroundColor: color}}
          >
            <span className="remove-color">
              <Icons.CloseIcon />
            </span>
          </a>
        )}
        
        {value.length < PROJECT_MAX_COLORS && 
          <a
            href="javascript:"
            onClick={() => this.setState({isPickerVisible: true})}
            className="color-card color-card-add"
          >
          {isPickerVisible &&
            <div className="picker-wrapper" onClick={(e) => e.stopPropagation()}>
              <SketchPicker
                color={newColor}
                onChange={(color) => {
                  this.setState({ newColor: color.hex })
                }}
              />
              <div className="buttons">
                <button type="button" className="tc-btn tc-btn-primary tc-btn-md"
                  onClick={() => {
                    this.setState({isPickerVisible: false})
                    const newValue = [...value, newColor]
                    setValue(newValue)
                    onChange(name, newValue)
                  }}
                >Add</button>
                <button
                  type="button"
                  className="tc-btn tc-btn-default tc-btn-md"
                  onClick={() => this.setState({isPickerVisible: false})}
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        </a>}
      </div>
    )
  }
  
}

ColorSelector.propTypes = {
  defaultColors: PropTypes.array.isRequired
}

ColorSelector.defaultProps = {
  onChange: () => {},
  value: [],
  defaultColors: []
}

export default hoc(ColorSelector)
