/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'

import Card from '../card/index'

import { CButton } from '@coreui/react'

import { AppstoreAddOutlined, LockOutlined, FilePdfOutlined } from '@ant-design/icons'

import { BoldText, Column, Line, Text, FlexRow, CardDetailsContainer } from './style'

import { toast } from 'react-toastify'

import { tolar, COTRUGLIContract } from '../../utils/web3/web3Helper'

import { getBase64FromUrl } from '../../utils/js/fileHelper'

import PdfViewer from '../pdf-viewer/index'

import { axios } from 'src/config'

import moment from 'moment'

import promiseRetry from 'promise-retry'

import { SpecialZoomLevel } from '@react-pdf-viewer/core'

import { startSignatures } from 'src/utils/functions/state-changing/StartSignatures'

const DetailsCard = ({
  fileName,
  description,
  fileSize,
  fileType,
  digitalSignature,
  sourceUrl,
  status: initialStatus,
  id,
  certificate,
}) => {
  const [isModalVisible, _setIsModalVisible] = useState(false)
  const [sourceUri, setSourceUri] = useState(sourceUrl)
  const [status, setStatus] = useState(initialStatus)
  const [connectedAccount, setConnectedAccount] = useState(null)

  const detectWeb3 = async () => {
    if (typeof window.tolar !== 'undefined') {
      // enable portal to taquin (window.tolar.enable();)
      window.tolar.enable().then(async function () {
        const accounts = await window.tolar.request({
          method: 'eth_requestAccounts',
        })
        const [account] = accounts
        setConnectedAccount(account)
      })
    } else {
      window.addEventListener('load', function () {
        // do things after the DOM loads fully
        alert('Install Taquin wallet to interact with TolarSwap')
      })
    }
  }

  const setIsModalVisible = (uid, opened) => {
    _setIsModalVisible(opened)
  }

  const onOpenPdf = async () => {
    _setIsModalVisible(true)
    const temp = await getBase64FromUrl(sourceUrl)
    setSourceUri(temp)
  }

  const ref = React.createRef()

  const onAddToBlockchain = async () => {
    const startSignaturesHex = await startSignatures(digitalSignature)

    if (!connectedAccount) {
      toast.info(`Connect your Taquin wallet to interact with blockchain!`, {
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

    window.tolar
      .request({
        method: 'taq_sendTransaction',
        params: [
          {
            sender_address: connectedAccount,
            receiver_address: COTRUGLIContract,
            amount: '0',
            gas: 500000,
            gas_price: 1,
            data: startSignaturesHex,
          },
        ],
      })
      .then((result) => {
        const toastId = toast.loading('Transaction pending...')
        console.log('SENT PURCHASE')
        try {
          promiseRetry(function (retry, number) {
            const transactionDetails = tolar.getTransaction(result.txHash).catch(retry)
            return transactionDetails
          }).then(
            async function (value) {
              if (value.excepted) {
                toast.update(toastId, {
                  render: `Transaction failed`,
                  type: 'error',
                  autoClose: 5000,
                  isLoading: false,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
              } else {
                const { data } = await axios.patch(`certificates/${id}`, {
                  status: 'ADDED_TO_BLOCKCHAIN',
                  blockchainUploadDate: moment().toISOString(),
                  description: `${value.transaction_hash}`,
                })

                setStatus(data.status)

                toast.update(toastId, {
                  render: `You have deployed ${fileName} certificate to the blockchain!
                                TransactionHash : ${value.transaction_hash}`,
                  type: 'success',
                  isLoading: false,
                  autoClose: 5000,
                })
              }
            },
            function (err) {
              toast.update(id, {
                render: `Transaction failed!`,
                type: 'error',
                autoClose: 5000,
                isLoading: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            },
          )
        } catch (e) {
          console.log('ketcham')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    detectWeb3()
  }, [])

  return (
    <>
      <PdfViewer
        title={fileName}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        fileUrl={sourceUri}
        key={digitalSignature}
        uid={digitalSignature}
        isConfirmable={false}
        renderRight={
          <div style={{ fontSize: '15px', marginLeft: 24 }} ref={ref}>
            <div>
              {' '}
              <b>Name :</b> {(fileName || '').replace('.pdf', '')}{' '}
            </div>
            <div>
              {' '}
              <b>DigitalSignature :</b> {digitalSignature || ''}{' '}
            </div>
            <div>
              {' '}
              <b>Transaction Hash :</b> {certificate.description || ''}{' '}
            </div>
            <div>
              {' '}
              <b>Timestamp :</b>{' '}
              {moment(certificate.blockchainUploadDate).format('D/M/YYYY. hh:mm') || ''}{' '}
            </div>
            <br />
            <div>
              <CButton
                style={{ border: '0.1px solid blue' }}
                onClick={() => {
                  window.open(sourceUrl, 'PRINT', 'height=600,width=800')
                }}
              >
                Print PDF!
              </CButton>
            </div>
          </div>
        }
      ></PdfViewer>
      <CardDetailsContainer>
        <Card
          title={fileName}
          subTitle={description}
          leftFooterAction={
            <CButton
              size="middle"
              onClick={onAddToBlockchain}
              disabled={status === 'ADDED_TO_BLOCKCHAIN'}
              //color={status === 'ADDED_TO_BLOCKCHAIN' ? 'success' : '#3c4b64'}
              style={{
                width: '100%',
                color: '#fff',
                backgroundColor: status === 'ADDED_TO_BLOCKCHAIN' ? '#2eb85c' : '#3c4b64',
                border: status === 'ADDED_TO_BLOCKCHAIN' ? '#2eb85c' : '#3c4b64',
              }}
              icon={<AppstoreAddOutlined />}
              className="login-form-button"
            >
              {status === 'ADDED_TO_BLOCKCHAIN' ? 'Registered' : 'Add to blockchain!'}
            </CButton>
          }
          rightFooterAction={
            <CButton
              size="middle"
              style={{
                width: '100%',
                color: '#fff',
                backgroundColor: '#3c4b64',
                border: '#3c4b64',
              }}
              icon={<AppstoreAddOutlined />}
              htmlType="submit"
              className="login-form-button"
              onClick={onOpenPdf}
            >
              View
            </CButton>
          }
        >
          <FlexRow>
            <AppstoreAddOutlined />
            <Column>
              <Text>File size</Text>
              <BoldText>{fileSize}</BoldText>
            </Column>
            <FilePdfOutlined />
            <Column>
              <Text>File Type</Text>
              <BoldText>{fileType}</BoldText>
            </Column>
          </FlexRow>
          <Line></Line>
          <FlexRow>
            <LockOutlined />
            <Column>
              <Text>Document Digital Signature</Text>
              <BoldText>{digitalSignature}</BoldText>
            </Column>
          </FlexRow>
        </Card>
      </CardDetailsContainer>
    </>
  )
}

DetailsCard.defaultProps = {
  fileName: 'This is the file name.pdf',
  description: 'Created on 07/20/2121 by Admin',
  fileSize: '5MB',
  fileType: 'Adobe PDF Document',
  digitalSignature: '5dsa4d5sa1d3sd1w584f1fdgfdhfd',
  status: 'CREATED',
}

export default DetailsCard
