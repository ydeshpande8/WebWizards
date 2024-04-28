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
exports.App = void 0;
const express = require("express");
const bodyParser = require("body-parser");
const CategoryModel_1 = require("./models/CategoryModel");
const BudgetModel_1 = require("./models/BudgetModel");
const crypto = require("crypto");
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor(mongoDBConnection) {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.Category = new CategoryModel_1.CategoryModel(mongoDBConnection);
        this.Budget = new BudgetModel_1.BudgetModel(mongoDBConnection);
    }
    // Configure Express middleware.
    middleware() {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        // get all categories   //working fine
        router.get('/app/category/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query All Categories');
            yield this.Category.retrieveAllCategories(res);
        }));
        //get one category    //not working
        router.get('/app/category/:categoryId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var id = parseInt(req.params.categoryId);
            console.log('Query to get one category with id:' + id);
            try {
                yield this.Category.retrieveCategory(res, id);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while retrieving the category.' });
            }
        }));
        // get count of all categories   //working fine
        router.get('/app/categorycount', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query the number of category elements in db');
            yield this.Category.retrieveCategoryCount(res);
        }));
        //create category    //have not checked
        router.post('/app/category/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = crypto.randomBytes(16).toString("hex");
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.listId = id;
            try {
                yield this.Category.model.create([jsonObj]);
                //res.send('{"id""' + id + '"}');
                res.send('Category created successfully for ' + jsonObj.name);
            }
            catch (e) {
                console.error(e);
                console.log('object creation failed');
            }
        }));
        //get all budget    //working fine
        router.get('/app/budget/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query All budget');
            yield this.Budget.retrieveAllBudget(res);
        }));
        //get count of all budgets    //working fine
        router.get('/app/budgetcount', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query the number of budget elements in db');
            yield this.Budget.retrieveBudgetCounts(res);
        }));
        this.expressApp.use('/', router);
        this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/pages'));
    }
}
exports.App = App;
