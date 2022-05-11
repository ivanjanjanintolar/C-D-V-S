import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://cotrugli.org" target="_blank" rel="noopener noreferrer">
          COTRUGLI
        </a>
        <span className="ms-1">&copy; 2021 COTRUGLI Business School.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://tolar.io" target="_blank" rel="noopener noreferrer">
          HashNET
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
