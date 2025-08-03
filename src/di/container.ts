import { Container } from "typedi";

import * as Services from "../infrastructure/services/imports";

export function setupContainer() {
    Container.set(Services.ChoiceService, new Services. ChoiceService());
    Container.set(Services.FileTypeService, new Services. FileTypeService());
    Container.set(Services.SegmentService, new Services. SegmentService());
    Container.set(Services.StreamService, new Services. StreamService());
    Container.set(Services.TokenService, new Services. TokenService());
    Container.set(Services.MetaDataService, new Services. MetaDataService(
        Container.get(Services.StreamService))
    );
    Container.set<Services.IBlobService>(Services.TOKENS.IBlobService, new Services. AzureBlobService());
    Container.set<Services.IIntegrationService>(Services.TOKENS.IIntegrationService, new Services.DemoIntegrationService());
    Container.set<Services.ITrackingService>(Services.TOKENS.ITrackingService, new Services.DemoTrackingService());
    
    Container.set<Services.IAISvcClient>(Services.TOKENS.IAISvcClient, new Services.TabulariumClient(
        Container.get(Services.TokenService),
        //Container.get<Services.ITrackingService>(Services.TOKENS.ITrackingService),
        //Container.get(Services.CallbackService)
    ));
}
export { Container };

