import styled, { keyframes } from 'styled-components'
import { shade} from 'polished'
import { LineChart } from 'recharts'

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
  animation: ${appearFromRight} 2s;
  display: flex;
  flex: 1;
  flex-direction: column; 
  align-items: center;
  height: 1000px;
  a {
    img:nth-child(1) {
      margin: 50px 150px 50px -60px;
      width: 50px;
    }
    img:nth-child(2) {
      margin-left: -45px;
      margin-right: 50px;
      margin-bottom: 10px;
      width: 75px;
    }
  }
`

export const PlaceContainer = styled.div`
  img {
    width: 75px;
    transform: translateY(-50px);
  }
`

export const GraphContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif; 
  color: #fff0e1; 
`

export const LineChartStyled = styled(LineChart)`
  width: 400px;
  height: 300px;
`

export const ButtonsContainer = styled.div`
  flex-direction: row;
  margin-top: 20px;
  margin-left: 50px;
  span {
    button {
      max-width: 120px;
      max-height: 70px;
      font-size: 14.5px;
      margin: 30px 5px;
      transition: background-color 0.2s;
      &:hover {
        background: ${shade(0.2, '#a5bbad')}
      }
    }
  }
`