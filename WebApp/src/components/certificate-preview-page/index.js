/* eslint-disable react/prop-types */
import React from 'react'
import { baseURL, axios } from 'src/config'
import CertificatePDFPreview from '../certificate-pdf-preview/index'
import { web3, COTRUGLIContract } from '../../utils/web3/web3Helper'
import { toast } from 'react-toastify'
import { verifyDiploma } from 'src/utils/functions/read-only/VerifyDiploma'
import { Layout, Spin } from 'antd'

export default function PreviewCertificatePage({ match }) {
  const [certificate, setCertificate] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isModalVisible, _setIsModalVisible] = React.useState(true)

  const setIsModalVisible = (key, visible) => {
    _setIsModalVisible(visible)
  }

  const { fileHash } = match.params

  React.useEffect(() => {
    setLoading(true)
    try {
      axios
        .get(`/certificates/preview/${fileHash}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(async function (response) {
          // handle success
          if (response.data) {
            setCertificate(response.data)

            console.log(response.data)

            const verifyDiplomaHex = await verifyDiploma(response.data.verifiedHash)

            const receipt = await web3.tolar.tryCallTransaction(
              '54d0b0bc6cbbd54d0ec605cbf87819763445e70ef24fc85c20',
              COTRUGLIContract,
              0,
              600000,
              1,
              verifyDiplomaHex,
              await web3.tolar.getNonce('54d0b0bc6cbbd54d0ec605cbf87819763445e70ef24fc85c20'),
            )

            const { 0: _confirmed } = web3.eth.abi.decodeParameters(['bool'], receipt.output)

            console.log(receipt.output)

            if (_confirmed === false) {
              toast.error(`This certificate is not valid!`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            } else {
              toast.success(`This certificate has been validated on the blockchain!`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
            setLoading(false)
          }
        })
        .catch(function (error) {
          toast.error(`This certificate is not valid!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          setLoading(false)
          setError(error)
          console.log(error)
        })
        .then(function () {})
    } catch (err) {
      console.log(err)
    }
  }, [])

  if (loading) {
    return (
      <Layout>
        <Spin />
      </Layout>
    )
  }
  if (!certificate) {
    return null
  }

  return (
    <CertificatePDFPreview
      fileUrl={`${baseURL}/certificates/` + certificate.sourceUrl}
      certificate={certificate}
    />
  )
}
