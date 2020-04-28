import {Mapper} from "../../Mapper";
import {EntitySchema} from "mikro-orm";

class EntityMock {
};

export const EntityMapperMock: Mapper = {
    entity: EntityMock,
    schema: new EntitySchema({
        name: 'entityMock',
        properties: {
            id: {type: 'string'}
        }
    })
};
