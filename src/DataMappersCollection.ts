
import {EntityManager} from "mikro-orm";
import {DependencyInjection} from 'curli-types';
import {Mapper} from "./Mapper";
import {HandleDataMappers} from "./HandleDataMappers";

export class DataMappersCollection implements HandleDataMappers{

    private dataMapperCollection: Mapper[];

    public constructor() {
        this.dataMapperCollection = [];
    }

    public addDataMapper(mapper: Mapper): void {
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
            let name: string = mapper.schema.name;

            name = name.toLowerCase() + 'MikroRepository';

            const repository = entityManager.getRepository(mapper.entity);
            container.registerServiceBuilded(name, repository);
        });
    }
}