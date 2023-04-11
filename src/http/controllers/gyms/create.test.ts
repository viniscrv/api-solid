import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAutheticateUser } from "@/utils/test/create-and-autheticate-user";

describe("Create Gym (2e2)", () => {

    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test("should be able to create a gym", async () => {

        const { token } = await createAndAutheticateUser(app, true);

        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test gym",
                description: "some description",
                phone: "41900000000",
                latitude: -27.2092052,
                longitude: -49.6401091
            });

        expect(response.statusCode).toEqual(201);
    });
});