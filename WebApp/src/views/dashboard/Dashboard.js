import React, { useState, useEffect } from 'react'

import { axios, baseURL } from '../../config'

import { CButton } from '@coreui/react'

import { useHistory } from 'react-router-dom'

import { Input, Form, Select } from 'antd'

import { AppstoreAddOutlined } from '@ant-design/icons'

import AppContext from './app-context'

import DetailsCard from '../../components/card-details/index'

import { debounce } from 'lodash'

import { InputContainer, HeadlineToDisplay, ButtonWrapper, Content } from './style'

import { CFormInput } from '@coreui/react'

import moment from 'moment'

const { Option } = Select

const { Search } = Input

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const [certificateDetails, setCertificateDetails] = useState([])
  const history = useHistory()
  const [filteredCertificateDetails, setFilteredCertificateDetails] = useState([])

  useEffect(() => {
    axios
      .get('/certificates')
      .then(function (response) {
        // handle success
        setCertificateDetails(response.data)
        setFilteredCertificateDetails(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .then(function () {
        // always executed
      })
  }, [])

  const onFilter = (e) => {
    const value = e.target.value
    if (!value) {
      setFilteredCertificateDetails(certificateDetails)
      return
    }
    setFilteredCertificateDetails(
      certificateDetails.filter(({ fileName }) =>
        fileName.toLowerCase().startsWith(value.toLowerCase()),
      ),
    )
  }

  const debouncedFilter = debounce(onFilter, 250, { maxWait: 1000 })

  return (
    <div>
      <HeadlineToDisplay>
        <h1
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingLeft: '50px',
            fontSize: '30px',
          }}
        >
          My documents
        </h1>
      </HeadlineToDisplay>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonWrapper>
          <InputContainer>
            <div style={{ width: 520 }}>
              <CButton
                loading={loading}
                style={{
                  color: '#fff',
                  backgroundColor: '#3c4b64',
                  border: '#3c4b64',
                }}
                icon={<AppstoreAddOutlined />}
                htmlType="submit"
                className="login-form-button"
                onClick={() => {
                  history.push('/upload')
                }}
              >
                Add new document
              </CButton>
            </div>
            <div style={{ width: '508px' }}>
              <CFormInput placeholder="Search document" onChange={debouncedFilter} />
            </div>
          </InputContainer>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {filteredCertificateDetails.map((certificate, index) => {
              const {
                id,
                fileName,
                verifiedHash,
                fileSize,
                fileType,
                sourceUrl: srcUrl,
                createdAt,
                status,
              } = certificate

              const sourceUrl = `${baseURL}certificates/${srcUrl}`

              return (
                <DetailsCard
                  fileName={fileName.replace('.pdf', '')}
                  key={id}
                  description={'Created at:  ' + moment(createdAt).format('D/M/YYYY. hh:mm')}
                  fileType={fileType}
                  fileSize={fileSize + 'KB'}
                  digitalSignature={verifiedHash}
                  sourceUrl={sourceUrl}
                  status={status}
                  certificate={certificate}
                  id={id}
                />
              )
            })}
          </div>
        </ButtonWrapper>
      </div>
    </div>
  )
}

export default Dashboard
