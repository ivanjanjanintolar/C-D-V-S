/* eslint-disable react/prop-types */

import CIcon from '@coreui/icons-react'

import React from 'react'
import {
  CardContainer,
  CardHeader,
  CardHeaderTitle,
  CardHeaderSubTitle,
  CardBody,
  CardFooter,
  LeftFooterActionContainer,
  MiddleFooterActionContainer,
  RightFooterActionContainer,
  HeaderAction,
} from './style'

import { cilXCircle } from '@coreui/icons'

export const Card = ({
  title,
  subTitle,
  leftFooterAction,
  rightFooterAction,
  middleFooterAction,
  children,
  removeDocument,
}) => {
  return (
    <CardContainer>
      <CardHeader>
        <div>
          <CardHeaderTitle>{title}</CardHeaderTitle>
          <CardHeaderSubTitle>{subTitle}</CardHeaderSubTitle>
        </div>
        {removeDocument && (
          <HeaderAction>
            <div onClick={removeDocument}>
              <CIcon icon={cilXCircle} size="lg" />
            </div>
          </HeaderAction>
        )}
      </CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter>
        <LeftFooterActionContainer>{leftFooterAction}</LeftFooterActionContainer>
        <MiddleFooterActionContainer>{middleFooterAction}</MiddleFooterActionContainer>
        <RightFooterActionContainer>{rightFooterAction}</RightFooterActionContainer>
      </CardFooter>
    </CardContainer>
  )
}

Card.defaultProps = {
  title: '',
  subTitle: '',
  leftFooterAction: () => {},
  middleFooterAction: () => {},
  rightFooterAction: () => {},
}

export default Card
