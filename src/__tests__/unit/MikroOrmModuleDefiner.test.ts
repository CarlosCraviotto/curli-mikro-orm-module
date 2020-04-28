import chai = require('chai');
import { ImportMock, StaticMockManager } from 'ts-mock-imports';

import {MikroOrmModuleDefiner} from '../../MikroOrmModuleDefiner';
//import {dependencyInjectionMother} from './DependencyInjectionMock';
//import {curliApplicationMother} from './CurliApplicationMock';

import * as mikroOrmModule from 'mikro-orm';
import {Utils} from 'mikro-orm';
import {
    CurliApplication,
    DependencyInjection,
    Module,
    DependencyInjectionMock,
    CurliApplicationMock
} from 'curli-types';
import {DataMappersCollection} from "../../DataMappersCollection";
import {EntityMapperMock} from "./EntityMapperMock";



let curliApplication: CurliApplication;
let contaniner: DependencyInjection;
let mockMikroORM: StaticMockManager<Utils>;

describe('Config class tests', function () {

    beforeEach(()=>{
        curliApplication = new CurliApplicationMock();
         contaniner = new DependencyInjectionMock();

         curliApplication.setContainer(contaniner);
    });

    before(async ()=>{
        mockMikroORM = ImportMock.mockStaticClass(mikroOrmModule, 'MikroORM');
        //(mockMikroORM as MockManager<MikroORM>).mock("init", Promise.resolve({em: {}}));
        mockMikroORM.mock("init", Promise.resolve(
            {
                em: {
                    getRepository: ()=>{{}}
                }
            }
            ));
    });

    after(()=>{
        // Call restore to reset all mocked objects to original imports
        ImportMock.restore();
    });

    it('Should return the getName(), whenCallMethodInModules() and getMethodName()', function () {
        const mikroOrmModuleDefiner = new MikroOrmModuleDefiner(curliApplication);

        chai.assert.deepEqual('MikroOrmModulesDefiner', mikroOrmModuleDefiner.getName());
        chai.assert.deepEqual('after:booters', mikroOrmModuleDefiner.whenCallMethodInModules());
        chai.assert.deepEqual('registerDataMappers', mikroOrmModuleDefiner.getMethodName());
    });

    it('Should set the mikro database and create the connector', async function () {

        const mikroOrmModuleDefiner = new MikroOrmModuleDefiner(curliApplication);
        const listOfValuesAskedToTheContainer: Array<string> = [];
        const listExpected: Array<string> = [
            "@DATABASE_NAME",
            "@DATABASE_DEBUG",
            "@DATABASE_TYPE",
            "@DATABASE_URL"
        ];

        contaniner.get = (propertyName: string)=>{
            listOfValuesAskedToTheContainer.push(propertyName);
        }

        mikroOrmModuleDefiner.init();
        await mikroOrmModuleDefiner.afterCalledModules();

        chai.assert.deepEqual(listExpected, listOfValuesAskedToTheContainer);

    });



    it('Should call registerDataMappers into a module and create a service.', async function () {
        const mikroOrmModuleDefiner = new MikroOrmModuleDefiner(curliApplication);
        const entityMapper = EntityMapperMock;
        const module: Module = {
            registerDataMappers: (dataMappersCollection: DataMappersCollection)=>{
                dataMappersCollection.addDataMapper(entityMapper);
            },
            getName(): string {
                return 'moduleMock';
            }
        };

        const listExpected: Array<string> = [
            "entitymockMikroRepository",
            "mikroEntityManager"
        ];
        const listOfServicesCreated:Array<string> = [];

        contaniner.registerServiceBuilded = <T>(serviceName: string, _service: T)=>{
            listOfServicesCreated.push(serviceName);
        }


        mikroOrmModuleDefiner.init();
        mikroOrmModuleDefiner.callMethodInModules(module);
        await mikroOrmModuleDefiner.afterCalledModules();

        chai.assert.deepEqual(listExpected, listOfServicesCreated);
    });

    // it('Should throw an error if the ', function () {
    //     chai.assert.throws(function () {
    //
    //     }, 'Unexpected end of JSON input');
    // });

});
