import { useWeb3React } from '@web3-react/core'
import abiJson from '../abi/ETHFaucet.json'
import { Button } from '@chakra-ui/react'
import { Contract } from 'ethers'

const abi = abiJson.abi

export default function ETHFaucet(props) {
    const addressContract = props.addressContract

    const { account, library } = useWeb3React()

    const requestEther = async () => {
        if(!(account && library)) return

        const faucet = new Contract(addressContract, abi, library.getSigner());
        faucet.requestEther()
            .catch('error', console.error)
    }

    return (
        <div>
            <Button onClick={requestEther}>
                Send Me Eth
            </Button>
        </div>
    )
}
