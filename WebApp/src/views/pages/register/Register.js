import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Formik } from 'formik'
import { axios } from 'src/config'
import { asyncAction } from 'src/utils/js'
import { toast } from 'react-toastify'

const Register = () => {
  const validateEmail = (email) => {
    const res =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return res.test(String(email).toLowerCase())
  }
  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', repeatPassword: '' }}
      validate={(values) => {
        const errors = {}
        if (!values.username) {
          errors.username = 'Required'
        }
        if (!values.email) {
          errors.email = 'Required'
        }
        if (!values.password) {
          errors.password = 'Required'
        }
        if (!values.repeatPassword) {
          errors.repeatPassword = 'Required'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true)

        console.log(values)
        const [error, response] = await asyncAction(axios.post('users/register', values))

        if (values.password !== values.repeatPassword) {
          toast.error(`Passwords do not match!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })

          return setSubmitting(false)
        }

        if (validateEmail(values.email) === false) {
          toast.error(`You have entered an invalid email address!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })

          return setSubmitting(false)
        }

        if (error) {
          toast.error(`Username is already taken!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })

          return setSubmitting(false)
        }

        if (response && response.data) {
          toast.success(`Account successfully created!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          document.location.href = ''
          return setSubmitting(false)
        }
        setSubmitting(false)
      }}
    >
      {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={9} lg={7} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm>
                      <h1>Register</h1>
                      <p className="text-medium-emphasis">Create your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="username"
                          name="username"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.username}
                          placeholder="Username"
                          autoComplete="off"
                        />
                        {errors.username && <CInputGroupText>{errors.username}</CInputGroupText>}
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput
                          name="email"
                          type="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          placeholder="E-mail"
                          autoComplete="off"
                        />
                        {errors.email && <CInputGroupText>{errors.email}</CInputGroupText>}
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          name="password"
                          type="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          placeholder="Password"
                          autoComplete="off"
                        />
                        {errors.password && <CInputGroupText>{errors.password}</CInputGroupText>}
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          style={{ WebkitTextSecurity: 'disc' }}
                          name="repeatPassword"
                          type="repeatPassword"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.repeatPassword}
                          placeholder="Repeat Password"
                          autoComplete="off"
                        />
                        {errors.repeatPassword && (
                          <CInputGroupText>{errors.repeatPassword}</CInputGroupText>
                        )}
                      </CInputGroup>
                      <div className="d-grid">
                        <CButton color="success" disabled={isSubmitting} onClick={handleSubmit}>
                          Create Account
                        </CButton>
                      </div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )}
    </Formik>
  )
}

export default Register
