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
exports.CategoryModel = void 0;
const Mongoose = require("mongoose");
//import { DataAccess } from "../DataAccess";
class CategoryModel {
    constructor(dbConnectionString) {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            categoryId: Number,
            name: String,
            description: String
        }, { collection: "category" });
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
                this.model = Mongoose.model("Category", this.schema);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    retrieveAllCategories(response) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = this.model.find({});
            try {
                const categoryArray = yield query.exec();
                response.json(categoryArray);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    retrieveCategory(response, value) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Hello ");
            var query = this.model.findOne({ categoryId: value });
            try {
                const result = yield query.exec();
                response.json(result);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    retrieveCategoryCount(response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("retrieve Category Count ...");
            var query = this.model.estimatedDocumentCount();
            try {
                const numberOfCategories = yield query.exec();
                console.log("numberOfCategories: " + numberOfCategories);
                response.json(numberOfCategories);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.CategoryModel = CategoryModel;
