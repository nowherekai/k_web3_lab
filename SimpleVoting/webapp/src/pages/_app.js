import { ChakraProvider } from '@chakra-ui/react'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout'
import '../styles/globals.css'

function MyDApp({ Component, pageProps }) {
  const [ currentAccount, setCurrentAccount ] = useState("");

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    if (!window.ethereum) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result) => {
      console.log(result)
    })
    provider.getNetwork().then((result) => {
      console.log(result)
    })
  }, [currentAccount])

  const onClickConnect = () => {
    if (!window.ethereum) {
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0])
        }
      }).catch(console.error)
  }

  const onClickDisConnect = async () => {
    setCurrentAccount(undefined)
  }

  return (
    <ChakraProvider>
      <Layout currentAccount={currentAccount}
              onClickConnect={onClickConnect}
              onClickDisConnect={onClickDisConnect}
      >
        <Component {...{...pageProps, currentAccount} } />
      </Layout>
    </ChakraProvider>
  )
}

export default MyDApp
