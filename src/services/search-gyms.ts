import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsServiceRequest {
    query: string;
    page: number;
}

interface SearchGymsServiceResponse {
    gyms: Gym[];
}

export class SearchGymsService {
    private gymsRepository: GymsRepository;

    constructor(gymsRepository: GymsRepository) {
        this.gymsRepository = gymsRepository;
    }

    async execute({ query, page }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {

        const gyms = await this.gymsRepository.searchMany(query, page);

        return { gyms };
    }
}

