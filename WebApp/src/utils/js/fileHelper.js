import { Promise } from 'bluebird'

export const generateFileHash = async (file) => {
  const fileReader = new FileReader()

  return new Promise((resolve, reject) => {
    fileReader.onload = function (e) {
      window.crypto.subtle
        .digest({ name: 'SHA-1' }, e.target.result)
        .then(function (hash) {
          var hexString = ''
          var hashResult = new Uint8Array(hash)

          for (var i = 0; i < hashResult.length; i++) {
            hexString += ('00' + hashResult[i].toString(16)).slice(-2)
          }

          resolve({ fileHash: hexString, fileName: file.name, file })
        })
        .catch(function (error) {
          console.error(error)
          reject(error)
        })
    }

    fileReader.readAsArrayBuffer(file)
  })
}

export const generateFilesHashes = async (files) => {
  return Promise.map(files, (file) => generateFileHash(file))
}

export const generateFileUrl = async (file) => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      // Use reader.result
      resolve(reader.result)
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsDataURL(file)
  })
}

export const getBase64FromUrl = async (url) => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data)
    }
  })
}
