"use strict";
// noinspection ES6PreferShortImport
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileStore = void 0;
const fs = __importStar(require("fs"));
/**
 * A utility class that shows how a File based JSON storage system could work.
 * This is not recommended for large databases since every write operation rewrites the entire database.
 */
class JsonFileStore {
    file;
    notifyUpdate;
    dids;
    keys;
    privateKeys;
    credentials;
    claims;
    presentations;
    messages;
    constructor(file) {
        this.file = file;
        this.notifyUpdate = async (oldState, newState) => {
            await this.save(newState);
        };
        this.dids = {};
        this.keys = {};
        this.privateKeys = {};
        this.credentials = {};
        this.claims = {};
        this.presentations = {};
        this.messages = {};
    }
    static async fromFile(file) {
        const store = new JsonFileStore(file);
        return await store.load();
    }
    async load() {
        await this.checkFile();
        const rawCache = await fs.promises.readFile(this.file, { encoding: 'utf8' });
        let cache;
        try {
            cache = JSON.parse(rawCache);
        }
        catch (e) {
            cache = {};
        }
        ;
        ({
            dids: this.dids,
            keys: this.keys,
            credentials: this.credentials,
            claims: this.claims,
            presentations: this.presentations,
            messages: this.messages,
            privateKeys: this.privateKeys,
        } = {
            dids: {},
            keys: {},
            credentials: {},
            claims: {},
            presentations: {},
            messages: {},
            privateKeys: {},
            ...cache,
        });
        return this;
    }
    async save(newState) {
        await fs.promises.writeFile(this.file, JSON.stringify(newState), {
            encoding: 'utf8',
        });
    }
    async checkFile() {
        const file = await fs.promises.open(this.file, 'w+');
        await file.close();
    }
}
exports.JsonFileStore = JsonFileStore;
//# sourceMappingURL=json-file-store.js.map