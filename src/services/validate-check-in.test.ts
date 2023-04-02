import { expect, describe, test, beforeEach, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInService } from "@/services/validate-check-in";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe("Validate Check-in Service", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInService(checkInsRepository);

        // vi.useFakeTimers();
    });

    afterEach(() => {
        // vi.useRealTimers();
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
});