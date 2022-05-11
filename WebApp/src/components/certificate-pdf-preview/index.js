/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Button, SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core'
import moment from 'moment'

import '@react-pdf-viewer/core/lib/styles/index.css'

export default function CertificatePDFPreview({ fileUrl, certificate }) {
  const modalBody = () => (
    <div
      style={{
        backgroundColor: '#fff',
        flexDirection: 'column',
        overflow: 'hidden',

        /* Fixed position */
        left: 0,
        position: 'fixed',
        top: 0,

        /* Take full size */
        height: '100%',
        width: '100%',
        overflowY: 'scroll',

        /* Displayed on top of other elements */
        zIndex: 9,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          padding: '.5rem',
        }}
      >
        <div style={{ marginRight: 'auto' }}>
          {(certificate.fileName || '').replace('.pdf', '')}
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          overflow: 'auto',
          padding: 24,
        }}
      >
        <Viewer fileUrl={fileUrl} />
      </div>

      <div
        style={{
          display: 'flex',
          padding: 17,
          flexDirection: 'column',
          overflowX: 'scroll',
        }}
      >
        <div style={{ height: 12 }}></div>
        <div style={{ fontSize: 10 }}>
          <div>
            <b>Name :</b> {certificate.fileName.replace('.pdf', '') || ''}
          </div>
          <div>
            <b>DigitalSignature :</b> {certificate.verifiedHash || ''}
          </div>
          <div>
            <b>Transaction Hash :</b> {certificate.description || ''}
          </div>
          <div>
            <b>Timestamp :</b>{' '}
            {moment(certificate.blockchainUploadDate).format('D/M/YYYY. hh:mm') || ''}
          </div>
          <br />
          <div>
            <Button
              style={{ border: '0.1px solid blue' }}
              onClick={() => {
                window.open(fileUrl, 'PRINT', 'height=400,width=600')
              }}
            >
              Print PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modalBody(), document.body)
}
