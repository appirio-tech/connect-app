import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './Home.scss'
import homeImgSrc from '../../assets/images/hero-tc-landing.png'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // redirect to project list if user is logged in.
    if (this.props.isLoggedIn)
      this.props.router.push('/projects')
  }

  render() {
    return (
      <div className="content">
        <div className="container">
            <div className="image-container">
                <img src={homeImgSrc} alt="" />
            </div>
            <div className="content-container">
                <h1>Welcome to Topcoder Connect </h1>
                <p>Companies and agencies, from the world’s largest to the Valley’s newest, use crowdsourcing to deliver high-quality assets, faster.</p>
                <p>Join Connect today to see what we can do for your next project through the power of crowdsourcing, delivered by Topcoder.</p>
                <div className="button-bar">
                    <a href="javascript:" className="tc-btn tc-btn-primary">Register for free</a>
                    <a href="javascript:" className="tc-btn tc-btn-default">Learn more about croudsorcing</a>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({loadUser}) => {
  return {
    isLoggedIn: loadUser.isLoggedIn
  }
}

export default withRouter(connect(mapStateToProps)(Home))