import {MikroORM, RequestContext} from 'mikro-orm';

import {
    DependencyInjection,
    CurliApplication,
    ApplicationEvents,
    ModulesDefiner,
    Module
} from 'curli-types';

import {DataMappersCollection} from "./DataMappersCollection";

const ENTITY_MANAGER_SERVICE_NAME = 'mikroEntityManager';
const MODULE_NAME = 'MikroOrmModulesDefiner';

export class MikroOrmModuleDefiner implements ModulesDefiner {

    private container: DependencyInjection | undefined = undefined;

    private collection: DataMappersCollection | undefined;

    public constructor(private app: CurliApplication) {
    }

    public getName(): string {
        return MODULE_NAME;
    }

    public beforeCallModules(): void {
        this.container = this.app.getContainer();
        this.collection = new DataMappersCollection();
    }

    public whenCallMethodInModules(): ApplicationEvents {
        return 'after:booters';
    }

    public getMethodName(): string {
        return 'registerDataMappers';
    }

    public callMethodInModules(module: Module): void {
        module.registerDataMappers((this.collection as DataMappersCollection));
    }

    public async afterCallModules(): Promise<void> {

        const collection = (this.collection as DataMappersCollection),
            entities = collection.getDataMapperCollection(),
            container = (this.container as DependencyInjection);

        const orm = await MikroORM.init({
            entities: entities,
            dbName: container.get('@DATABASE_NAME'),
            logger: console.log.bind(console),
            debug: container.get('@DATABASE_DEBUG'),
            type: container.get('@DATABASE_TYPE'),//'mongo',
            clientUrl: container.get('@DATABASE_URL'),
        });

        const entityManager = orm.em;
        collection.generateRepositoriesAsServices(entityManager, container);

        container.registerServiceBuilded(ENTITY_MANAGER_SERVICE_NAME, entityManager);

        this.app.setMiddleware((_req, _res, next) => {
            RequestContext.create(entityManager, next);
        });
    }

}
