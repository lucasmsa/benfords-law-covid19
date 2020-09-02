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
  padding: 32px;
  margin: 64px 300px;
  animation: ${appearFromRight} 1s;
  @media only screen and (max-width: 1000px){
    margin-left: 64px;
    margin-right: 64px;
  }

  @media only screen and (max-width: 592px){
    margin-left: 2px;
    margin-right: 20px;
  }
`

export const ImageVirus = styled.img`
  width: 200px;
  height: 200px;
  margin-top: 10px;
  margin-left: 20px;
  @media only screen and (max-width: 680px){
    height: 150px;
    width: 150px;
  }
`

export const Header = styled.h1`
  display: flex;
  flex: 1;
  font-family: 'Noto Sans KR', sans-serif;  
  font-style: normal;
  font-weight: 800;
  font-size: 60px;
  line-height: 70px;
  text-align: center;
  color: #FFFFFF;
`

export const Line = styled.div`
  margin-top: 10px;
  display: flex;
  flex: 1;
  height: 10px;
  width: 650px;
  background: #000;
  color:  aliceblue;
  border-radius: 35%;

  @media only screen and (max-width: 1000px){
    width: 400px;
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
  font-size: 24px;
  @media only screen and (max-width: 1000px){
    width: 400px;
  }
  @media only screen and (max-width: 592px){
    font-size: 24px;
  }
  text-align: center;
  font-weight: 500;
  margin: 24px 0;
  color: lightgray;
`