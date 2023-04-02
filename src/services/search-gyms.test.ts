import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsService } from "@/services/search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsService(gymsRepository);
    });

    test("Should be able to search for gyms", async () => {

        await gymsRepository.create({
            title: "Test gym 01",
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0
        });

        await gymsRepository.create({
            title: "Test gym 02",
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0
        });

        const { gyms } = await sut.execute({
            query: "01",
            page: 1
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Test gym 01" })
        ]);
    });

    test("Should be able to fetch paginated gym search", async () => {

        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Test gym 0${i}`,
                description: null,
                phone: null,
                latitude: 0,
                longitude: 0
            });
        }

        const { gyms } = await sut.execute({
            query: "Test",
            page: 2
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Test gym 021" }),
            expect.objectContaining({ title: "Test gym 022" })
        ]);
    });
});