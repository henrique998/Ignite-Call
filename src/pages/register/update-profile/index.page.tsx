/* eslint-disable prettier/prettier */
import { Heading, MultiStep, Text, TextArea, Button } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProfileBox, FormAnnotation } from "./styles";
import { RegisterContainer, Header } from "../styles";

const updateProfile = z.object({
    bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfile>

export default function UpdateProfile() {
    const { register, handleSubmit, formState: {  isSubmitting } } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfile),
    })

    async function handleUpdateProfile(data: UpdateProfileFormData) {
        
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
