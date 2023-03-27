import { expect, describe, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "@/services/authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";

describe("Authenticate Service", () => {
    test("Should be able to authenticate", async () => {

        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateService(usersRepository);

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password_hash: await hash("123456", 6)
        });

        const { user } = await sut.execute({
            email: "johndoe@exemple.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    test("Should not be able to authenticate with wrong email", async () => {

        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateService(usersRepository);

        expect(() => sut.execute({
                email: "johndoe@exemple.com",
                password: "123456"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    test("Should not be able to authenticate with wrong password", async () => {

        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateService(usersRepository);

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password_hash: await hash("123456", 6)
        });

        expect(() => sut.execute({
                email: "johndoe@exemple.com",
                password: "123123"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});