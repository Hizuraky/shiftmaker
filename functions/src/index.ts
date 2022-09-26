import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import ApolloClient from "apollo-boost"
import fetch from "node-fetch"
import gql from "graphql-tag"

admin.initializeApp()

/***
 * 新規アカウント登録時のcloud functions
 */

export const setCustomClaims = functions
  .region("asia-northeast1")
  .auth.user()
  .onCreate(async (user) => {
    const client = new ApolloClient({
      uri: functions.config().hasura.url,
      fetch: fetch as any,
      request: (operation): void => {
        operation.setContext({
          headers: {
            "x-hasura-admin-secret": functions.config().hasura.admin_secret
          }
        })
      }
    })

    // Hasuraの指定のカスタムクレーム
    const customClaims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": user.uid
      }
    }
    try {
      // Hasuraのinsert_userをAdmin権限でmutation
      await admin.auth().setCustomUserClaims(user.uid, customClaims)
      await client.mutate({
        variables: { uuid: user.uid },
        mutation: gql`
          mutation InsertUsers($uuid: String) {
            insert_user(objects: { uuid: $uuid }) {
              returning {
                uuid
              }
            }
          }
        `
      })
      await admin.firestore().collection("user_meta").doc(user.uid).create({
        id: user.uid,
        refreshTime: admin.firestore.FieldValue.serverTimestamp()
      })
    } catch (e) {
      console.log(e)
    }
  })
