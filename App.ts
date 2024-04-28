import * as express from 'express';
import * as bodyParser from 'body-parser'; 
import {CategoryModel} from './models/CategoryModel';
import {BudgetModel} from './models/BudgetModel';
import * as crypto from 'crypto';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;

  public Category : CategoryModel;

  public Budget : BudgetModel;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection:string)
  {
    this.expressApp = express();
    this.middleware();
    this.routes();
    
    this.Category = new CategoryModel(mongoDBConnection);
    this.Budget = new BudgetModel(mongoDBConnection);
  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use( (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
   
    // get all categories   //working fine
    router.get('/app/category/', async (req, res) => {
      console.log('Query All Categories');
      await this.Category.retrieveAllCategories(res);
  });

    //get one category    //not working
    router.get('/app/category/:categoryId', async (req, res) =>{
      var id = parseInt(req.params.categoryId);
      console.log('Query to get one category with id:' + id);
      try 
      {
          await this.Category.retrieveCategory(res, id);
      } 
      catch (error) 
      {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the category.' });
    }
    });

    // get count of all categories   //working fine
    router.get('/app/categorycount', async (req, res) => {
      console.log('Query the number of category elements in db');
      await this.Category.retrieveCategoryCount(res);
    });

    //create category    //have not checked
    router.post('/app/category/', async (req, res) => 
    {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
      var jsonObj = req.body;
      jsonObj.listId = id;
      try
      {
        await this.Category.model.create([jsonObj]);
        //res.send('{"id""' + id + '"}');
        res.send('Category created successfully for ' + jsonObj.name)
      }
      catch(e)
      {
        console.error(e);
        console.log('object creation failed');
      }
    });

    //get all budget    //working fine
    router.get('/app/budget/', async (req, res) => {
      console.log('Query All budget');
      await this.Budget.retrieveAllBudget(res);
  });
 
    //get count of all budgets    //working fine
    router.get('/app/budgetcount', async (req, res) => {
      console.log('Query the number of budget elements in db');
      await this.Budget.retrieveBudgetCounts(res);
    });

    this.expressApp.use('/', router);

    this.expressApp.use('/app/json/', express.static(__dirname+'/app/json'));
    this.expressApp.use('/images', express.static(__dirname+'/img'));
    this.expressApp.use('/', express.static(__dirname+'/pages'));
    
    }

  }

export {App};