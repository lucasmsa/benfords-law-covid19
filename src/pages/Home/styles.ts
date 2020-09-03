import styled, { keyframes } from 'styled-components'
import { shade } from 'polished'

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
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding: 32px;
  margin: 40px;
  height: 800px;
  animation: ${appearFromRight} 1s;
  @media only screen and (max-width: 1000px){
    margin-left: 64px;
    margin-right: 64px;
  }
`

export const ImageVirus = styled.img`
  width: 160px;
  height: 160px;
  margin-top: 10px;
  margin-left: 20px;

  @media only screen and (max-width: 680px){
    width: 120px;
    height: 120px;
  }
`

export const Header = styled.h1`
  display: flex;
  flex: 1;
  font-family: 'Noto Sans KR', sans-serif;  
  font-style: normal;
  font-weight: 800;
  font-size: 58px;
  line-height: 70px;
  text-align: center;
  color: #FFFFFF;

  @media only screen and (max-width: 680px){
    font-size: 40px;
    line-height: 50px;
  }
`

export const Line = styled.div`

  height: 10px;
  width: 650px;
  background: #000;
  color:  aliceblue;
  border-radius: 35%;

  @media only screen and (max-width: 680px){
    margin-top: -5px;
    width: 360px;
    height: 5px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 650px;
  @media only screen and (max-width: 1000px){
    width: 400px;
  }
  align-items: center;
  button {
    align-items: center;
    justify-content: center;

    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#a5bbad')}
    }

    img {
      width: 25px;
      background: none;
      margin-left: 5px;
      transform: translateY(4px);
    }
  }
`

export const Explanation = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;  
  width: 650px;
  font-size: 22px;
  @media only screen and (max-width: 680px){
    width: 300px;
    font-size: 18px;
  }
  text-align: center;
  font-weight: 500;
  margin: 24px 0;
  color: lightgray;
`