import { expect, describe, test, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInService } from "@/services/check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-in Service", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInService(checkInsRepository, gymsRepository);

        gymsRepository.items.push({
            id: "gym-01",
            title: "Test Gym",
            description: "",
            phone: "",
            latitude: new Decimal(0),
            longitude: new Decimal(0)
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("Should be able to check in", async () => {

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    test("Should not be able to check-in twice in the same day", async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        await expect(() => sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        })).rejects.toBeInstanceOf(Error);
    });

    test("Should be able to check-in twice in but in different days", async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    test("Should not be able to check-in on distant gym", async () => {

        gymsRepository.items.push({
            id: "gym-02",
            title: "Test Gym",
            description: "",
            phone: "",
            latitude: new Decimal(-25.3506225),
            longitude: new Decimal(-49.2744093)
        });


        await expect(() => sut.execute({
            gymId: "gym-02",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        })).rejects.toBeInstanceOf(Error);
    });
});