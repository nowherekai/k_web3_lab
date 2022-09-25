import { Center, Container, Text, useColorModeValue } from "@chakra-ui/react";
import Header from "./header";

export default function Layout(props) {
    return (
        <div>
            <Header />
            <Container maxW="container.md" py='4'>
                {props.children}
            </Container>
            <Center as="footer"
                    bg={useColorModeValue('gray.100', 'gray.700')} p={6}>
                <Text fontSize="md">first dapp by k - 2022</Text>
            </Center>
        </div>
    )
}