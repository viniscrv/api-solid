import { expect, describe, test, beforeEach } from "vitest";
import { RegisterService } from "@/services/register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe("Register Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterService(usersRepository);
    });

    test("Should be able to register", async () => {

        const { user } = await sut.execute({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    test("Should hash user password upon registration", async () => {

        const { user } = await sut.execute({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456"
        });

        const isPasswordCorrectlyHashed = await compare(
            "123456",
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    test("Should be able to register with same email twice", async () => {

        const email = "johndoe@example.com";

        await sut.execute({
            name: "John Doe",
            email,
            password: "123456"
        });

        await expect(() =>
            sut.execute({
                name: "John Doe",
                email,
                password: "123456"
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});