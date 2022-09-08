import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { ERC20ABI as abi } from "../abi/ERC20ABI"
import useSWR from "swr";
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack } from "@chakra-ui/react";

const fetcher = (library, abi) => (...args) => {
    if (!library) return

    const [arg1, arg2, ...params] = args
    const address = arg1
    const method = arg2
    const contract = new Contract(address, abi, library)

    return contract[method](...params)
}

export default function ERC20(props) {
    const addressContract = props.addressContract

    const [toAddress, setToAddress ] = useState("")
    const [amount,setAmount] = useState('100')

    const { active, library, account  } = useWeb3React()

    const { data: balance, mutate } = useSWR([addressContract, 'balanceOf', account], {
        fetcher: fetcher(library, abi),
    })

    useSWR([addressContract, 'totalSupply'], { fetcher })
    useSWR([addressContract, 'balanceOf', account], { fetcher })

    async function transfer(event) {
        event.preventDefault()
        if(!(active && account && library)) return

        // new contract instance with **signer**
        const erc20 = new Contract(addressContract, abi, library.getSigner());
        erc20.transfer(toAddress, ethers.utils.parseEther(amount))
            .catch('error', console.error)
    }

    const handleChange = (value) => setAmount(value)

    return (
        <VStack>
            <Box>
            { balance ?
                <Text> Balance: {ethers.utils.formatEther(balance)} </Text>
                :
                <></>
            }
            </Box>
            <Box>
                <form onSubmit={transfer}>
                    <FormControl>
                        <FormLabel htmlFor='amount'>Amount: </FormLabel>
                        <NumberInput defaultValue={amount} min={10} max={1000} onChange={handleChange}>
                            <NumberInputField />
                        </NumberInput>
                        <FormLabel htmlFor='toaddress'>To address: </FormLabel>
                        <Input id="toaddress" type="text" required onChange={(e) => setToAddress(e.target.value)} my={3} />
                        <Button type="submit" isDisabled={!account}>Transfer</Button>
                    </FormControl>
                </form>
            </Box>
        </VStack>
    )
}