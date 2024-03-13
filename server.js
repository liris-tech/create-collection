import { MongoInternals, Mongo } from 'meteor/mongo';

import _ from 'lodash';

// =================================================================================================

/**
 * Create a Meteor Collection
 *
 * @param {string} name The name of the collection. Must be unique.
 * @param {Object[]} [indices=[]] Optional indices ({_id: 1} is created by Mongo automatically)
 * @param {Function[]} [mixins=[]] Optional mixins. Where each function takes the superclass as argument and returns its extension.
 * @param {Object} [options={}] Meteor Mongo Collection options: https://docs.meteor.com/api/collections.html#Mongo-Collection.
 * @param {string} [options.mongoUrl] In addition to the Meteor options: url to the MongoDB database.
 * @param {string} [options.oplogUrl] In addition to the Meteor options: url to the Oplog (for Meteor's observations).
 * @returns {Object} The Meteor Collection.
 *
 * @example
 * createCollection({
 *     name: 'myColl',
 *     indices: [{field: 1}, {'field.subfield': 1}],
 *     options: {idGeneration: 'STRING'}
 * })
 *
 * // => returns the collection created
 *
 * @example
 * function greetedCollection(greeting) {
 *     return (superclass) => class extends superclass {
 *         constructor(...args) {
 *             console.log(`${greeting} ${args[0]}!`);
 *             return super(...args);
 *         }
 *     }
 * }
 * createCollection({
 *     name: 'myColl',
 *     indices: [{field: 1}, {'field.subfield': 1}],
 *     mixins: [greetedCollection('Hello')]
 *     options: {idGeneration: 'STRING'}
 * })
 *
 * // => will console.log "Hello myColl!"
 * // => and return the collection created
 */
export function createCollection({name, indices=[], mixins=[], options={}}) {
    // _id of new documents default to Mongo.ObjectID (and not to strings)
    const _options = _.assign({idGeneration: 'MONGO'}, options);

    // mongoUrl and oplogUrl allows for the creation of the collection in different databases
    const { mongoUrl, oplogUrl } = _.pick(_options, ['mongoUrl', 'oplogUrl']);
    if (mongoUrl && oplogUrl) {
        _options._driver = new MongoInternals.RemoteCollectionDriver(mongoUrl, {oplogUrl});
    }

    // applying the mixins
    const extendedClass = mixins.reduce((acc, m) => m(acc), Mongo.Collection);

    // creating the collection
    const collection = _.assign(new extendedClass(name, _options), {params: {name, indices, mixins, options}});

    // creating the indices
    for (const index of indices) {
        collection.rawCollection().createIndex(index, {background: true});
    }

    return collection;
}