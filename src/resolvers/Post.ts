import {
    Post,
    PublishPostInput,
    User,
} from '../graphql-codegen-typings';
import { mongoDbProvider} from '../mongodb.provider';
import { ObjectID } from 'mongodb';

export default {
    id:(obj:Post): string => {
        return (obj as Post)._id
        ? (obj as Post)._id.toString()
        : (obj as Post).id
    },
    author: async(obj: Post): Promise<User> => {
        return obj.author instanceof ObjectID
        ? (mongoDbProvider.usersCollection.findOne({
            _id: obj.author,
        }) as Promise<User>)
        :obj.author
    },
}