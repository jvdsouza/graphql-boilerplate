import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';

import { environment } from './environment';
import resolvers from './resolvers';
import typeDefs from './schemas.graphql';

const app = express();

const server = new ApolloServer({ 
    resolvers,
    typeDefs,
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
    module.hot.dispose(() => console.log('Module disposed. '))
}
