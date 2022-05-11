import styled from 'styled-components'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px;
`

export const Line = styled.div`
  height: 1px;
  opacity: 0.5;
  width: 100%;
  background-color: #bababa;
`

export const BoldText = styled.div`
  line-height: 22px;
  font-weight: bold;
  font-size: 16px;
`

export const Text = styled.div`
  line-height: 22px;
  font-size: 18px;
`

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const CardDetailsContainer = styled.div`
  display: flex;
  padding-top: 20px;
  width: 520px;
  padding-right: 12px;
`
