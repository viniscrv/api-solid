import { expect, describe, test, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInService } from "@/services/validate-check-in";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { LateCheckInValidationError } from "@/services/errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe("Validate Check-in Service", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInService(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("Should be able to validate the check-in", async () => {

        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym 01",
            user_id: "user-01"
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
    });

    test("Should not be able to validate an in nonexistent check-in", async () => {

        await expect(() => sut.execute({
                checkInId: "nonexistent-check-in-id"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    test("Should not be able to validate check-in after 20 minutes of its creation", async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym 01",
            user_id: "user-01"
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;

        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(() => sut.execute({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(LateCheckInValidationError);
    });
});