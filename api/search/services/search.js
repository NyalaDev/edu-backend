'use strict';
/**
 * Algolia search index service
 */

const algoliasearch = require('algoliasearch');

const settings = {
  ...strapi.config.custom.algolia,
};

const client = algoliasearch(settings.appId, settings.apiKey);

const getIndex = (indexName) => client.initIndex(indexName);

module.exports = {
  /**
   * Save a new object to the index
   * Call this after save/update in the lifecycle
   * @param {*} model The model to be saved
   * @param {*} index The index name
   */
  async save(model, index) {
    if (!index) {
      strapi.log.error(`Index name is missing`);
    }
    try {
      const object = {
        objectID: model.id,
        ...model,
      };
      await getIndex(index).saveObject(object);
    } catch (e) {
      throw e;
    }
  },
  /**
   * Delete object from the index
   * * Call this after delete in the lifecycle
   * @param {*} objectId the id of the object to be deleted
   * @param {*} index The index name
   */
  async delete(objectID, index) {
    if (!objectID) {
      strapi.log.error(`Missing object id`);
    }
    try {
      await getIndex(index).deleteObject(objectID);
    } catch (e) {
      throw e;
    }
  },
};
