import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymService } from "@/services/create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymService(gymsRepository);
    });

    test("Should be able to register", async () => {

        const { gym } = await sut.execute({
            title: "Test Gym",
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});