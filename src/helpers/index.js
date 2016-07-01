import _ from 'lodash'
import fetch from 'isomorphic-fetch'

// Fetch helpers
export function status(response) {
  if (response.status >= 200 && response.status < 400) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

export function json(response) {
  return response.json()
}

export function fetchJSON(url, options) {
  return fetch(url, options)
  .then(status)
  .then(json)
}

// Subtrack Abbreviations
export function getSubtrackAbbreviation(subtrack) {
  const subtrackAbbreviations = {
    APPLICATION_FRONT_END_DESIGN  : 'FE',
    ARCHITECTURE                  : 'Ar',
    ASSEMBLY_COMPETITION          : 'As',
    BANNERS_OR_ICONS              : 'BI',
    BUG_HUNT                      : 'BH',
    CODE                          : 'Cd',
    COMPONENT_PRODUCTION          : 'Cp',
    CONCEPTUALIZATION             : 'Cn',
    CONTENT_CREATION              : 'CC',
    COPILOT                       : 'FS',
    COPILOT_POSTING               : 'CP',
    DEPLOYMENT                    : 'Dp',
    DESIGN                        : 'Ds',
    DESIGN_FIRST_2_FINISH         : 'F2F',
    DEVELOP_MARATHON_MATCH        : 'MM',
    DEVELOPMENT                   : 'Dv',
    FIRST_2_FINISH                : 'F2F',
    FRONT_END_FLASH               : 'Fl',
    GENERIC_SCORECARDS            : 'G',
    IDEA_GENERATION               : 'IG',
    LOGO_DESIGN                   : 'Lg',
    MARATHON_MATCH                : 'MM',
    PRINT_OR_PRESENTATION         : 'PP',
    PROCESS                       : 'Ps',
    REPORTING                     : 'Rp',
    RIA_BUILD_COMPETITION         : 'RB',
    RIA_COMPONENT_COMPETITION     : 'RC',
    SECURITY                      : 'Sc',
    SPEC_REVIEW                   : 'SR',
    SPECIFICATION                 : 'SPC',
    SRM                           : 'SRM',
    STUDIO_OTHER                  : 'O',
    TEST_SCENARIOS                : 'Ts',
    TEST_SUITES                   : 'TS',
    TESTING_COMPETITION           : 'Tg',
    UI_PROTOTYPE_COMPETITION      : 'Pr',
    WEB_DESIGNS                   : 'Wb',
    WIDGET_OR_MOBILE_SCREEN_DESIGN: 'Wg',
    WIREFRAMES                    : 'Wf'
  }

  const abbreviation = subtrackAbbreviations[subtrack] || 'O'

  return abbreviation
}

// Detect end of the page on scroll
export function isEndOfScreen(callback, ...callbackArguments) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
    callback.apply(null, callbackArguments)
  }
}

// Miscellaneous helpers
export function getRoundedPercentage(number) {
  if (_.isFinite(number)) {
    const roundedNumber = Math.round(number)

    return String(roundedNumber) + '%'
  }

  return ''
}

export function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function singlePluralFormatter(num, noun) {
  switch (num) {
  case 0:
  case undefined:
  case null:
    return ''
  case 1:
    return `1 ${noun}`
  default:
    return `${num} ${noun}s`
  }
}
