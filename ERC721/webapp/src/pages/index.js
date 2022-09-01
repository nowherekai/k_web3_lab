import Head from 'next/head'
import styles from '../styles/Home.module.css'
import abiJson from "../abi/ERC721ABI.json"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, StackDivider, Text, VStack } from '@chakra-ui/react'

const contractAddress = "0x33a4B29F384F253bC1900BA0ee7192Ee4531B77B"
const abi = abiJson.abi


export default function Home({currentAccount}) {
  //TODO ERC20, mint, balance, transfer

  const [ symbol, setSymbol ] = useState("")
  const [ name, setName ] = useState()
  const [ balance, setBalance ] = useState()
  const [ toAddress, setToAddress ] = useState()
  const [ transferToAddress, setTransferToAddress ] = useState()
  const [ tokenId, setTokenId ] = useState()

  const queryERC721Basic = () => {
    if(!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const erc721 = new ethers.Contract(contractAddress, abi, provider)

    erc721.symbol().then((result) => {
      setSymbol(result)
    }).catch("error", console.error)

    erc721.name().then((result) => {
      setName(result)
    }).catch("error", console.error)
  }

  const queryBalance = () => {
    if(!window.ethereum || !currentAccount) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc721 = new ethers.Contract(contractAddress, abi, signer)

    erc721.balanceOf(currentAccount).then((result) => {
      //setBalance(result.toInteger())
    }).catch("error", console.error)
  }



  useEffect(() => {
    queryERC721Basic()
  }, [])

  useEffect(() => {
    if (currentAccount) {
      queryBalance()
    } else {
      setBalance(undefined)
    }
  }, [currentAccount])

  const mintNFTTo = async (event) => {
    event.preventDefault()
    console.log("debug1")
    if(!window.ethereum || !currentAccount) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc721 = new ethers.Contract(contractAddress, abi, signer)

    erc721.mintTo(toAddress)
      .then((txn) => {
        txn.wait().then((recipent) => {
          console.log(recipent)
          setToAddress(undefined)
        })
      }).catch("error", console.error)
  }

  const handeleChange = (value) => {
    setTokenId(value)
  }

  const transferFrom = async (event) => {
    event.preventDefault()
    console.log("debug2")
    if(!window.ethereum || !currentAccount) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc721 = new ethers.Contract(contractAddress, abi, signer)

    erc721.transferFrom(toAddress, tokenId)
      .then((txn) => {
        txn.wait().then((recipent) => {
          console.log(recipent)
          setTransferToAddress(undefined)
          setTokenId(undefined)
        })
      }).catch("error", console.error)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>first dapp</title>
        <meta name="description" content="first dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={4}
        align='stretch'
      >
        <Box w='100%' my={4}>
          <Text><b>ERC721 Contract</b>: {contractAddress}</Text>
          <Text my={4}><b>NFT of current account</b>: {balance}</Text>
        </Box>

        {currentAccount ?
          <Box m={[2, 3]}>
            <form onSubmit={mintNFTTo}>
              <FormControl>
                <FormLabel htmlFor="toaddress">To address:</FormLabel>
                <Input id="toaddress" type="text" required  onChange={(e) => setToAddress(e.target.value)} my={3}/>
              </FormControl>
              <Button type="submit">Mint NFT</Button>
            </form>
          </Box>
          :
          <></>
        }

        {currentAccount ?
          <Box>
            <form onSubmit={transferFrom}>
              <FormControl>
                <FormLabel htmlFor="transferToaddress">To address:</FormLabel>
                <Input id="transferToAddress" type="text" required  onChange={(e) => setTransferToAddress(e.target.value)} my={3}/>

                <FormLabel htmlFor="tokenId">Token ID: </FormLabel>

                <NumberInput min={1} defaultValue={tokenId} onChange={handeleChange}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <Button type="submit">Transfer NFT</Button>
            </form>
          </Box>
          :
          <></>
        }
      </VStack>
    </div>
  )
}
