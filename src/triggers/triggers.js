const CONFIG = require('../config/config');
const EVENT = require('./custom-events').customEvent;
const LISTENERS = require('../controllers/listeners.controller');

EVENT.addListener('add-collection-in-user', LISTENERS.addCollectionInUser);
EVENT.addListener('add-artwork-in-user', LISTENERS.addArtworkInUser);
EVENT.addListener('add-artwork-in-collection', LISTENERS.addArtworkInCollection);
EVENT.addListener('save-bid-in-auction', LISTENERS.saveBidInAuction);
EVENT.addListener('open-artwork-auction', LISTENERS.openArtworkAuction);
EVENT.addListener('add-cause-organization', LISTENERS.addCauseOrganization);
EVENT.addListener('add-feed-organization', LISTENERS.addFeedOrganization);
EVENT.addListener('update-artwork-history', LISTENERS.updateArtworkHistory);
EVENT.addListener('update-history', LISTENERS.updateHistory);
EVENT.addListener('update-user-history', LISTENERS.updateUserHistory);
EVENT.addListener('send-and-save-notification', LISTENERS.createNotification);
EVENT.addListener('record-transaction', LISTENERS.createTransaction);
EVENT.addListener('remove-cause-from-organization-causes', LISTENERS.removeCauseOrganization);
EVENT.addListener('remove-feed-from-organization-feeds', LISTENERS.removeFeedOrganization);
EVENT.addListener('add-workspace-user',LISTENERS.addWorkspaceUser)
EVENT.addListener('remove-workspace-user',LISTENERS.removeWorkspaceUser)
EVENT.addListener('add-product-workspace',LISTENERS.addProductWorkspace)
EVENT.addListener('remove-product-workspace',LISTENERS.removeProductWorkspace)
EVENT.addListener('add-service-workspace',LISTENERS.addServiceWorkspace)
EVENT.addListener('remove-service-workspace',LISTENERS.removeServiceWorkspace)
