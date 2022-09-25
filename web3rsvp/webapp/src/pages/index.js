import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import EventCard from "../components/EventCard";

const UPCOMING_EVENTS = gql`
  query Events($currentTimestamp: String) {
    events(where: { eventStartTime_gt: $currentTimestamp }) {
      id
      name
      eventStartTime
    }
  }
`;

export default function Home() {
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().getTime().toString())

  const { loading, error, data } = useQuery(UPCOMING_EVENTS, {
    variables: { currentTimestamp },
  });
  console.log(data)

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
      <main>
        <ul>
          { data && data.events.map((e,  idx) => {
            return <li><EventCard
            id={e.id}
            name={e.name}
            eventStartTime={e.eventStartTime}
          /></li>
          })}
        </ul>
      </main>
  )
}

