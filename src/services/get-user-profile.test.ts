import { expect, describe, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach } from "vitest";
import { GetUserProfileService } from "@/services/get-user-profile";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileService(usersRepository);
    });

    test("Should be able to get user profile", async () => {

        const createdUser = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password_hash: await hash("123456", 6)
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.name).toEqual("John Doe");
    });

    test("Should not be able to get user profile with wrong id", async () => {

        expect(() => sut.execute({
                userId: "non-existing-id"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});