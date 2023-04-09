import request from "supertest";
import { FastifyInstance } from "fastify";

export async function createAndAutheticateUser(app: FastifyInstance) {
    await request(app.server)
        .post("/users")
        .send({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456"
        });

    const authResponse = await request(app.server)
        .post("/sessions")
        .send({
            email: "johndoe@exemple.com",
            password: "123456"
        });

    const { token } = authResponse.body;

    return {
        token
    };
}