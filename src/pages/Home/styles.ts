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
  width: 170px;
  height: 170px;
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
  font-size: 60px;
  line-height: 70px;
  text-align: center;
  color: #FFFFFF;

  @media only screen and (max-width: 680px){
    font-size: 40px;
    line-height: 50px;
  }

  @media only screen and (max-width: 370px){
    font-size: 30px;
    line-height: 40px;
  }
`

export const Line = styled.div`

  height: 10px;
  width: 650px;
  background: #000;
  color:  aliceblue;
  border-radius: 35%;

  @media only screen and (max-width: 815px) and (min-width: 680px){
    visibility: hidden;
  }

  @media only screen and (max-width: 680px){
    transform: translateY(10px);
    width: 360px;
    height: 5px;
  }

  @media only screen and (max-width: 370px){
    transform: translateY(-160px);
    width: 280px;
    margin-bottom: -100px;
    padding-top: -100px;
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

  @media only screen and (max-width: 370px){
    margin-top: -50px;
  }
  align-items: center;
  button {
    align-items: center;
    justify-content: center;

    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#a5bbad')}
    }

    @media only screen and (max-width: 370px){
      font-size: 15px;
      max-height: 60px;
      max-width: 150px;
    }

    img {
      width: 25px;
      background: none;
      margin-left: 5px;
      transform: translateY(4px);

      @media only screen and (max-width: 370px){
        width: 17.5px;
      }

    }
  }
`

export const Explanation = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;  
  width: 650px;
  font-size: 22px;
  text-align: center;
  font-weight: 500;
  margin: 24px 0;
  color: lightgray;

  @media only screen and (max-width: 680px){
    width: 300px;
    font-size: 18px;
  }

  @media only screen and (max-width: 370px){
    width: 260px;
    font-size: 15px;
    margin-top: 10px;
    transform: translateY(-40px);
  }
`

export const IconsContainer = styled.div`
  flex-direction: row;
  color: #d0d9dc;
  margin-top: 30px;

  @media only screen and (max-width: 370px){
    margin-top: -130px;
    transform: translateY(-30px);
  }

  a:nth-child(1) {
    margin-right: 5px;
    svg {
      color: #d0d9dc;
    }
  }

  a:nth-child(2) {
    margin-left: 5px;
  }
`