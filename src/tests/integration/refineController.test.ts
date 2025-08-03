import "reflect-metadata";
import { useContainer as routingUseContainer, createExpressServer } from "routing-controllers";
import { Container } from "typedi";
import request from "supertest";

import { Notice } from "../../core/entities/notice";
import * as Services from "../../infrastructure/services/imports";
import { InternalError, NotFoundError } from "../../core/entities/error";
import { RefineUseCase } from "../../application/useCases/refineUseCase";
import { RefineController } from "../../api/controllers/refineController";

jest.mock("../../application/useCases/refineUseCase");


describe("RefineController Integration", () => {
    let app: any;
    let useCaseMock: jest.Mocked<RefineUseCase>;
    const url = "/refine/test-session/party";
    const incorrectSegmentUrl = "/refine/test-session/incorrect-segment";
    const notice:Notice = { message: "This is a test notice" };

    beforeAll(() => {
        routingUseContainer(Container);

        useCaseMock = new (RefineUseCase as any)();

        Container.set(RefineUseCase, useCaseMock);

        app = createExpressServer({
            controllers: [RefineController],
            defaultErrorHandler: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 and call useCase.execute when notice is valid", async () => {
        useCaseMock.execute.mockResolvedValue(undefined);

        const response = await request(app)
            .post(url)
            .send(notice)

        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it("should return 400 when notice is invalid", async () => {
        useCaseMock.execute.mockResolvedValue(undefined);

        const response = await request(app)
            .post(url)

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch("Invalid request: valid Notice is required");
    });

    it("should return 400 when segment is invalid", async () => {
        useCaseMock.execute.mockResolvedValue(undefined);

        const response = await request(app)
            .post(incorrectSegmentUrl)
            .send(notice)

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch("Invalid segment");
    });

    it("should return 404 if useCase.execute throws NotFoundError", async () => {
        useCaseMock.execute.mockRejectedValue(new NotFoundError("Some error"));

        const response = await request(app)
            .post(url)
            .send(notice)

        expect(useCaseMock.execute).toHaveBeenCalled();
        expect(response.status).toBe(404);
        expect(response.body.error).toMatch("Some error");
    });

    it("should return 500 if useCase.execute throws InternalError", async () => {
        useCaseMock.execute.mockRejectedValue(new InternalError("Some error"));

        const response = await request(app)
            .post(url)
            .send(notice)

        expect(useCaseMock.execute).toHaveBeenCalled();
        expect(response.status).toBe(500);
        expect(response.body.error).toMatch("Some error");
    });

    it("should return 500 if useCase.execute throws", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Some error"));

        const response = await request(app)
            .post(url)
            .send(notice)

        expect(useCaseMock.execute).toHaveBeenCalled();
        expect(response.status).toBe(500);
        expect(response.body.error).toMatch("Internal server error");
    });
});
