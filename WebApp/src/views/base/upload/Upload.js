import React, { useState } from 'react'

import { Promise } from 'bluebird'

import { Form, Upload } from 'antd'

import { CButton } from '@coreui/react'

import { InboxOutlined } from '@ant-design/icons'

import { CardHeaderTitle, CardHeader, HeaderAction } from 'src/components/card/style'

import CIcon from '@coreui/icons-react'

import { cilXCircle } from '@coreui/icons'

import { generateFilesHashes, generateFileUrl } from '../../../utils/js/fileHelper'

import PdfViewer from '../../../components/pdf-viewer/index'

import { axios, baseURL } from '../../../config/index'

import { toast } from 'react-toastify'

import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { CLink, CCallout } from '@coreui/react'

import { templatesStateAtom } from 'src/components/AppSidebarNav'

import { useRecoilState } from 'recoil'

import styled from 'styled-components'

import { Input } from '@mui/material'

const StyledCardHeader = styled(CardHeader)`
  border-radius: 12px;
  background-color: #3c4b64;
`

const { Dragger } = Upload

export const VerticalGap = styled.div`
  height: ${(props) => props.gap || 0}px;
`

export const HorizontalGap = styled.div`
  width: ${(props) => props.gap || 0}px;
`

const TYPES = {
  ADD: 'ADD',
}

const StyledInput = styled.input`
  display: block;
  margin: 20px 0px;
  border: 1px solid lightblue;
  z-index: 9999999999;
`

const UploadComponent = () => {
  const [fileList, _setFileList] = useState([])
  const [modalsData, _setModalsData] = useState([])
  const [templates, setTemplates] = useRecoilState(templatesStateAtom)
  const modalsDataRef = React.useRef(modalsData)
  const fileListRef = React.useRef(fileList)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [width, setWidth] = useState(45)
  const [height, setHeight] = useState(45)
  const scaledPdfHeight = React.useRef(null)
  const scaledPdfWidth = React.useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')

  const openModal = () => {
    setShowModal(true)
  }

  const changeValue = (e) => {
    setNewTemplateName(e.target.value)
  }

  const getPageSize = (pageWidth, pageHeight) => {
    scaledPdfWidth.current = pageWidth
    scaledPdfHeight.current = pageHeight
  }

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

  const onConfirm = (key) => {
    setIsModalVisible(key, false)
  }

  const onReject = (key) => {
    setFileList(fileListRef.current.filter(({ uid }) => uid !== key))
    setIsModalVisible(key, false)
  }

  const uploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)

      setFileList(newFileList)
    },
    itemRender: (originNode, file, currFileList, actions) => (
      <>
        <div style={{ marginTop: '12px' }}>
          <StyledCardHeader>
            <CardHeaderTitle>{file.name.replace('.pdf', '')}</CardHeaderTitle>

            <HeaderAction
              onClick={() => {
                actions.remove()
              }}
            >
              <CIcon icon={cilXCircle} size="lg" />
            </HeaderAction>
          </StyledCardHeader>
        </div>
      </>
    ),
    beforeUpload: async (_, fs) => {
      setFileList([...fileList, ...fs])
      setModalsData(
        await Promise.map(fs, async (file, index) => ({
          fileUrl: await generateFileUrl(file),
          title: file.name,
          isModalVisible: true,
          setIsModalVisible,
          onReject,
          onConfirm,
          index,
          uid: file.uid,
        })),
      )
      return false
    },
    fileList,
  }

  const [loading, setLoading] = useState(false)

  const onCreateNewTemplate = async (templateName) => {
    const body = {
      name: templateName.toString(),
      x: '35',
      y: '110',
      height: '50',
      width: '50',
      scaledHeight: '0',
      scaledWidth: '0',
    }

    const response = await axios.post(`templates/create`, body)

    if (response && response.data) {
      setTemplates([...templates, response.data])
    }
  }

  const onFinish = async () => {
    try {
      if (fileList.length === 0) {
        toast.error(`At least one file should be uploaded!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        return
      }
      setLoading(true)

      const filesHashes = await generateFilesHashes(fileList)

      for (let { fileHash: digitalSignature, fileName, file } of filesHashes) {
        const bodyFormData = new FormData()
        bodyFormData.append('file', file)
        bodyFormData.append('fileHash', digitalSignature)
        bodyFormData.append('fileName', fileName)
        bodyFormData.append('description', '')
        bodyFormData.append('x', x)
        bodyFormData.append('y', y)
        bodyFormData.append('height', height.toString().replace('px', ''))
        bodyFormData.append('width', width.toString().replace('px', ''))
        bodyFormData.append('scaledPdfHeight', scaledPdfHeight.current)
        bodyFormData.append('scaledPdfWidth', scaledPdfWidth.current)
        bodyFormData.append('qrCodeText', `${baseURL.replace('api-v3/', '')}#/certificate-preview`)

        await axios.post(`certificates/upload`, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.success(`File added to your list!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
      setFileList([])

      setLoading(false)
    } catch (error) {
      toast.error(`Something went wrong, please try again!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    const response = await axios.get('templates')

    if (response && response.data) {
      setTemplates(response.data)
    }
  }

  React.useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <>
      {modalsData.map(
        (
          { fileUrl, title, isModalVisible, setIsModalVisible, uid, onReject, onConfirm },
          index,
        ) => (
          <PdfViewer
            title={title}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            fileUrl={fileUrl}
            key={index}
            uid={uid}
            onReject={onReject}
            onConfirm={onConfirm}
            isConfirmable
            showRnd
            x={x}
            setX={setX}
            y={y}
            setY={setY}
            height={height}
            setHeight={setHeight}
            width={width}
            setWidth={setWidth}
            getPageSize={getPageSize}
          />
        ),
      )}
      <CRow>
        <CCol xs={12}>
          <CCallout color="info" className="bg-white">
            This is <b>Default template</b> page which will use default QR Code position and size
            every time.
            <br />
            <br />
            In case you have series of same documents you can create a template by clicking here :
            <CLink onClick={openModal}>Create a template</CLink>.
          </CCallout>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCard className="mb-4">
              {showModal && (
                <CCardHeader>
                  {showModal ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <HorizontalGap gap={12} />
                      <div>
                        <Input
                          style={{ width: '250px' }}
                          setShowModal={setShowModal}
                          onChange={changeValue}
                          placeholder="Enter template name"
                          color="primary"
                        />{' '}
                      </div>
                      <HorizontalGap gap={12} />
                      <div>
                        <CButton
                          style={{ color: '#fff', backgroundColor: '#3c4b64', border: '#3c4b64' }}
                          onClick={() => {
                            if (newTemplateName === '') {
                              return
                            } else {
                              onCreateNewTemplate(newTemplateName)
                              setShowModal(false)
                            }
                          }}
                        >
                          Add template
                        </CButton>
                      </div>
                      <HorizontalGap gap={2} />
                      <div>
                        <CButton
                          color="danger"
                          style={{
                            color: '#fff',
                          }}
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </CButton>
                      </div>
                    </div>
                  ) : null}
                </CCardHeader>
              )}
            </CCard>
            <CCardBody>
              <div
                className="site-layout-background"
                style={{
                  padding: 48,
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Form onFinish={onFinish} name="control-hooks">
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
                  <CButton
                    loading={loading}
                    style={{
                      width: '100%',
                      color: '#fff',
                      backgroundColor: '#3c4b64',
                      border: '#3c4b64',
                    }}
                    onClick={onFinish}
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Upload
                  </CButton>
                </Form>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default UploadComponent
