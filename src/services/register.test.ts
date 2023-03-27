import { expect, describe, test } from "vitest";
import { RegisterService } from "@/services/register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

describe("Register Service", () => {
    test("Should be able to register", async () => {

        const usersRepository = new InMemoryUsersRepository();
        const registerService = new RegisterService(usersRepository);

        const { user } = await registerService.execute({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    test("Should hash user password upon registration", async () => {

        const usersRepository = new InMemoryUsersRepository();
        const registerService = new RegisterService(usersRepository);

        const { user } = await registerService.execute({
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

        const usersRepository = new InMemoryUsersRepository();
        const registerService = new RegisterService(usersRepository);
        const email = "johndoe@example.com";

        await registerService.execute({
            name: "John Doe",
            email,
            password: "123456"
        });

        await expect(() =>
            registerService.execute({
                name: "John Doe",
                email,
                password: "123456"
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});