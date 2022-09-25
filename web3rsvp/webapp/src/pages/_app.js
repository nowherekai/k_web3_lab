import '../styles/globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Layout from '../components/layout'

import { ApolloProvider } from "@apollo/client";
import client from "../utils/apollo-client";


function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}


function DApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default DApp
