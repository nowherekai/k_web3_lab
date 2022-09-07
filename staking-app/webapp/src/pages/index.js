import { Button, Text } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import styles from '../styles/Home.module.css'
import abiJson from '../abi/Staker.json'
import { fetcher } from '../utils/helpers'
import useSWR from 'swr'
import { useEffect } from 'react'
import { Contract, ethers } from 'ethers'

const abi = abiJson.abi

const addressContract = "0x6e297612b9bC9c3Bd01c566a94e487ddD97912DA"

export default function Home() {
  const { library, account } = useWeb3React()

  const { data: timeLeft, mutate } = useSWR([addressContract, "timeLeft"],
    { fetcher: fetcher(library, abi) })
  const { data: balance } = useSWR([addressContract, "balanceOf", account],
    { fetcher: fetcher(library, abi) })
  const { data: totalAmount } = useSWR([addressContract, "totalAmount"],
    { fetcher: fetcher(library, abi) })

  useEffect(() => {
    if (!library) return

    library.on('block', () => {
      console.log('update block...')
      mutate(undefined, true)
    })

    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners('block')
    }
  }, [library])

  const stakeEther = async () => {
    const stakerContract = new Contract(addressContract, abi, library.getSigner())
    stakerContract.stake({value: ethers.utils.parseEther("0.5")})
      .catch("error", console.error)
  }

  const execute = async () => {
    const stakerContract = new Contract(addressContract, abi, library.getSigner())
    stakerContract.execute()
      .catch("error", console.error)
  }

  return (
    <div>
      <main className={styles.main}>
        <Text>TimeLeft: { timeLeft && timeLeft.toString() }</Text>
        <Text>Total Staked Amount: { totalAmount && ethers.utils.formatEther(totalAmount)  } </Text>
        <Text> Balance: { balance && ethers.utils.formatEther(balance) } </Text>
        <Button
            onClick={stakeEther}
        >
            🥩 Stake 0.5 ether!
        </Button>

        <Button
                type={"default"}
                onClick={ execute }
              >
                📡 Execute!
              </Button>

      </main>
    </div>
  )
}
