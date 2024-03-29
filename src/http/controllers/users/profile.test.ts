import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAutheticateUser } from "@/utils/test/create-and-autheticate-user";

describe("Profile (2e2)", () => {

    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test("should be able to get user profile", async () => {

        const { token } = await createAndAutheticateUser(app);

        const profileResponse = await request(app.server)
            .get("/me")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(profileResponse.statusCode).toEqual(200);
        expect(profileResponse.body.user).toEqual(expect.objectContaining({
            email: "johndoe@exemple.com"
        }));
    });
});