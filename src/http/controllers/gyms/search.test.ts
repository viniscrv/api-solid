import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAutheticateUser } from "@/utils/test/create-and-autheticate-user";

describe("Search Gyms (2e2)", () => {

    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test("should be able to search gyms by title", async () => {

        const { token } = await createAndAutheticateUser(app, true);

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test gym",
                description: "some description",
                phone: "41900000000",
                latitude: -27.2092052,
                longitude: -49.6401091
            });

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test gym 02",
                description: "some description",
                phone: "41900000000",
                latitude: -27.2092052,
                longitude: -49.6401091
            });

        const response = await request(app.server)
            .get("/gyms/search")
            .query({
                q: "02"
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "Test gym 02"
            })
        ]);
    });
});