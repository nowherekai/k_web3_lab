import Link from "next/link";
import formatTimestamp from "../utils/formatTimestamp";
import { Image, Text } from '@chakra-ui/react'

export default function EventCard({ id, name, eventStartTime, imageURL }) {
  return (
    <div>
      <Link href={`/event/${id}`} passHref>
        <a>
          <Text>{name}</Text>
          <Image src={imageURL} />
          <p className="mt-2 block text-sm text-gray-500">
            {formatTimestamp(eventStartTime)}
          </p>
          <p className="block text-base font-medium text-gray-900">{name}</p>
        </a>
      </Link>
    </div>
  );
}