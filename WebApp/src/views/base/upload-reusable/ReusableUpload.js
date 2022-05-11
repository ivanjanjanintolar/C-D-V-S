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

import { DocsCallout } from 'src/components'

import { CNav, CNavLink, CNavItem, CCallout, CLink } from '@coreui/react'

import styled from 'styled-components'

import { debounce } from 'lodash'

import { Input } from '@mui/material'

import { useRecoilState } from 'recoil'
import { activeTemplateIdStateAtom, templatesStateAtom } from 'src/components/AppSidebarNav'

const StyledCardHeader = styled(CardHeader)`
  border-radius: 12px;
`

const { Dragger } = Upload

export const VerticalGap = styled.div`
  height: ${(props) => props.gap || 0}px;
`

export const HorizontalGap = styled.div`
  width: ${(props) => props.gap || 0}px;
`

const ReusableUploadComponent = () => {
  const [fileList, _setFileList] = useState([])
  const [modalsData, _setModalsData] = useState([])
  const [activeTemplateId] = useRecoilState(activeTemplateIdStateAtom)
  const [templates, setTemplates] = useRecoilState(templatesStateAtom)
  const modalsDataRef = React.useRef(modalsData)
  const fileListRef = React.useRef(fileList)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [width, setWidth] = useState(45)
  const [height, setHeight] = useState(45)
  const scaledPdfHeight = React.useRef(null)
  const scaledPdfWidth = React.useRef(null)
  const [currentTemplateName, setCurrentTemplateName] = useState('')

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

  const setActiveTemplate = () => {
    templates.map((element, index) => {
      if (element.id === activeTemplateId) {
        console.log(element)
        console.log('elementx', element.x)
        console.log('elementy', element.y)
        console.log('elementwidth', element.width)
        console.log('elementheight', element.height)
        setX(element.x)
        setY(element.y)
        setWidth(+element.width)
        setHeight(+element.height)
        setCurrentTemplateName(element.name)
      }
    })
  }

  React.useEffect(() => {
    setActiveTemplate()
  }, [activeTemplateId])

  const _setWidth = async (value) => {
    setWidth(value)
    console.log('widthValue', value.replace('px', ''))
    const response = await axios.patch(`templates/update/${activeTemplateId}`, {
      width: value.replace('px', ''),
    })

    if (response && response.data) {
      setTemplates(
        templates.map((template) => (template.id === activeTemplateId ? response.data : template)),
      )
    }
  }

  const _setHeight = async (value) => {
    setHeight(value)
    const response = await axios.patch(`templates/update/${activeTemplateId}`, {
      height: value.replace('px', ''),
    })

    if (response && response.data) {
      setTemplates(
        templates.map((template) => (template.id === activeTemplateId ? response.data : template)),
      )
    }
  }

  const _setX = async (value) => {
    setX(value)
    const response = await axios.patch(`templates/update/${activeTemplateId}`, {
      x: +value,
    })

    if (response && response.data) {
      setTemplates(
        templates.map((template) => (template.id === activeTemplateId ? response.data : template)),
      )
    }
  }

  const _setY = async (value) => {
    console.warn(value)
    setY(value)
    const response = await axios.patch(`templates/update/${activeTemplateId}`, {
      y: +value,
    })

    if (response && response.data) {
      setTemplates(
        templates.map((template) => (template.id === activeTemplateId ? response.data : template)),
      )
    }
  }

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
            setX={_setX}
            y={y}
            setY={_setY}
            height={height}
            setHeight={_setHeight}
            width={width}
            setWidth={_setWidth}
            getPageSize={getPageSize}
          />
        ),
      )}
      <CRow>
        <CCol xs={12}>
          <CCallout color="info" className="bg-white">
            <div>
              This is your <b>{currentTemplateName}</b> template.
              <br />
              <br />
              It is designed to memorize QR Code for the same documents. If you are using it first
              time, resize and reposition your QR Code and it will be saved for every further use.
            </div>
          </CCallout>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
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

export default ReusableUploadComponent
