import styled, { keyframes } from 'styled-components'

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`


export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  animation: ${appearFromRight} 2s;
`

export const GraphContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;  
`