"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const facebook_token_utils_ts_js_1 = require("./facebook-token-utils.ts.js");
const scheduler = () => {
    // Schedule the refresh to run on the first day of every second month at midnight
    node_cron_1.default.schedule('0 0 1 */2 *', async () => {
        console.log('Running the token refresh task');
        await (0, facebook_token_utils_ts_js_1.refreshPageAccessToken)();
    });
    console.log('Token refresh scheduler started');
};
exports.scheduler = scheduler;
