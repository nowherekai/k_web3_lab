import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useState } from "react";
import abiJson from "../abi/Web3RSVP.json"
import { Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, Spinner, FormHelperText, Textarea, Alert, AlertIcon } from "@chakra-ui/react";
import Link from "next/link";
import getRandomImage from "../utils/getRandomImage";

const abi = abiJson.abi
const addressContract = "0xe81A386aD06Db30458fe6288B1c8Eb62D9973279"
export default function CreateEvent(props) {

    const [eventName, setEventName] = useState("")
    const [eventDateTime, setEventDateTime] = useState()
    const [maxCapacity, setMaxCapacity] = useState()
    const [deposit, setDeposit] = useState()
    const [eventLink, setEventLink] = useState("");
    const [description, setDescription] = useState()

    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(null);
    const [eventID, setEventID] = useState(null);

    const { active, library, account } = useWeb3React()

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!(active && account && library)) return

        const body = {
            name: eventName,
            description: description,
            link: eventLink,
            image: getRandomImage(),
        };

        try {
            const response = await fetch("/api/store-event-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.status !== 200) {
                alert("Oops! Something went wrong. Please refresh and try again.");
            } else {
                console.log("Form successfully submitted!");
                let responseJSON = await response.json();
                await createEvent(responseJSON.cid);
            }
        } catch (error) {
            alert(
                `Oops! Something went wrong. Please refresh and try again. Error ${error}`
            );
        }
    }


    const createEvent = async (cid) => {
        try {
            // new contract instance with **signer**
            const web3rsvp = new Contract(addressContract, abi, library.getSigner());

            let refundDeposit = ethers.utils.parseEther(deposit)
            const txn = await web3rsvp.createEvent(new Date(eventDateTime).getTime(), refundDeposit, maxCapacity, cid)
            setLoading(true);
            console.log("Minting...", txn.hash);

            const wait = await txn.wait()

            console.log("Minted -- ", txn.hash);

            setEventID(wait.events[0].args[0]);
            setSuccess(true);
            setLoading(false);
            setMessage("Your event has been created successfully.");
        } catch (error) {
            setLoading(false);
            setSuccess(false);
            setMessage(`There was an error creating your event: ${error.message}`);
            console.error(error)
        }
    }

    return (

        <Box>
            {
                success &&
                <Alert
                    status="success"
                >
                    {message}
                </Alert>
            }
            {
                success === false &&
                <Alert
                    status="error"
                >
                    {message}
                </Alert>
            }
            {loading && (
                <Alert
                    status="info"
                >
                    <Spinner size='xl' />
                    Please wait
                </Alert>
            )}
            {!success && <>
                <h1>Create your virutal event</h1>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel>Event Name</FormLabel>
                        <Input type="text" id="name" required value={eventName} onChange={(e) => setEventName(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Date & Time</FormLabel>
                        <Input placeholder="Select Date and Time"
                            size="md"
                            type="datetime-local"
                            onChange={(e) => setEventDateTime(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Max capacity</FormLabel>
                        <FormHelperText>Limit the number of spots available for your event.</FormHelperText>
                        <NumberInput
                            min={1} max={10000}
                            value={maxCapacity}
                            onChange={(value) => setMaxCapacity(value)}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel> Refundable deposit</FormLabel>
                        <FormHelperText>Require a refundable deposit (in MATIC) to reserve one spot
                            at your event.</FormHelperText>
                        <NumberInput
                            min={0} max={1000}
                            value={deposit}
                            onChange={(value) => setDeposit(value)}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Event Link</FormLabel>
                        <Input placeholder="event link"
                            size="md"
                            type="input"
                            onChange={(e) => setEventLink(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="about">Description</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='event description'
                            size='sm'
                        />
                    </FormControl>
                    <Button type="submit" >CreateEvent</Button>
                </form>
            </>}

            {success && eventID && (
                <div>
                    Success! Please wait a few minutes, then check out your event page{" "}
                    <span className="font-bold">
                        <Link href={`/event/${eventID}`}>here</Link>
                    </span>
                </div>
            )}
        </Box>

    )
}