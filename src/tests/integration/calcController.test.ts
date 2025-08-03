import "reflect-metadata";
import { useContainer as routingUseContainer, createExpressServer } from "routing-controllers";
import { Container } from "typedi";
import request from "supertest";
import { MetaDataService } from "../../infrastructure/services/metaDataService";
import { MetaData } from "../../core/entities/metadata";
import { InternalError, NotFoundError } from "../../core/entities/error";

import { CalcUseCase } from "../../application/useCases/calcUseCase";
import { CalcController } from "../../api/controllers/calcController";
import { StreamService } from "../../infrastructure/services/streamService";

jest.mock("../../application/useCases/calcUseCase");

const metaData: MetaData = {
    heading: {
        title: "Test Document",
        class: "Test Class",
        explanation: "Test Explanation",
    },
    secrets: [],
    indexes: [],
};

const emptyMetaData: MetaData = {
    heading: {
        title: "",
        class: "",
        explanation: "",
    },
    secrets: [],
    indexes: [],
};


describe("CalcController Integration", () => {
    let app: any;
    let useCaseMock: jest.Mocked<CalcUseCase>;
    const url = "/calc/test-session";

    beforeAll(() => {
        routingUseContainer(Container);

        useCaseMock = new (CalcUseCase as any)();

        Container.set(StreamService, new StreamService());
        Container.set(MetaDataService, new MetaDataService(Container.get(StreamService)));
        Container.set(CalcUseCase, useCaseMock);

        app = createExpressServer({
            controllers: [CalcController],
            defaultErrorHandler: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 and call useCase.execute when metaData is valid", async () => {
        useCaseMock.execute.mockResolvedValue(undefined);

        const response = await request(app)
            .post(url)
            .send(metaData)

        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it("should return 200 when metaData is null", async () => {
        useCaseMock.execute.mockResolvedValue(undefined);

        const response = await request(app)
            .post(url)

        expect(response.status).toBe(200);
    });

    it("should return 400 when metaData is invalid", async () => {
        useCaseMock.execute.mockResolvedValue(undefined);

        const response = await request(app)
            .post(url)
            .send(emptyMetaData)

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch("Invalid request: valid MetaData is required");
    });

    it("should return 404 if useCase.execute throws NotFoundError", async () => {
        useCaseMock.execute.mockRejectedValue(new NotFoundError("Some error"));

        const response = await request(app)
            .post(url)
            .send(metaData)

        expect(useCaseMock.execute).toHaveBeenCalled();
        expect(response.status).toBe(404);
        expect(response.body.error).toMatch("Some error");
    });

    it("should return 500 if useCase.execute throws InternalError", async () => {
        useCaseMock.execute.mockRejectedValue(new InternalError("Some error"));

        const response = await request(app)
            .post(url)
            .send(metaData)

        expect(useCaseMock.execute).toHaveBeenCalled();
        expect(response.status).toBe(500);
        expect(response.body.error).toMatch("Some error");
    });

    it("should return 500 if useCase.execute throws", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Some error"));

        const response = await request(app)
            .post(url)
            .send(metaData)

        expect(useCaseMock.execute).toHaveBeenCalled();
        expect(response.status).toBe(500);
        expect(response.body.error).toMatch("Internal server error");
    });
});
