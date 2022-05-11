/* eslint-disable react/prop-types */
import '@react-pdf-viewer/core/lib/styles/index.css'

import React, { useState } from 'react'

import styled from 'styled-components'

import { CButton } from '@coreui/react'

import useMediaQuery from '../../hooks/media/index'

import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core'

import { CloseCircleOutlined } from '@ant-design/icons'

import { Rnd } from 'react-rnd'

import { QrcodeOutlined } from '@ant-design/icons'

import { Portal } from 'react-portal'

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'

const ModelOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #bababa;
  z-index: 99;
  opacity: 0.4;
`

const ModelCard = styled.div`
  margin: 50px;
  display: flex;
  background-color: #ffff;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  box-shadow: rgba(39, 55, 96, 0.1) 0px 4px 16px 0px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 10px;
  padding-bottom: 12px;
  flex-direction: column;
`

const ModelContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999999;
`

const PdfView = styled(Viewer)`
  width: 100%;
  height: 100%;
`

const CloseIconButton = styled(CloseCircleOutlined)`
    font-size 25px;
    &:hover {
        opacity: 0.3;
      }
`

const Header = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
`

const HeaderLeft = styled.div`
  flex: 1;
`

const HeaderCenter = styled.div`
  flex: 2;
  text-align: center;
  align-items: center;
`

const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const CloseIconWrapper = styled.div`
  height: 54px;
  width: 50px;
`

const Footer = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
`

const FooterLeft = styled.div`
  flex: 9;
`

const FooterRight = styled.div`
  flex: 4;
  justify-content: center;
  align-items: center;
  display: flex;
`

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px black',
  zIndex: 9999,
  backgroundColor: 'black',
  opacity: '0.7',
  color: 'white',
}

export default function PdfViewer({
  title,
  isModalVisible,
  setIsModalVisible,
  fileUrl,
  uid,
  onConfirm,
  onReject,
  isConfirmable,
  children,
  id,
  renderRight,
  showRnd,
  x,
  y,
  width,
  height,
  setX,
  setY,
  setHeight,
  setWidth,
  getPageSize,
}) {
  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    isModalVisible && (
      <Portal>
        <ModelContent>
          <ModelCard>
            <Header>
              <HeaderLeft />
              <HeaderCenter>
                <h1 style={{ fontSize: isMobile ? '23px' : '28px' }}>{title}</h1>
              </HeaderCenter>
              <HeaderRight>
                <CloseIconWrapper onClick={() => setIsModalVisible(uid, false)}>
                  <CloseIconButton />
                </CloseIconWrapper>
              </HeaderRight>
            </Header>
            <div
              style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '70vw',
              }}
            >
              <div
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  width: '40vw',
                  height: '69vh',
                }}
              >
                <PdfView
                  fileUrl={fileUrl}
                  renderPage={(props) => {
                    console.log(props.width, props.height)
                    getPageSize && getPageSize(props.width, props.height)
                    return (
                      <>
                        {showRnd && (
                          <Rnd
                            style={style}
                            size={{ width: width, height: height }}
                            position={{ x: x, y: y }}
                            onDragStop={(e, d) => {
                              setX(d.x)
                              setY(d.y)
                            }}
                            lockAspectRatio
                            onResizeStop={(e, direction, ref, delta, position) => {
                              setWidth(ref.style.width)
                              setHeight(ref.style.height)
                              setX(position.x)
                              setY(position.y)
                            }}
                          >
                            {<QrcodeOutlined />}
                          </Rnd>
                        )}
                        {props.svgLayer.children}
                        {props.textLayer.children}
                        {props.annotationLayer.children}
                      </>
                    )
                  }}
                />
              </div>
              <div style={{ flex: 1, padding: 24 }}>{(showRnd && <div></div>) || renderRight}</div>
            </div>
            {children}
            {isConfirmable && (
              <>
                <Footer>
                  <FooterLeft />
                  <FooterRight>
                    <CButton
                      color="danger"
                      style={{
                        width: '100%',
                        color: '#fff',
                      }}
                      onClick={() => onReject(uid)}
                    >
                      Reject
                    </CButton>
                    <div style={{ width: '12px' }}></div>
                    <CButton
                      style={{
                        width: '100%',
                      }}
                      onClick={() => onConfirm(uid)}
                    >
                      Confirm
                    </CButton>
                  </FooterRight>
                </Footer>
              </>
            )}
          </ModelCard>
        </ModelContent>
        <ModelOverlay />
      </Portal>
    )
  )
}
