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
exports.BudgetModel = void 0;
const Mongoose = require("mongoose");
class BudgetModel {
    constructor(dbConnectionString) {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            categoryId: String,
            budget: [
                {
                    budgetId: Number,
                    amount: Number,
                    date: Date,
                    note: String
                }
            ]
        }, { collection: "budget" });
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
                this.model = Mongoose.model("Budget", this.schema);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    retrieveAllBudget(response) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = this.model.find({});
            try {
                const budgetArray = yield query.exec();
                response.json(budgetArray);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    retrieveBudgetDetails(response, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = this.model.findOne(filter);
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
    retrieveBudgetCount(response, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = this.model.findOne(filter);
            try {
                const budgetList = yield query.exec();
                if (budgetList == null) {
                    response.status(404);
                    response.json('{count: -1}');
                }
                else {
                    console.log('List of Budget: ' + budgetList.budget.length);
                    response.json('{count:' + budgetList.budget.length + '}');
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    retrieveBudgetCounts(response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("retrieve Budget Count ...");
            var query = this.model.estimatedDocumentCount();
            try {
                const numberOfBudget = yield query.exec();
                console.log("numberOfCategories: " + numberOfBudget);
                response.json(numberOfBudget);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.BudgetModel = BudgetModel;
