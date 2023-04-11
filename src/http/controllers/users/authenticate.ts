import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticateBodySchema.parse(req.body);

    try {
        const authenticateService = makeAuthenticateService();

        const { user } = await authenticateService.execute({ email, password });

        const token = await res.jwtSign({
                role: user.role
            },
            {
                sign: {
                    sub: user.id
                }
            });

        const refreshToken = await res.jwtSign({
            role: user.role
        }, {
            sign: {
                sub: user.id,
                expiresIn: "7d"
            }
        });

        return res
            .setCookie("refreshToken", refreshToken, {
                path: "/",
                secure: true,
                sameSite: true,
                httpOnly: true
            })
            .status(200)
            .send({
                token
            });

    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return res.status(400).send({ message: err.message });
        }

        throw err;
    }
}
