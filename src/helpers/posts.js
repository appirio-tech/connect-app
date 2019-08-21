import {extractHtmlLink, extractMarkdownLink, extractRawLink} from './links'

/**
 * Formats the original file name
 * @param originalFileName original file name
 * @returns {string}
 */
function getFileAttachmentName(originalFileName) {
  return /^.*.\/[^_]+_(.*.)$/.exec(originalFileName)[1]
}

/**
 * Extracts attachments from posts
 * @param feeds
 * @returns {Array}
 */
export function extractAttachmentLinksFromPosts(feeds) {
  const attachmentLinks = []
  feeds.forEach(feed => {
    const attachmentLinksPerFeed = []
    feed.posts.forEach(post => {
      post.attachments.forEach(attachment => {
        attachmentLinksPerFeed.unshift({
          title: getFileAttachmentName(attachment.originalFileName),
          address: `/projects/messages/attachments/${attachment.id}`,
          attachmentId: attachment.id,
          attachment: true,
          deletable: true,
          createdBy: attachment.createdBy,
          postId: post.id,
          topicId: feed.id,
          topicTag: feed.tag,
          updatedAt: feed.updatedDate
        })
      })
    })

    if (attachmentLinksPerFeed.length > 0) {
      attachmentLinks.push({
        title: feed.title,
        children: attachmentLinksPerFeed
      })
    }
  })

  return attachmentLinks
}

/**
 * Extracts links from posts
 * @param feeds feeds
 * @returns {Array}
 */
export function extractLinksFromPosts(feeds) {
  const links = []
  feeds.forEach(feed => {
    let childrenLinks = []
    feed.posts.forEach(post => {
      childrenLinks = childrenLinks.concat([
        ...extractHtmlLink(post.rawContent),
        ...extractMarkdownLink(post.rawContent),
        ...extractRawLink(post.rawContent)
      ])
    })

    if (childrenLinks.length > 0) {
      links.push({
        title: feed.title,
        children: childrenLinks
      })
    }
  })

  return links
}
