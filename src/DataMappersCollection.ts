import {AnyEntity, EntityClassGroup} from "mikro-orm/dist/typings";
import {EntityManager} from "mikro-orm";
import {DependencyInjection} from 'curli-types';

type Mapper = EntityClassGroup<AnyEntity>;

export class DataMappersCollection {

    private dataMapperCollection: Mapper[];

    public constructor() {
        this.dataMapperCollection = [];
    }

    public addDataMapper(mapper: Mapper) {
        this.dataMapperCollection.push(mapper);
    }

    public getDataMapperCollection(): Mapper[] {
        return this.dataMapperCollection;
    }

    public generateRepositoriesAsServices(
        entityManager: EntityManager,
        container: DependencyInjection
    ) {
        this.dataMapperCollection.forEach((mapper: Mapper) => {
            const mapperE: EntityClassGroup<any> = (mapper as EntityClassGroup<any>);
            let name: string = mapperE.schema.name;

            name = name.toLowerCase() + 'MikroRepository';

            const repository = entityManager.getRepository(mapperE.entity);
            container.registerServiceBuilded(name, repository);
        });
    }
}