// import React from 'react'
// import { connect } from 'react-redux'
// import Autosuggest from 'react-autosuggest'
// import { Avatar } from 'appirio-tech-react-components'
// //
// // const localMembers = [
// //   {
// //     lastName: "last1",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "first1",
// //     handle: "parth",
// //     userId: 1
// //   },
// //   {
// //     lastName: "last2",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "lazer",
// //     handle: "pat",
// //     userId: 2
// //   },
// //   {
// //     lastName: "last3",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "paul",
// //     handle: "paul",
// //     userId: 3
// //   },{
// //     lastName: "pitch3",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "pitchy",
// //     handle: "pokemon",
// //     userId: 4
// //   },{
// //     lastName: "Shah",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "Parth",
// //     handle: "aclite",
// //     userId: 5
// //   },{
// //     lastName: "Shah",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "Parth",
// //     handle: "whodat",
// //     userId: 6
// //   },{
// //     lastName: "Shah",
// //     photoURL: "https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah1-1470712275207.jpeg",
// //     firstName: "Parth",
// //     handle: "peter",
// //     userId: 7
// //   }
// // ]
//
// const localMembers = []
// function getSuggestionValue(suggestion) {
//    // when suggestion is selected, this function tells
//    // what should be the value of the input
//   return suggestion.userId
// }
//
// function renderSuggestion(member) {
//   return (
//     <div
//       onClick={(e) => {
//         ReactDOM.findDOMNode(this.refs.input).focus()
//         onSelectNewMember(member, e)
//       }}
//       className="dropdown-cell"
//       key={member.userId}
//     >
//         <Avatar size={30} avatarUrl={member.photoURL}/>
//         <div className="handle">{member.handle}</div>
//     </div>
//   )
// }
//
// class MemberAutoSuggest extends React.Component {
//
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       value: '',
//       suggestions: this.props.members
//     }
//   }
//
//   onChange(event, { newValue }) {
//     this.setState({
//       value: newValue
//     })
//   }
//
//   getSuggestions(value) {
//     const inputValue = value.trim().toLowerCase()
//     const inputLength = inputValue.length
//
//     return inputLength === 0 ? [] : this.props.members.filter(m =>
//       m.handle.toLowerCase().slice(0, inputLength) === inputValue
//     )
//   }
//
//   onSuggestionsUpdateRequested({ value }) {
//     this.setState({
//       suggestions: this.getSuggestions(value)
//     })
//   }
//
//   render() {
//     const { value, suggestions } = this.state
//     const inputProps = {
//       placeholder: 'username',
//       value,
//       onChange: this.onChange
//     }
//
//     return (
//       <Autosuggest
//         suggestions={suggestions}
//         onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
//         getSuggestionValue={getSuggestionValue}
//         renderSuggestion={renderSuggestion}
//         inputProps={inputProps} />
//     )
//   }
// }
//
// const mapStateToProps = ({members}) => {
//   return {
//     // members: _.values(members.members)
//     members: localMembers
//   }
// }
// const mapDispatchToProps = {}
//
//
// export default connect(mapStateToProps, mapDispatchToProps)(MemberAutoSuggest)
