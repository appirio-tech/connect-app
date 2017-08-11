import React, {PropTypes} from 'react'
import './ActionCard.scss'
import Panel from '../Panel/Panel'
import cn from 'classnames'
import CommentEditToggle from './CommentEditToggle'
import RichTextArea from '../RichTextArea/RichTextArea'

const ActionCard = ({children, className}) => (
  <Panel className={cn('action-card', className)}>
    {children}
  </Panel>
)

ActionCard.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string
}

class Header extends React.Component{
  constructor(props) {
    super(props)
    this.state = {editTopicMode: false}
    this.onEditTopic = this.onEditTopic.bind(this)
    this.cancelEditTopic = this.cancelEditTopic.bind(this)
    this.onTopicChange = this.onTopicChange.bind(this)
    this.onSaveTopic = this.onSaveTopic.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({editTopicMode: nextProps.editTopicMode})
  }

  onEditTopic() {
    this.setState({editTopicMode: true})
    this.props.onEditTopic()
  }
  cancelEditTopic() {
    this.setState({editTopicMode: false})
    this.props.onTopicChange(this.props.topicMessage.id, null, null, false)
  }
  onTopicChange(title, content) {
    this.props.onTopicChange(this.props.topicMessage.id, title, content, true)
  }
  onSaveTopic({title, content}) {
    this.props.onSaveTopic(this.props.topicMessage.id, title, content)
  }

  render() {
    if (this.state.editTopicMode) {
      const { topicMessage } = this.props
      const title = this.props.newTitle === null || this.props.newTitle === undefined ? this.props.title : this.props.newTitle
      const content = topicMessage.newContent === null || topicMessage.newContent === undefined ? topicMessage.rawContent : topicMessage.newContent
      return (
        <RichTextArea
            editMode
            messageId={topicMessage.id}
            isGettingComment={topicMessage.isGettingComment}
            title={title}
            content={content}
            oldTitle={this.props.title}
            oldContent={topicMessage.rawContent}
            onPost={this.onSaveTopic}
            onPostChange={this.onTopicChange}
            isCreating={this.props.isSavingTopic}
            hasError={this.props.error}
            avatarUrl={this.props.avatarUrl}
            authorName={this.props.authorName}
            cancelEdit={this.cancelEditTopic}
        />
      )
    }

    return (
      <div className="panel-body">
        <div className="portrait">
          &nbsp;
        </div>
        <div className="object">
          <div className="card-header">
            <div className="card-title">
              <div>{this.props.title}</div>
              {this.props.self && (
                <CommentEditToggle
                  forTopic
                  hideDelete={this.props.hideDelete}
                  onEdit={this.onEditTopic}
                  onDelete={this.props.onDeleteTopic}
                />
              )}
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  onEditTopic: PropTypes.func.isRequired,
  onTopicChange: PropTypes.func.isRequired,
  onSaveTopic: PropTypes.func.isRequired,
  onDeleteTopic: PropTypes.func.isRequired,
  hideDelete: PropTypes.bool,
  self: PropTypes.bool,
  isSavingTopic: PropTypes.bool,
  error: PropTypes.bool
}

ActionCard.Header = Header

export default ActionCard
