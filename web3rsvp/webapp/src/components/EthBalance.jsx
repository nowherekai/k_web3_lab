import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import useSWR from "swr"

// fetch data from provider
const fetcher = (library) => (...args) => {
    const [method, ...params] = args
    console.log(method, params)
    return library[method](...params)
}

export const EthBalance = () => {
    const { account, library } = useWeb3React()
    const { data: balance } = useSWR(['getBalance', account, 'latest'], {
        fetcher: fetcher(library)
    })

    if (!balance) {
        return <div></div>
    }

    return <div>Balance: {ethers.utils.formatEther(balance)} ETH</div>
}