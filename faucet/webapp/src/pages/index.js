import { useWeb3React } from '@web3-react/core'
import styles from '../styles/Home.module.css'
import abiJson from '../abi/ETHFaucet.json'
import ETHFaucet from '../components/ETHFaucet'

const abi = abiJson.abi

export default function Home() {
  const { account, library } = useWeb3React()

  return (
    <div>
      <main className={styles.main}>
        <ETHFaucet addressContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3" />
      </main>
    </div>
  )
}
