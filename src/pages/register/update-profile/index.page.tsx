/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import { GetServerSideProps } from "next";
import { unstable_getServerSession } from 'next-auth'

import { Heading, MultiStep, Text, TextArea, Button, Avatar } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProfileBox, FormAnnotation } from "./styles";
import { RegisterContainer, Header } from "../styles";
import { buildNextAuthOptions } from "../../api/auth/[...nextauth].api";
import { useSession } from "next-auth/react";
import { api } from "../../../libs/axios";
import { useRouter } from "next/router";

const updateProfile = z.object({
    bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfile>

export default function UpdateProfile() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfile),
    })

    const session = useSession()
    const router = useRouter()

    async function handleUpdateProfile(data: UpdateProfileFormData) {
        await api.put('/users/profile', {
            bio: data.bio
        })

        await router.push(`/schedule/${session.data.user.username}`)
    }

    return (
        <RegisterContainer>
            <Header>
                <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>

                <Text>
                    Precisamos de algumas informações para criar seu perfil!
                    Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={4} />
            </Header>

            <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
                <label>
                    <Text size={'sm'}>Foto de perfil</Text>

                    <Avatar
                        src={session.data?.user.avatar_url}
                        alt={session.data?.user.name}
                    />
                </label>

                <label>
                    <Text size={'sm'}>Sobre você</Text>

                    <TextArea {...register('bio')} />

                    <FormAnnotation size="sm">
                        Fale um pouco sobre você. Isto será exibido em sua página pessoal.
                    </FormAnnotation>
                </label>

                <Button disabled={isSubmitting}>
                    Finalizar

                    <ArrowRight />
                </Button>
            </ProfileBox>
        </RegisterContainer>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, buildNextAuthOptions(req, res))

    return {
        props: {
            session
        }
    }
} 