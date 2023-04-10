import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "@/http/controllers/users/authenticate";
import { profile } from "@/http/controllers/users/profile";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "@/http/controllers/users/refresh";

export async function usersRoutes(app: FastifyInstance) {
    app.post("/users", register);

    app.post("/sessions", authenticate);

    app.patch("/token/refresh", refresh);

    /* Authenticated */
    app.get("/me", { onRequest: [verifyJWT] }, profile);
}
