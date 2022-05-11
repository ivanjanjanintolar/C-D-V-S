/* eslint-disable react/prop-types */
import React from 'react'
import LoadingOverlay from './components/loading-overlay'
import { useAuth } from './hooks/auth'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Worker } from '@react-pdf-viewer/core'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/antd.css'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const PreviewCertificatePage = React.lazy(() =>
  import('./components/certificate-preview-page/index'),
)

// eslint-disable-next-line react/prop-types
function PrivateRoute({ render, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed ? (
          render(props)
        ) : (
          // eslint-disable-next-line react/prop-types
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

function App() {
  const [authState] = useAuth()

  if (authState.isLoading) {
    return <LoadingOverlay />
  }

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
        <ToastContainer style={{ marginTop: 60, flex: 1, minWidth: 560 }} />
        <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/register"
                name="Register Page"
                render={(props) => <Register {...props} />}
              />
              <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
              <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
              <Route
                exact
                path="/certificate-preview/:fileHash"
                name="Certificate Preview"
                render={(props) => <PreviewCertificatePage {...props} />}
              />
              <PrivateRoute
                authed={authState.isLoggedIn}
                path="/"
                name="Home"
                render={(props) => <DefaultLayout {...props} />}
              />
            </Switch>
          </React.Suspense>
        </HashRouter>
      </Worker>
    </>
  )
}

export default App
