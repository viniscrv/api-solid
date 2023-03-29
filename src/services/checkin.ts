import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckinServiceRequest {
    userId: string;
    gymId: string;
}

interface CheckinServiceResponse {
    checkIn: CheckIn;
}

export class CheckinService {
    constructor(private checkInsRepository: CheckInsRepository) {
    }

    async execute({ userId, gymId }: CheckinServiceRequest): Promise<CheckinServiceResponse> {
        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        });

        return {
            checkIn
        };
    }
}
