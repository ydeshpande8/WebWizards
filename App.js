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
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GooglePassport_1 = require("./GooglePassport");
const bodyParser = require("body-parser");
const CategoryModel_1 = require("./models/CategoryModel");
const BudgetModel_1 = require("./models/BudgetModel");
const crypto = require("crypto");
const UserModel_1 = require("./models/UserModel");
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor(mongoDBConnection) {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.googlePassportObj = new GooglePassport_1.default();
        this.idGenerator = 102;
        this.Category = new CategoryModel_1.CategoryModel(mongoDBConnection);
        this.Budget = new BudgetModel_1.BudgetModel(mongoDBConnection);
        this.User = new UserModel_1.UserModel(mongoDBConnection);
    }
    // Configure Express middleware.
    middleware() {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(session({ secret: 'keyboard cat' }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
    validateAuth(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("user is authenticated");
            return next();
        }
        console.log("user is not authenticated");
        res.redirect('/');
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        // Auth routes
        router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
        router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
            console.log("successfully authenticated user and returned to callback page.");
            console.log("redirecting to /#/report");
            res.redirect('/#/report');
        });
        // ********** CATEGORY ROUTES **********
        // get all categories   
        router.get('/app/category/', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query All Categories');
            yield this.Category.retrieveAllCategories(res);
        }));
        //get one category    
        router.get('/app/category/:categoryId', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        // get count of all categories   
        router.get('/app/categorycount', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query the number of category elements in db');
            yield this.Category.retrieveCategoryCount(res);
        }));
        //create category  
        router.post('/app/category/', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = crypto.randomBytes(16).toString("hex");
            console.log(req.body);
            var jsonObj = req.body;
            //jsonObj.listId = id;
            try {
                yield this.Category.model.create([jsonObj]);
                //res.send('{"id""' + id + '"}');
                res.send(jsonObj.name + ' category created successfully');
            }
            catch (e) {
                console.error(e);
                console.log('object creation failed');
            }
        }));
        // ********** BUDGET ROUTES **********
        //get all budget    
        router.get('/app/budget/', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query All budget');
            yield this.Budget.retrieveAllBudget(req, res);
        }));
        //get count of all budgets    
        router.get('/app/budgetcount', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Query the number of budget elements in db');
            yield this.Budget.retrieveBudgetCounts(res);
        }));
        //get one budget
        router.get('/app/budget/:budgetId', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var id = parseInt(req.params.budgetId);
            console.log('Query to get one category with id:' + id);
            try {
                yield this.Budget.retrieveBudgetDetails(res, id);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while retrieving the category.' });
            }
        }));
        //create budget
        router.post('/app/budget/', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = crypto.randomBytes(16).toString("hex");
            console.log(req.body);
            var jsonObj = req.body;
            try {
                yield this.Budget.model.create([jsonObj]);
                res.send(jsonObj);
            }
            catch (e) {
                console.error(e);
                console.log('object creation failed');
            }
        }));
        // get report 
        router.get('/app/report/', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.Budget.reportByMonthYear(req, res);
            }
            catch (e) {
                console.error(e);
                console.log('something error');
            }
        }));
        this.expressApp.use('/', router);
        this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        // this.expressApp.use('/', express.static(__dirname+'/pages'));
        this.expressApp.use('/', express.static(__dirname + '/dist/frontend/browser'));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map