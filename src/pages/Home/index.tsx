import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import { Hero, HomeContainer, Preview } from './styles'

import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
    return (
        <HomeContainer>
            <Hero>
                <Heading size={'4xl'}>Agendamento descomplicado</Heading>

                <Text size={'xl'}>
                    Conecte seu calendário e permita que as pessoas
                    marquem agendamentos no seu tempo livre.
                </Text>

                <ClaimUsernameForm />
            </Hero>

            <Preview>
                <Image
                    src={previewImage}
                    alt="Calendario simbolizando aplicação em funcionamento"
                    height={400}
                    quality={100}
                    priority
                />
            </Preview>
        </HomeContainer>
    )
}
