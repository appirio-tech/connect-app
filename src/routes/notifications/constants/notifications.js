import {
  NOTIFICATION_TYPE,
  ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR,
  PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_OWNER, PROJECT_ROLE_MEMBER
} from '../../../config/constants'

const GOTO = {
  PROJECT_DASHBOARD: '/projects/[projectId]',
  PROJECT_SPECIFICATION: '/projects/[projectId]/specification',
  TOPIC: '/projects/[projectId]/#feed-[topicId]',
  POST: '/projects/[projectId]/#comment-[postId]',
  FILE_LIST: '/projects/[projectId]/specification#appDefinition-files'
}

export const NOTIFICATIONS = [
  // Outside project
  {
    eventType: 'notifications.connect.project.created',
    type: NOTIFICATION_TYPE.NEW_PROJECT,
    text: 'Your Project was created successfully',
    projectRoles: [PROJECT_ROLE_OWNER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.submittedForReview',
    type: NOTIFICATION_TYPE.REVIEW_PENDING,
    text: 'Your project is now in review',
    projectRoles: [PROJECT_ROLE_OWNER]
  },
  {
    eventType: 'notifications.connect.project.submittedForReview',
    type: NOTIFICATION_TYPE.REVIEW_PENDING,
    text: 'Project is available for review',
    topcoderRoles: [ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR],
    goTo: GOTO.PROJECT_SPECIFICATION
  },

  {
    eventType: 'notifications.connect.project.approved',
    type: NOTIFICATION_TYPE.UPDATES,
    text: 'Your project was approved, work would soon start',
    projectRoles: [PROJECT_ROLE_OWNER]
  },
  {
    eventType: 'notifications.connect.project.approved',
    type: NOTIFICATION_TYPE.UPDATES,
    text: 'Project is available for pickup',
    topcoderRoles: [ROLE_CONNECT_COPILOT, ROLE_ADMINISTRATOR],
    goTo: GOTO.PROJECT_DASHBOARD
  },
  {
    eventType: 'notifications.connect.project.approved',
    type: NOTIFICATION_TYPE.UPDATES,
    text: 'Project was approved',
    projectRoles: [PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.paused',
    type: NOTIFICATION_TYPE.REVIEW_PENDING,
    text: 'Your project was paused',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER],
    goTo: GOTO.PROJECT_DASHBOARD
  },
  {
    eventType: 'notifications.connect.project.paused',
    type: NOTIFICATION_TYPE.REVIEW_PENDING,
    text: 'A project was paused',
    topcoderRoles: [ROLE_ADMINISTRATOR],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.completed',
    type: NOTIFICATION_TYPE.UPDATES,
    text: 'Your project completed successfully!',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_MEMBER],
    goTo: GOTO.PROJECT_DASHBOARD
  },
  {
    eventType: 'notifications.connect.project.completed',
    type: NOTIFICATION_TYPE.UPDATES,
    text: 'A project was completed',
    topcoderRoles: [ROLE_ADMINISTRATOR],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.canceled',
    type: NOTIFICATION_TYPE.WARNING,
    text: 'Your project was canceled. If you think that was a mistake...',
    projectRoles: [PROJECT_ROLE_OWNER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  // User management
  {
    eventType: 'notifications.connect.project.member.joined',
    type: NOTIFICATION_TYPE.MEMBER_ADDED,
    text: 'A new team member joined your project',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.member.left',
    type: NOTIFICATION_TYPE.WARNING,
    text: '<strong>[userHandle]</strong> left a project',
    projectRoles: [PROJECT_ROLE_MANAGER]
  },

  {
    eventType: 'notifications.connect.project.member.removed',
    type: NOTIFICATION_TYPE.WARNING,
    text: '<strong>[userHandle]</strong> was removed from project',
    projectRoles: [PROJECT_ROLE_MANAGER]
  }, {
    eventType: 'notifications.connect.project.member.removed',
    type: NOTIFICATION_TYPE.WARNING,
    text: 'You were removed from a project',
    toUserHandle: true
  },

  {
    eventType: 'notifications.connect.project.member.assignedAsOwner',
    type: NOTIFICATION_TYPE.MEMBER_ADDED,
    text: 'You are now the owner of project',
    toUserHandle: true,
    goTo: GOTO.PROJECT_DASHBOARD
  }, {
    eventType: 'notifications.connect.project.member.assignedAsOwner',
    type: NOTIFICATION_TYPE.MEMBER_ADDED,
    text: 'Project owner was changed to <strong>[userHandle]</strong>',
    projectRoles: [PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.member.copilotJoined',
    type: NOTIFICATION_TYPE.MEMBER_ADDED,
    text: 'A copilot joined your project team',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.member.managerJoined',
    type: NOTIFICATION_TYPE.MEMBER_ADDED,
    text: 'A manager joined your project team',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.topic.created',
    type: NOTIFICATION_TYPE.NEW_POSTS,
    text: '<strong>[userHandle]</strong> created a new post ',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_MEMBER],
    goTo: GOTO.TOPIC
  },

  {
    eventType: 'notifications.connect.project.post.created',
    type: NOTIFICATION_TYPE.NEW_POSTS,
    text: '<strong>[userHandle]</strong> responded to your post',
    toTopicStarter: true,
    goTo: GOTO.POST
  }, {
    eventType: 'notifications.connect.project.post.created',
    type: NOTIFICATION_TYPE.NEW_POSTS,
    text: '<strong>[userHandle]</strong> responded to a post',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_MEMBER],
    goTo: GOTO.POST
  },

  {
    eventType: 'notifications.connect.project.linkCreated',
    type: NOTIFICATION_TYPE.NEW_POSTS,
    text: '<strong>[userHandle]</strong> added to your project',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_MEMBER],
    goTo: GOTO.PROJECT_DASHBOARD
  },

  {
    eventType: 'notifications.connect.project.fileUploaded',
    type: NOTIFICATION_TYPE.NEW_POSTS,
    text: '<strong>[userHandle]</strong> added a new file',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_MEMBER],
    goTo: GOTO.FILE_LIST
  },

  {
    eventType: 'notifications.connect.project.specificationModified',
    type: NOTIFICATION_TYPE.UPDATES,
    text: '<strong>[userHandle]</strong> updated the project specification',
    projectRoles: [PROJECT_ROLE_OWNER, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_MEMBER],
    goTo: GOTO.PROJECT_SPECIFICATION
  }
]
