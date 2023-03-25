import { expect, describe, test } from "vitest";
import { RegisterService } from "@/services/register";
import { compare } from "bcryptjs";

describe("Register Service", () => {
    test("Should hash user password upon registration", async () => {
        const registerService = new RegisterService({

            async findByEmail(email) {
                return null;
            },

            async create(data) {
                return {
                    id: "user-1",
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date()
                };
            }
        });

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
});