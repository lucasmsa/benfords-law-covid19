import React from 'react'
import { Container } from './styles'

const Button: React.FC = ({children, ...rest}) => {
  return (
    <Container
        type='button'
        {...rest}>
      {children}
    </Container>
  )
} 

export default Button