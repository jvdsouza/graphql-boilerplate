const defaultPort = 4000;

interface Environment {
    apollo: {
        introspection: boolean,
        playground: boolean,
        mocks: boolean,
        mockEntireSchema: boolean,
    };
    mongoDB: {
        databaseName: string;
        url: string;
    };
    port: number|string;
}

export const environment:Environment = {
    apollo: {
        introspection: process.env.APOLLO_INTROSPECTION === 'true',
        playground: process.env.APOLLO_PLAYGROUND === 'true',
        mocks: process.env.APOLLO_MOCKS === 'true',
        mockEntireSchema: process.env.MOCK_ENTIRE_SCHEMA === 'true',
    },
    mongoDB: {
        databaseName: process.env.MONGO_DB_NAME as string,
        url: process.env.MONGO_DB_URL as string,
    },
    port: process.env.PORT || defaultPort
}