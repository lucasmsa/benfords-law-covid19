import React from 'react'
import { Container } from './styles'

const Button: React.FC = ({children, ...rest}) => {
  return (
    <Container
        type='button'
  >{children}</Container>
  )
} 

export default Button