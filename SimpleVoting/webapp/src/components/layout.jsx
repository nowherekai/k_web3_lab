import React from 'react'
import { Text, Center, Container, useColorModeValue } from '@chakra-ui/react'
import Header from './header'

export function Layout(props) {
  return (
    <div>
      <Header {...props} />
      <Container maxW="container.md" py='8'>
        {props.children}
      </Container>
      <Center as="footer" bg={useColorModeValue('gray.100', 'gray.700')} p={6}>
          <Text fontSize="md">first dapp by  - 2022</Text>
      </Center>
    </div>
  )
}