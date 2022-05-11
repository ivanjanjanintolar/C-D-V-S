import styled from 'styled-components'

export const CardContainer = styled.div`
  display: flex;
  background-color: #ffff;
  border-radius: 12px;
  border: 1px solid #e1e1e1;
  box-shadow: rgba(39, 55, 96, 0.1) 0px 4px 16px 0px;
  flex-direction: column;
  flex: 1;
`

export const CardHeader = styled.div`
  display: flex;
  flex: 1;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-color: #3c4b64;
  flex-direction: row;
  padding: 12px;
  color: #ffff;
`

export const CardHeaderTitle = styled.div`
  line-height: 22px;
  font-weight: bold;
  font-size: 18px;
`

export const CardHeaderSubTitle = styled.div`
  line-height: 22px;
  font-size: 18px;
`

export const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`

export const CardFooter = styled.div`
  display: flex;
  flex: 1;
  padding: 12px 12px;
  flex-direction: row;
`

export const LeftFooterActionContainer = styled.div``

export const RightFooterActionContainer = styled.div`
  margin-left: auto;
`

export const MiddleFooterActionContainer = styled.div`
  display: flex;
  padding-left: 35px;
  width: 200px;
`

export const HeaderAction = styled.div`
  margin-left: auto;
`
