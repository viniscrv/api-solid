import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Authenticate (2e2)", () => {

    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test("should be able to authenticate", async () => {

        await request(app.server)
            .post("/users")
            .send({
                name: "John Doe",
                email: "johndoe@exemple.com",
                password: "123456"
            });

        const response = await request(app.server)
            .post("/sessions")
            .send({
                email: "johndoe@exemple.com",
                password: "123456"
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
    });
});