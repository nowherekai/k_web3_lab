import { Contract } from "ethers"

export const fetcher = (library, abi) => (...args) => {
    if (!library) return

    const [arg1, arg2, ...params] = args
    const address = arg1
    const method = arg2

    const contract = new Contract(address, abi, library)
    return contract[method](...params)

}
