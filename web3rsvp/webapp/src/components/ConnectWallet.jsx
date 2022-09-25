import { Button } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { useEffect } from "react"

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        1, // Mainet
        5, // Goerli
        31337, // hardhat
    ],
})

export const ConnectWallet = () => {
    const { account, activate, active } = useWeb3React()

    const onClick = () => {
        activate(injectedConnector)
    }

    useEffect(() => {
        activate(injectedConnector)
    }, [])

    if (active) {
        return <Button> Account: {account} </Button>
    } else {
        return (<Button type="button" onClick={onClick}>
            Connect
        </Button>)
    }
}