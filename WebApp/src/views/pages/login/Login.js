import React from 'react'
import { Link } from 'react-router-dom'
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
import { cilLockLocked, cilUser } from '@coreui/icons'
import { axios } from 'src/config'
import { Formik } from 'formik'
import { authStateAtom } from 'src/hooks/auth'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { asyncAction } from 'src/utils/js'

const Login = () => {
  const [authState, setAuthState] = useRecoilState(authStateAtom)

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validate={(values) => {
        const errors = {}
        if (!values.username) {
          errors.username = 'Required'
        }
        if (!values.password) {
          errors.password = 'Required'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true)

        const [error, response] = await asyncAction(axios.post('auth/login', values))

        if (error) {
          toast.error(`Wrong username or password!`, {
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
          const { accessToken } = response.data ?? {}

          localStorage.setItem('token-cotrugli', accessToken)

          setAuthState({ ...authState, accessToken, isLoggedIn: true })

          document.location.href = ''
        }
        setSubmitting(false)
      }}
    >
      {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={8}>
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                      <CForm>
                        <h1>Login</h1>
                        <p className="text-medium-emphasis">Sign In to your account</p>
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
                        <CInputGroup className="mb-4">
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
                        <CRow>
                          <CCol xs={6}>
                            <CButton
                              className="px-4"
                              disabled={isSubmitting}
                              onClick={handleSubmit}
                            >
                              Login
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <CButton color="link" className="px-0">
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                  <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                    <CCardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>
                          In case you still do not have an active account, go ahead and register!
                        </p>
                        <Link to="/register">
                          <CButton color="primary" className="mt-3" active tabIndex={-1}>
                            Register Now!
                          </CButton>
                        </Link>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )}
    </Formik>
  )
}

export default Login
