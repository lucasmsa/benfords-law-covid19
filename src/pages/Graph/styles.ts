import styled, { keyframes, css } from 'styled-components'
import Button from '../../components/Button'
import { shade} from 'polished'

interface ButtonProps {
  selected?: boolean;
}

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
      width: 50px;
      margin: 50px 180px 30px 0;
      @media only screen and (max-width: 650px){
        width: 35px;
        margin: 50px 150px 20px -60px;
      }
    }
    img:nth-child(2) {
      width: 75px;
      margin-right: 186px;
      margin-bottom: 10px;
      @media only screen and (max-width: 650px){
        width: 55px;
        margin: 0 50px 10px -30px;
      }
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

export const ButtonsContainer = styled.div`
  flex-direction: row;
  margin-top: 20px;
  margin-left: 50px;
`

export const ButtonStyled = styled(Button)<ButtonProps>`
  max-width: 120px;
  max-height: 70px;
  font-size: 14.5px;
  margin: 30px 5px;
  transition: background-color 0.2s;
  &:hover {
    background: ${shade(0.2, '#a5bbad')}
  }

  @media only screen and (max-width: 650px){
    max-width: 96px;
    max-height: 56px;
    font-size: 12px;
    margin: 21px 3.5px;
  }

  ${props => props.selected && css`
      border-color: #361925;
  `}
`