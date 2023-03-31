import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymServiceRequest {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface CreateGymServiceResponse {
    gym: Gym;
}

export class CreateGymService {
    private gymsRepository: GymsRepository;

    constructor(gymsRepository: GymsRepository) {
        this.gymsRepository = gymsRepository;
    }

    async execute({ title, phone, description, latitude, longitude }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {

        const gym = await this.gymsRepository.create({
            title,
            phone,
            description,
            latitude,
            longitude
        });

        return { gym };
    }
}

