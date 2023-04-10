import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAutheticateUser } from "@/utils/test/create-and-autheticate-user";
import { prisma } from "@/lib/prisma";

describe("Check-in Metrics (2e2)", () => {

    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test("should be able to list the total count of check-ins", async () => {

        const { token } = await createAndAutheticateUser(app);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: "Test Gym",
                latitude: -27.2092052,
                longitude: -49.6401091
            }
        });

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id
                },
                {
                    gym_id: gym.id,
                    user_id: user.id
                }
            ]
        });

        const response = await request(app.server)
            .get("/check-ins/metrics")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.checkInsCount).toEqual(2);
    });
});