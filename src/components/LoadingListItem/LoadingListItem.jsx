import React, { PropTypes } from 'react'

require('./LoadingListItem.scss')

const LoadingListItem = ({ type }) => {
  switch (type) {
  case 'MEMBER':
    return (
      <div className="loading-list-item">
        <div className="user-info">
          <div className="user-profile">
            <div className="user-avatar"/>

            <div className="username-and-details">
              <div className="username" />

              <div className="user-details">
                <div className="country-and-wins" />

                <div className="member-since" />
              </div>
            </div>
          </div>
        </div>

        <div className="user-stats">
          <div className="aligner">
            <div className="tag-list" />
            <div className="track-list">
              <div className="track-item" />
              <div className="track-item" />
              <div className="track-item" />
              <div className="track-item" />
              <div className="track-item" />
            </div>
          </div>
        </div>
      </div>
    )
  case 'PROJECT':
    return (
      <div className="loading-list-item">
        Loading project
      </div>
    )
  }
}

LoadingListItem.propTypes = {
  type: PropTypes.string.isRequired
}

export default LoadingListItem
