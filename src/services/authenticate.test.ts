import { expect, describe, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "@/services/authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { beforeEach } from "vitest";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateService(usersRepository);
    });

    test("Should be able to authenticate", async () => {

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

        await expect(() => sut.execute({
                email: "johndoe@exemple.com",
                password: "123456"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    test("Should not be able to authenticate with wrong password", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password_hash: await hash("123456", 6)
        });

        await expect(() => sut.execute({
                email: "johndoe@exemple.com",
                password: "123123"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});