import React from 'react'
import { CContainer, CRow, CSpinner } from '@coreui/react'

const LoadingOverlay = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CSpinner />
        </CRow>
      </CContainer>
    </div>
  )
}

export default LoadingOverlay
