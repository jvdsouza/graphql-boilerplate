import {
    DateTimeResolver,
    EmailAddressResolver,
    UnsignedIntResolver,
} from 'graphql-scalars';
import { ObjectID } from 'mongodb';

import {
    Post,
    PublishPostInput,
    User,
} from './graphql-codegen-typings';
import { mongoDbProvider} from './mongodb.provider';
import PostResolver from './resolvers/Post';

const mockCurrentUserId = '0123456789abcdef01234567';

// export default {
//     Query: {
//         testMessage: ():string => {
//             return 'Hello World!'
//         },
//     }
// }

export const resolvers = {
    DateTime: DateTimeResolver,
    EmailAddress: EmailAddressResolver,
    UnsignedInt: UnsignedIntResolver,
    Query: {
        post: (obj:any, {id}:{id:string}): Promise<Post | null> => {
            return mongoDbProvider.postsCollection.findOne({ _id: new ObjectID(id) })
        }
    },
    Mutation: {
        publishPost: async(obj:any, { input }:{ input:Post }): Promise<Post> => {
            const result = await mongoDbProvider.postsCollection.insertOne({
                title: input.title,
                content: input.content,
                publishedAt: input.publishedAt,
                author: new ObjectID(mockCurrentUserId),
            });

            return result.ops[0] as Post;
        },
    },
    Post: PostResolver,
    User: {
        id: (obj:User): string => {
            return (obj as User)._id 
            ? (obj as User)._id.toString() 
            : (obj as User).id
        },
        posts: (obj:User):Promise<Post[]> => {
            return mongoDbProvider.postsCollection
                .find({
                    author: (obj as User).id
                    ? new ObjectID((obj as User).id)
                    : (obj as User)._id
                }).toArray();
        }
    }
};