import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { tolar, COTRUGLIContract } from 'src/utils/web3/web3Helper'
import { approveAddress } from 'src/utils/functions/state-changing/ApproveAddress'
import { removeApprovedAddress } from 'src/utils/functions/state-changing/RemoveApprovedAddress'
import promiseRetry from 'promise-retry'

const Permissions = () => {
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

  const onApproveAddress = async (address) => {
    const approveAddressHex = await approveAddress(address)

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
            data: approveAddressHex,
          },
        ],
      })
      .then((result) => {
        const toastId = toast.loading('Transaction pending...')
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
                toast.update(toastId, {
                  render: `You have successfully granted permissions for targeted address!`,
                  type: 'success',
                  isLoading: false,
                  autoClose: 5000,
                })
              }
            },
            function (err) {
              toast.update(toastId, {
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

  const onRemoveApprovedAddress = async (address) => {
    const removeApprovedAddressHex = await removeApprovedAddress(address)

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
            data: removeApprovedAddressHex,
          },
        ],
      })
      .then((result) => {
        const toastId = toast.loading('Transaction pending...')
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
                toast.update(toastId, {
                  render: `You have successfully removed permissions for targeted address!`,
                  type: 'success',
                  isLoading: false,
                  autoClose: 5000,
                })
              }
            },
            function (err) {
              toast.update(toastId, {
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
      <Formik initialValues={{ address: '' }}>
        {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
              <CRow className="justify-content-center">
                <CCol md={8}>
                  <CCardGroup>
                    <CCard className="p-4">
                      <CCardBody>
                        <CForm>
                          <h1>Permissions</h1>
                          <p className="text-medium-emphasis">
                            Give or remove permissions for address
                          </p>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              type="address"
                              name="address"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.address}
                              placeholder="Input address"
                              autoComplete="off"
                            />
                          </CInputGroup>
                          <CRow>
                            <CCol xs={6}>
                              <CButton
                                className="px-4"
                                disabled={isSubmitting}
                                onClick={() => {
                                  console.log(approveAddress(values.address))
                                }}
                              >
                                Give permissions
                              </CButton>
                            </CCol>
                            <CCol xs={6}>
                              <CButton
                                className="px-4"
                                disabled={isSubmitting}
                                onClick={() => {
                                  console.log(removeApprovedAddress(values.address))
                                }}
                                color="danger"
                                style={{ color: 'white' }}
                              >
                                Remove permissions
                              </CButton>
                            </CCol>
                          </CRow>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CCardGroup>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        )}
      </Formik>
    </>
  )
}

export default Permissions
