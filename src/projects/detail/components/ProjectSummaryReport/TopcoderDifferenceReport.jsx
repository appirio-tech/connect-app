import React from 'react'
import PT from 'prop-types'
import { formatNumberWithCommas } from '../../../../helpers/format'
import './TopcoderDifferenceReport.scss'

function formatLargeNumber(number) {
  if(number > 1e6) {
    return `${(number / 1e6).toFixed(1)}M`
  } else if(number > 1e3) {
    return `${(number / 1e3).toFixed(0)}K`
  } else {
    return (number || '').toString()
  }
}

const TopcoderDifferenceReport = ({ difference }) => {
  const { countries, registrants, designs, linesOfCode, hoursSaved, costSavings, valueCreated } = difference

  return (
    <div>
      <h1 styleName="title">TOPCODER DIFFERENCE</h1>
      <div styleName="stats">
        {countries && <div>
          <div styleName="value">
            {countries}
          </div>
          <div styleName="label">
            COUNTRIES
          </div>
        </div>
        }
        {registrants && <div>
          <div styleName="value">
            {registrants}
          </div>
          <div styleName="label">
            REGISTRANTS
          </div>
        </div>
        }
        {designs && <div>
          <div styleName="value">
            {designs}
          </div>
          <div styleName="label">
            DESIGNS
          </div>
        </div>
        }
        {linesOfCode && <div>
          <div styleName="value">
            {formatLargeNumber(linesOfCode)}
          </div>
          <div styleName="label">
            LINES OF CODE
          </div>
        </div>
        }
        {hoursSaved && <div>
          <div styleName="value">
            {hoursSaved}
          </div>
          <div styleName="label">
            HOURS SAVED
          </div>
        </div>
        }
        {costSavings && <div>
          <div styleName="value">
            {formatLargeNumber(costSavings)}
          </div>
          <div styleName="label">
            COST SAVINGS
          </div>
        </div>
        }
        { valueCreated && <div>
          <div styleName="value">
            $ {formatNumberWithCommas(valueCreated)}
          </div>
          <div styleName="label">
            VALUE CREATED
          </div>
        </div>}
      </div>
    </div>
  )
}

TopcoderDifferenceReport.propTypes = {
  difference: PT.object.isRequired,
}

export default TopcoderDifferenceReport
