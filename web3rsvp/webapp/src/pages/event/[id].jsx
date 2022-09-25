import { gql } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import client from "../../utils/apollo-client";
import formatTimestamp from "../../utils/formatTimestamp";
import { Text, Button } from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react'
import abiJson from "../../abi/Web3RSVP.json"
import {
  EmojiHappyIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";

const abi = abiJson.abi
const addressContract = "0xe81A386aD06Db30458fe6288B1c8Eb62D9973279"

function Event({ event }) {
  if (event === null) {
    return (<div>Not Found</div>)
  }

  const { account, active, library } = useWeb3React()
  const [rsvped, setRsvped] = useState(null)

  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);

  const currentTimestamp = new Date().getTime()

  useEffect(() => {
    if (account) {
      for (let i = 0; i < event.rsvps.length; i++) {
        const thisAccount = account.toLowerCase();
        if (event.rsvps[i].attendee.id.toLowerCase() == thisAccount) {
          setRsvped(true)
          return
        }
      }
    }
    setRsvped(false)
  }, [account])



  const newRSVP =  async () => {
    if (!(active && account && library)) return
    try {
        // new contract instance with **signer**
        const web3rsvp = new Contract(addressContract, abi, library.getSigner());

        const txn = await web3rsvp.createRSVP(event.eventID, {value: event.deposit})
        setLoading(true);
        console.log("Minting...", txn.hash);

        await txn.wait()

        console.log("Minted -- ", txn.hash);

        setSuccess(true);
        setLoading(false);
        setMessage("Your rsvp has been created successfully.");
    } catch (error) {
        setLoading(false);
        setSuccess(false);
        setMessage(`There was an error creating your rsvp: ${error.message}`);
        console.error(error)
    }
  }

  return (
    <>
      <h6>{formatTimestamp(event.eventStartTime)}</h6>
      <h1>{event.name}</h1>
      <div>
        {
          event.eventStartTime > currentTimestamp ?
            ( rsvped ?
              <span>You have rsvped</span>
              :
              <Button type="button" onClick={newRSVP}>  RSVP for {ethers.utils.formatEther(event.deposit)} ETHER</Button>
            )
            :
            <Text color='tomato'> Event has ended</Text>
        }
      </div>

      <div className="flex item-center">
        <Icon as={UsersIcon} w={8} h={8} color='red.500' />
        <span className="truncate">
          {event.totalRSVPs}/{event.maxCapacity} attending
        </span>
      </div>
      <div>
        <Icon as={TicketIcon} w={8} h={8} />
        <span className="truncate">1 RSVP per wallet</span>
      </div>
      <div>
        <Icon as={EmojiHappyIcon} w={8} h={8} />
        <span className="truncate">
          Hosted by{" "}
          {event.eventOwner}
        </span>
      </div>
    </>
  )
}

export default Event

export async function getServerSideProps(context) {
  console.log("debug0")
  const { id } = context.params;
  console.log(id);

  const { data } = await client.query({
    query: gql`
        query Event($id: String!) {
          event(id: $id) {
            id
            eventID
            name
            description
            link
            eventOwner
            eventStartTime
            maxCapacity
            deposit
            totalRSVPs
            totalConfirmedAttendees
            imageURL
            rsvps {
              id
              attendee {
                id
              }
            }
          }
        }
      `,
    variables: {
      id: id,
    },
  });
  console.log(data)

  return {
    props: {
      event: data.event,
    },
  };
}

