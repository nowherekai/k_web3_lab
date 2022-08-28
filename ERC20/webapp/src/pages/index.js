import Head from 'next/head'
import styles from '../styles/Home.module.css'
import abiJson from "../abi/ERC20ABI.json"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack } from '@chakra-ui/react'

//https://goerli.etherscan.io/address/0x8eD1759bF6195078fe31460Ef0FD3a1D14eEd95e
const contractAddress = "0x8eD1759bF6195078fe31460Ef0FD3a1D14eEd95e"
const abi = abiJson.abi


export default function Home({currentAccount}) {
  //TODO ERC20, mint, balance, transfer

  const [ symbol, setSymbol ] = useState("")
  const [ totalSupply, setTotalSupply ] = useState()
  const [ owner, setOwner ] = useState()
  const [ balance, setBalance ] = useState()
  const [ amount, setAmount ] = useState()
  const [ toAddress, setToAddress ] = useState()

  const queryERC20Basic = () => {
    if(!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const erc20 = new ethers.Contract(contractAddress, abi, provider)

    erc20.symbol().then((result) => {
      setSymbol(result)
    }).catch("error", console.error)

    erc20.totalSupply().then((result) => {
      setTotalSupply(ethers.utils.formatEther(result))
    }).catch("error", console.error)

    erc20.owner().then((result) => {
      setOwner(result)
    }).catch("error", console.error)
  }

  const queryBalance = () => {
    if(!window.ethereum || !currentAccount) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc20 = new ethers.Contract(contractAddress, abi, signer)

    erc20.balanceOf(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result))
    }).catch("error", console.error)
  }

  useEffect(() => {
    queryERC20Basic()
  }, [])

  useEffect(() => {
    if (currentAccount) {
      queryBalance()
    } else {
      setBalance(undefined)
    }
  }, [currentAccount])

  const handleChange = (value) => {
    setAmount(value)
  }

  const transfer = async (event) => {
    event.preventDefault()
    console.log("debug0")
    if(!window.ethereum || !currentAccount) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc20 = new ethers.Contract(contractAddress, abi, signer)

    erc20.transfer(toAddress, ethers.utils.parseEther(amount))
    .then((txn) => {
      txn.wait().then((recipent) => {
        console.log(recipent)
        setAmount(undefined)
        setToAddress(undefined)
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

      <VStack>
        <Box w='100%' my={4}>
          <Text><b>ERC20 Contract</b>: {contractAddress}</Text>
          <Text><b>Token totalSupply</b>:{totalSupply} {symbol}</Text>
          <Text my={4}><b>Token in current account</b>: {balance} {symbol}</Text>
        </Box>


        {currentAccount ?
          <Box>
            <form onSubmit={transfer}>
              <FormControl>
                <FormLabel htmlFor='amount'>Amoutn: </FormLabel>
                <NumberInput defaultValue={amount} min={10} max={1000} onChange=    {handleChange}>
                  <NumberInputField />
                </NumberInput>
                <FormLabel htmlFor="toaddress">To address:</FormLabel>
                <Input id="toaddress" type="text" required  onChange={(e) => setToAddress(e.target.value)} my={3}/>
              </FormControl>
              <Button type="submit">Transfer</Button>
            </form>
          </Box>
          :
          <></>
        }
      </VStack>
    </div>
  )
}
