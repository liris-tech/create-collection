import { Mongo } from 'meteor/mongo';

import _ from 'lodash';

// =================================================================================================

/**
 * Create a Meteor Collection
 *
 * @param {string} name The name of the collection. Must be unique.
 * @param {Function[]} [mixins=[]] Optional mixins. Where each function takes the superclass as argument and returns its extension.
 * @param {Object} [options={}] Meteor Mongo Collection options: https://docs.meteor.com/api/collections.html#Mongo-Collection.
 * @param {boolean} [options.localOnly] In addition to the Meteor options: local Mongo Collection.
 * @returns {Object} The Meteor Collection.
 *
 * @example
 * createCollection({
 *     name: 'myColl',
 *     options: {localOnly: true}
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
 *     mixins: [greetedCollection('Hello')]
 *     options: {localOnly: true}
 * })
 *
 * // => will console.log "Hello myColl!"
 * // => and return the collection created
 */
export function createCollection({name, mixins=[], options={}}) {
    // _id of new documents default to Mongo.ObjectID (and not to strings)
    const _options = _.assign({idGeneration: 'MONGO'}, options);

    // local collections are required to have `null` as name in Meteor
    const _name = _options.localOnly ? null : name;

    // applying the mixins
    const extendedClass = mixins.reduce((acc, m) => m(acc), Mongo.Collection);

    return _.assign(new extendedClass(_name, _options), {params: {name, mixins, options}});
}