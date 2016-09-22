import React, {PropTypes} from 'react'

const Join = ({isCopilot, owner, isShowJoin, onJoin, onJoinConfirm}) => {
  const onShowJoin = () => onJoin(true)
  const onClickCancel = () => onJoin(false)
  const onClickJoinConfirm = () => {
    onJoin(false)
    onJoinConfirm()
  }
  if (isShowJoin) {
    let msg
    if (owner)
      msg = `Once you join the project you’ll be responsible for carrying over all orders from ${owner.firstName} ${owner.lastName}.`
    else
      msg = 'Once you join the project you\'ll be responsible for the success of this project.'

    return (
      <div className="modal">
        <div className="modal-title center">
          You're about to join the project
        </div>
        <div className="modal-body">
          <p className="message center">
            { msg }
            {' '}
            Are you sure you want to join?
          </p>

          <div className="button-area">
            <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel"
              onClick={onClickCancel}
            >Cancel</button>
            {' '}
            <button
              className="tc-btn tc-btn-primary tc-btn-sm"
              onClick={onClickJoinConfirm}
            >Join</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="panel-body join-project">
        <div className="button-area">
          <button className="tc-btn tc-btn-primary tc-btn-md" onClick={onShowJoin}>
            {isCopilot ? 'Join as Copilot' : 'Join Project'}
          </button>
        </div>
      </div>
    </div>
  )
}

Join.propTypes = {
  isShowJoin: PropTypes.bool,
  onJoin: PropTypes.func.isRequired,
  onJoinConfirm: PropTypes.func.isRequired
}

export default Join
