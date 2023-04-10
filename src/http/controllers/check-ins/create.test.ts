import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAutheticateUser } from "@/utils/test/create-and-autheticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Check-in (2e2)", () => {

    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test("should be able to create a check-in", async () => {

        const { token } = await createAndAutheticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: "Test Gym",
                latitude: -27.2092052,
                longitude: -49.6401091
            }
        });

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                latitude: -27.2092052,
                longitude: -49.6401091
            });

        expect(response.statusCode).toEqual(201);
    });
});