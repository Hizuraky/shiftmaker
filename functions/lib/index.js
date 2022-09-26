"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomClaims = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const apollo_boost_1 = require("apollo-boost");
const node_fetch_1 = require("node-fetch");
const graphql_tag_1 = require("graphql-tag");
admin.initializeApp();
exports.setCustomClaims = functions
    .region("asia-northeast1")
    .auth.user()
    .onCreate(async (user) => {
    const client = new apollo_boost_1.default({
        uri: functions.config().hasura.url,
        fetch: node_fetch_1.default,
        request: (operation) => {
            operation.setContext({
                headers: {
                    "x-hasura-admin-secret": functions.config().hasura.admin_secret
                }
            });
        }
    });
    const customClaims = {
        "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user"],
            "x-hasura-user-id": user.uid
        }
    };
    try {
        await admin.auth().setCustomUserClaims(user.uid, customClaims);
        const res = await client.mutate({
            variables: { uuid: user.uid },
            mutation: (0, graphql_tag_1.default) `
          mutation InsertUsers($uuid: String) {
            insert_user(objects: { uuid: $uuid }) {
              returning {
                uuid
              }
            }
          }
        `
        });
        await admin.firestore().collection("user_meta").doc(user.uid).create({
            id: user.uid,
            refreshTime: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=index.js.map