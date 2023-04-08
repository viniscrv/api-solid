import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "@/http/controllers/users/authenticate";
import { profile } from "@/http/controllers/users/profile";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
    app.post("/users", register);

    app.post("/sessions", authenticate);

    /* Authenticated */
    app.get("/me", { onRequest: [verifyJWT] }, profile);
}
