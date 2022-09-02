import { Button } from "@chakra-ui/react";

export default function ConnectWallet({ currentAccount, onClickConnect, onClickDisConnect }) {
    return (
        <>
        {currentAccount ?
            <Button type="button" onClick={onClickDisConnect}>{currentAccount}</Button>
            :
            <Button type="button" onClick={onClickConnect} >Connect Wallet</Button>
        }
        </>
    )
}