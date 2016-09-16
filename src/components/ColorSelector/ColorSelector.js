import React, {PropTypes} from 'react'
import './ColorSelector.scss'
import cn from 'classnames'
import { SketchPicker } from 'react-color'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import {PROJECT_MAX_COLORS} from '../../config/constants'

class ColorSelector extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      isPickerVisible: false,
      newColor: '#fff',
      colors: _.uniq([...props.defaultColors, ...props.value])
    }
  }
  
  render() {
    const {getValue, name, onChange, setValue} = this.props
    const value = getValue() || []
    const {isPickerVisible, colors, newColor} = this.state

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
        {colors.map((color) =>
          <a
            key={color}
            href="javascript:"
            onClick={() => onColorToggle(color)}
            className={cn('color-card', {selected: value.indexOf(color) !== -1})}
            style={{backgroundColor: color}}
          />
        )}
        
        {colors.length < PROJECT_MAX_COLORS && <a
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
                    if (colors.indexOf(newColor) === -1) {
                      this.setState({colors: [...colors, newColor], newColor: '#fff'})
                    } else {
                      this.setState({newColor: '#fff'})
                    }
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
