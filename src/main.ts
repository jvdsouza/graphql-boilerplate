import { ApolloServer } from 'apollo-server-express';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import express from 'express';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';

import { environment } from './environment';
import { resolvers } from './resolvers';
import * as typeDefs from './schema.graphql';
import { 
    DateTimeMock, 
    EmailAddressMock, 
    UnsignedIntMock 
} from 'graphql-scalars';
import {
    addMockUsersAsync,
    mongoDbProvider
} from './mongodb.provider';

(async function bootstrapAsync(): Promise<void> {
    try {
        await mongoDbProvider.connectAsync(environment.mongoDB.databaseName);
        await addMockUsersAsync(); // TODO: remove in PROD
        
        const app = express();

        const server = new ApolloServer({ 
            resolvers,
            typeDefs: [
                DIRECTIVES,
                typeDefs
            ],
            mocks: environment.apollo.mocks ? {
                DateTime: DateTimeMock,
                EmailAddress: EmailAddressMock,
                UnsignedInt: UnsignedIntMock
            } : false,
            mockEntireSchema: environment.apollo.mockEntireSchema, // TODO: Remove in PROD.
            introspection: environment.apollo.introspection,
            playground: environment.apollo.playground
        });

        app.use('*', cors())
        app.use(compression());
        server.applyMiddleware({ 
            app, 
            path: '/graphql' 
        });

        const httpServer = createServer(app);

        httpServer.listen(
            {
                port: environment.port,
            },
            ():void => {
                console.log(`\n🚀 GraphQL is now running on http://localhost:${environment.port}/graphql`)
            }
        )

        if (module.hot) {
            module.hot.accept();
            module.hot.dispose(async () => {
                server.stop();
                await mongoDbProvider.closeAsync();
                console.log('Module disposed. ')
            })
        }
    }
    catch(err){
        console.log("an error has occured when setting up the server")
        console.log("-------------------------------------------------");
        console.log(err);
        console.log("-------------------------------------------------");
    }
})();