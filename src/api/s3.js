/**
 * Amazon S3 Service API
 */

/**
 * Upload file to S3 using pre-signed URL
 * 
 * @param {String} preSignedURL pre-signed URL
 * @param {File}   file         file to upload
 * 
 * @returns {Promise<String>}   pre-signed URL
 */
export const uploadFileToS3 = (preSignedURL, file) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('PUT', preSignedURL, true)
    xhr.setRequestHeader('Content-Type', file.type)

    xhr.onreadystatechange = () => {
      const { status } = xhr
      if (((status >= 200 && status < 300) || status === 304) && xhr.readyState === 4) {
        resolve(preSignedURL)
      } else if (status >= 400) {
        const err = new Error('Could not upload image')
        err.status = status
        reject(err)
      }
    }
    xhr.onerror = (err) => {
      reject(err)
    }
    xhr.send(file)
  })
}