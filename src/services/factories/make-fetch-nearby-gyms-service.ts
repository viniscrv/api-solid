import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsService } from "@/services/fetch-nearby-gyms";

export function makeFetchNearbyGymsService() {
    const gymsRepository = new PrismaGymsRepository();
    const service = new FetchNearbyGymsService(gymsRepository);

    return service;
}