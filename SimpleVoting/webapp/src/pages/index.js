import Head from 'next/head'
import styles from '../styles/Home.module.css'
import abiJson from "../abi/SimpleVoting.json"
import { contractAddress } from "../utils/contractAddress.jsx"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select, StackDivider, Text, VStack } from '@chakra-ui/react'

const abi = abiJson.abi

export default function Home({currentAccount}) {

  const [ isRegisteredVoter, setIsRegisteredVoter ] = useState(false)
  const [ proposals, setProposals ]  = useState()
  const [ workFlowStatus, setWorkFlowStatus ] = useState()
  const [ proposalId, setProposalId ] = useState()

  useEffect(() => {
    queryVotingInfo()
  }, [currentAccount])

  const queryVotingInfo = () => {
    if(!window.ethereum || !currentAccount) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const votingContract = new ethers.Contract(contractAddress, abi, signer)

    votingContract.isRegisteredVoter()
        .then((result) => {
            setIsRegisteredVoter(result)
        }).catch("error", console.error)

    votingContract.workflowStatus()
        .then((result) => {
            setWorkFlowStatus(result)
        }).catch("error", console.error)

    votingContract.getProposals()
        .then((result) => {
            setProposals(result)
          }).catch("error", console.error)
  }

  const changeProposalId = (event) => {
    setProposalId(event.target.value)
  }
  const voteProposal = (event) => {
    event.preventDefault()
    if(!window.ethereum || !currentAccount) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const votingContract = new ethers.Contract(contractAddress, abi, signer)

    console.log("voteProposal")
    console.log(proposalId)
    votingContract.vote(proposalId)
      .then((txn) => {
        txn.wait().then((recipent) => {
            console.log(recipent)
            setProposalId(undefined)
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
          >
          <Box>
            <Text>Proposals:</Text>
            <ul>
              { proposals && proposals.map((proposal, index) => {
                return <li key={index}>{index}. { proposal.description}</li>
              })

              }
            </ul>
          </Box>
          <Box>
            <form onSubmit={voteProposal}>
              <FormControl>
              <Select placeholder='Select Proposal' value={proposalId}
              onChange={changeProposalId}
              >
              { proposals && proposals.map((proposal, index) => {
                return <option key={index} value={index}>{index}. { proposal.description}</option>
              })}
              </Select>
              </FormControl>
              <Button type="submit">Vote</Button>
            </form>
          </Box>
      </VStack>
    </div>
  )
}
