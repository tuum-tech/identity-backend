"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { IVCManager, VCManager } from '@blockchain-lab-um/veramo-vc-manager';
// import { AbstractVCStore } from '@blockchain-lab-um/veramo-vc-manager/build/vc-store/abstract-vc-store';
const did_provider_pkh_1 = require("@tuum-tech/did-provider-pkh");
const core_1 = require("@veramo/core");
const did_provider_key_1 = require("@veramo/did-provider-key");
const credential_eip712_1 = require("@veramo/credential-eip712");
const credential_ld_1 = require("@veramo/credential-ld");
const credential_w3c_1 = require("@veramo/credential-w3c");
const data_store_json_1 = require("@veramo/data-store-json");
const did_comm_1 = require("@veramo/did-comm");
const did_jwt_1 = require("@veramo/did-jwt");
const did_manager_1 = require("@veramo/did-manager");
const did_resolver_1 = require("@veramo/did-resolver");
const key_manager_1 = require("@veramo/key-manager");
const kms_local_1 = require("@veramo/kms-local");
const kms_web3_1 = require("@veramo/kms-web3");
const message_handler_1 = require("@veramo/message-handler");
const selective_disclosure_1 = require("@veramo/selective-disclosure");
const did_resolver_2 = require("did-resolver");
const json_file_store_1 = require("./utils/json-file-store");
const credentials_context_1 = require("@transmute/credentials-context");
let databaseFile;
const secretKey = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c';
let agent;
/* eslint-disable */
const setup = async (options) => {
    // This test suite uses a plain JSON file for storage for each agent created.
    // It is important that the same object be used for `DIDStoreJson`/`KeyStoreJson`
    // and `DataStoreJson` if you want to use all the query capabilities of `DataStoreJson`
    databaseFile = options?.context?.databaseFile || `./tmp/local-database-${Math.random().toPrecision(5)}.json`;
    const jsonFileStore = await json_file_store_1.JsonFileStore.fromFile(databaseFile);
    agent = (0, core_1.createAgent)({
        ...options,
        context: {
        // authorizedDID: 'did:example:3456'
        },
        plugins: [
            new key_manager_1.KeyManager({
                store: new data_store_json_1.KeyStoreJson(jsonFileStore),
                kms: {
                    local: new kms_local_1.KeyManagementSystem(new data_store_json_1.PrivateKeyStoreJson(jsonFileStore, new kms_local_1.SecretBox(secretKey))),
                    web3: new kms_web3_1.Web3KeyManagementSystem({}),
                },
            }),
            new did_manager_1.DIDManager({
                store: new data_store_json_1.DIDStoreJson(jsonFileStore),
                defaultProvider: 'did:ethr:goerli',
                providers: {
                    'did:key': new did_provider_key_1.KeyDIDProvider({
                        defaultKms: 'local',
                    }),
                    'did:pkh': new did_provider_pkh_1.PkhDIDProvider({
                        defaultKms: 'local',
                    })
                },
            }),
            new did_resolver_1.DIDResolverPlugin({
                resolver: new did_resolver_2.Resolver({
                    ...(0, did_provider_key_1.getDidKeyResolver)(),
                    ...(0, did_provider_pkh_1.getDidPkhResolver)()
                }),
            }),
            new data_store_json_1.DataStoreJson(jsonFileStore),
            new message_handler_1.MessageHandler({
                messageHandlers: [
                    new did_comm_1.DIDCommMessageHandler(),
                    new did_jwt_1.JwtMessageHandler(),
                    new credential_w3c_1.W3cMessageHandler(),
                    new selective_disclosure_1.SdrMessageHandler(),
                ],
            }),
            new did_comm_1.DIDComm(),
            new credential_w3c_1.CredentialPlugin(),
            new credential_eip712_1.CredentialIssuerEIP712(),
            new credential_ld_1.CredentialIssuerLD({
                contextMaps: [credential_ld_1.LdDefaultContexts, credentials_context_1.contexts],
                suites: [new credential_ld_1.VeramoEcdsaSecp256k1RecoverySignature2020(), new credential_ld_1.VeramoEd25519Signature2018()],
            }),
            new selective_disclosure_1.SelectiveDisclosure(),
            ...(options?.plugins || []),
        ],
    });
    return true;
};
//# sourceMappingURL=setup.js.map