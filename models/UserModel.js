"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const Mongoose = require("mongoose");
const DataAccess_1 = require("../DataAccess");
let mongooseConnection = DataAccess_1.DataAccess.mongooseConnection;
let mongooseObj = DataAccess_1.DataAccess.mongooseInstance;
class UserModel {
    constructor(dbConnectionString) {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.model = mongooseConnection.model("Users", this.schema);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            fname: String,
            lname: String,
            email: String,
            password: String
        }, { collection: "users" });
    }
    getAllUsers(response) {
        console.log("Get all users");
        var query = this.model.find({});
        query.exec((error, itemArray) => { response.json(itemArray); });
    }
    getUserById(id, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findById(id);
                if (!user) {
                    response.status(404).json({ message: 'User not found' });
                }
                else {
                    response.json(user);
                }
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    updateUserById(id, userData, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findByIdAndUpdate(id, userData, { new: true });
                if (!user) {
                    response.status(404).json({ message: 'User not found' });
                }
                else {
                    response.json(user);
                }
            }
            catch (error) {
                console.error(error);
                response.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.UserModel = UserModel;
