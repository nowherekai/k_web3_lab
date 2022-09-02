import Head from 'next/head'
import styles from '../styles/Home.module.css'
import abiJson from "../abi/SimpleVoting.json"
import { contractAddress } from "../utils/contractAddress.jsx"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, StackDivider, Text, Textarea, VStack } from '@chakra-ui/react'

const abi = abiJson.abi

export default function Admin({currentAccount}) {

    const [isAdmin, setIsAdmin] = useState(false)
    const [ workFlowStatus, setWorkFlowStatus ] = useState()
    const [ voters, setVoters ] = useState()
    const [ proposal, setProposal ] = useState("")

    const manageVotingInfo = () => {
        if(!window.ethereum || !currentAccount) return
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const votingContract = new ethers.Contract(contractAddress, abi, signer)

        votingContract.isAdmin()
            .then((result) => {
                setIsAdmin(result)
            }).catch("error", console.error)

        votingContract.workflowStatus()
            .then((result) => {
                setWorkFlowStatus(result)
            }).catch("error", console.error)
    }

    useEffect(() => {
        manageVotingInfo();
    }, [currentAccount])

    const handleAddressesChange = (e) => {
        let inputValue = e.target.value
        setVoters(inputValue)
    }

    const registerVoters = async () => {
        if(!window.ethereum || !currentAccount) return
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const votingContract = new ethers.Contract(contractAddress, abi, signer)

        votingContract.registerVoters(voters.split("\n"))
            .then((txn) => {
                txn.wait().then((recipent) => {
                console.log(recipent)
                setVoters(undefined)
                })
            }).catch("error", console.error)
    }

    const handleProposalChange = (e) => {
        let inputValue = e.target.value
        setProposal(inputValue)
    }

    const registerProposal = async (event) => {
        event.preventDefault()
        if(!window.ethereum || !currentAccount) return
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const votingContract = new ethers.Contract(contractAddress, abi, signer)

        console.log("registerProposal")
        votingContract.registerProposal(proposal)
            .then((txn) => {
                txn.wait().then((recipent) => {
                    console.log(recipent)
                    setVoters()
                })
            }).catch("error", console.error)
    }

    if (!isAdmin) {
        return <div>Admin only</div>
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
          >
            <Box>
                <div>WorkFlowStatus: {workFlowStatus}</div>
            </Box>
          <Box>
            <form onSubmit={registerVoters}>
              <FormControl>
                <FormLabel htmlFor='voters'>Voters: </FormLabel>
                <Textarea placeholder='Voter addresses'
                    value={voters}
                    onChange={handleAddressesChange}
                    size='sm'
                />

              </FormControl>
              <Button type="submit">Register</Button>
            </form>
          </Box>
          <Box>
            <form onSubmit={registerProposal}>
              <FormControl>
                <FormLabel htmlFor='voters'>Proposal description: </FormLabel>
                <Textarea placeholder='description'
                    value={proposal}
                    onChange={handleProposalChange}
                    size='sm'
                />

              </FormControl>
              <Button type="submit">Register</Button>
            </form>
          </Box>
          </VStack>
        </div>
      )
}