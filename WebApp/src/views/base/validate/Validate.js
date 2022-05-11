import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { DocsCallout } from 'src/components'

import { InboxOutlined } from '@ant-design/icons'

import { Upload } from 'antd'

import { COTRUGLIContract, web3 } from '../../../utils/web3/web3Helper'

import { generateFileHash, generateFileUrl } from '../../../utils/js/fileHelper'

import PdfViewer from '../../../components/pdf-viewer/index'

import { Promise } from 'bluebird'

import { toast } from 'react-toastify'

import { axios } from 'src/config'

import moment from 'moment'

import { verifyDiploma } from 'src/utils/functions/read-only/VerifyDiploma'

const { Dragger } = Upload

const Validate = () => {
  const [fileList, _setFileList] = useState([])

  const [modalsData, _setModalsData] = useState([])

  const modalsDataRef = React.useRef(modalsData)

  const fileListRef = React.useRef(fileList)

  const setModalsData = (data) => {
    modalsDataRef.current = data
    _setModalsData(data)
  }

  const setFileList = (data) => {
    fileListRef.current = data
    _setFileList(data)
  }

  const setIsModalVisible = (key, visible) => {
    setModalsData([
      ...modalsDataRef.current.map((modalData) =>
        modalData.uid === key ? { ...modalData, isModalVisible: visible } : modalData,
      ),
    ])
  }

  const uploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)

      setFileList(newFileList)
    },
    beforeUpload: async (file, fs) => {
      setFileList([...fileList, ...fs])

      setModalsData(
        await Promise.map(fs, async (file) => ({
          fileUrl: await generateFileUrl(file),
          title: file.name,
          isModalVisible: true,
          setIsModalVisible,
          uid: file.uid,
        })),
      )

      const { fileHash } = await generateFileHash(file)

      console.log('fileHash', fileHash)

      const verifyDiplomaHex = await verifyDiploma(fileHash)

      const receipt = await web3.tolar.tryCallTransaction(
        '54000000000000000000000000000000000000000023199e2b',
        COTRUGLIContract,
        0,
        600000,
        1,
        verifyDiplomaHex,
        await web3.tolar.getNonce('54000000000000000000000000000000000000000023199e2b'),
      )

      //if details need to be fetched

      const { 0: _confirmed } = web3.eth.abi.decodeParameters(['bool'], receipt.output)

      console.log('hey!!!')

      console.log('details', _confirmed)

      if (_confirmed === false) {
        toast.error(`This certificate is invalid!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } else {
        const { data } = await axios.get(`certificates`)

        const certificates = data.filter((x) => x.verifiedHash === fileHash)
        toast.success(
          <div>
            <div>This certificate has been validated on the blockchain!</div>
            <div>
              <b>Name : </b> {file.name.replace('.pdf', '')}
            </div>
            <div>
              {' '}
              <b>Digital Signature :</b> {certificates[0]?.verifiedHash || ''}
            </div>
            <div>
              <b>Transaction Hash :</b> {certificates[0]?.description || ''}!
            </div>
            <div>
              <b>Timestamp : </b>
              {moment(certificates[0]?.blockchainUploadDate).format('D/M/YYYY. hh:mm')}
            </div>
          </div>,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        )
      }
    },
    fileList,
  }
  return (
    <>
      {modalsData.map(
        ({ fileUrl, title, isModalVisible, setIsModalVisible, uid, onReject, onConfirm }) => (
          <PdfViewer
            title={title}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            fileUrl={fileUrl}
            key={uid}
            uid={uid}
            onReject={onReject}
            onConfirm={onConfirm}
            isConfirmable={false}
          />
        ),
      )}
      <CRow>
        <CCol xs={12}>
          <DocsCallout name="Validate" href="components/breadcrumb" />
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Validate documents</strong>
            </CCardHeader>
            <CCardBody>
              <div
                className="site-layout-background"
                style={{
                  padding: 48,
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Dragger
                  {...uploadProps}
                  style={{
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid #bababa',
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint" style={{ padding: '12px' }}>
                    Support for a single or bulk upload. Strictly prohibit from uploading company
                    data or other band files
                  </p>
                </Dragger>
                <br />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Validate
