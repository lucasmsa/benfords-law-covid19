import React from 'react'
import {Container, Header, ImageVirus, Line, ButtonsContainer,Explanation} from './styles'
import VirusImage from '../../assets/virus_corona_coronavirus_icon_140419.png'
import BrazilIcon from '../../assets/brazil.svg'
import GlobeIcon from '../../assets/globe.svg'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <Container>
      <Header>
        Belford's Law<br /> Covid-19
        <ImageVirus src={VirusImage} alt='Virus' />
      </Header> 
      <Line />
      <Explanation>
        Belford's law refers to a pattern observed in statiscal data
        in which the the distribution of the first digit is not homogeneous 
        as it's supposed to be, actually following a pattern where the number 1 
        shows up in ~30% of the time, 2 in 17.6%... <br /><br />
        So, does this pattern shows up in Coronavirus cases?
      </Explanation> 
      <ButtonsContainer>
        <Link to='/data/world'>
          <Button>World <img src={GlobeIcon} alt="Globe"/></Button>
        </Link>
        <Link to='/data/brazil'>
          <Button>Brazil <img src={BrazilIcon} alt="Brazil"/></Button>
        </Link>
      </ButtonsContainer>
    
    </Container>
  )
}

export default Home