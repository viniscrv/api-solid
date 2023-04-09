import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service";

export async function history(req: FastifyRequest, res: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)
    });

    const { page } = checkInHistoryQuerySchema.parse(req.query);

    const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService();

    const { checkIns } = await fetchUserCheckInsHistoryService.execute({ userId: req.user.sub, page });

    return res.status(200).send({
        checkIns
    });
}
