import * as express from 'express';
import * as path from 'path';
import * as mongodb from 'mongodb';
import * as url from 'url';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import GooglePassport from './GooglePassport';
import * as bodyParser from 'body-parser';
import { CategoryModel } from './models/CategoryModel';
import { BudgetModel } from './models/BudgetModel';
import * as crypto from 'crypto';
import { UserModel } from './models/UserModel';


declare global {
  namespace Express {
    interface User {
      id: string,
      displayName: string,
    }
  }
}

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;

  public Category: CategoryModel;

  public Budget: BudgetModel;
  public User: UserModel;
  public idGenerator: number;
  public googlePassportObj: GooglePassport;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection: string) {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.googlePassportObj = new GooglePassport();
    this.idGenerator = 102;

    this.Category = new CategoryModel(mongoDBConnection);
    this.Budget = new BudgetModel(mongoDBConnection);
    this.User = new UserModel(mongoDBConnection);
  }


  // Configure Express middleware.
  private middleware(): void {
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

  private async validateAuth(req, res, next): Promise<void> {
    if (req.isAuthenticated()) {
       console.log("user is authenticated"); 

       return next();
       }

    console.log("user is not authenticated");
    res.redirect('/');
  }

  private async createUser(user){
          console.log(await this.User.getUserByssoId(user.id))
           // const user = await this.User.getUserByssoId(userId.id)
   
           // if (user) {
           //   console.log("user exists"
   
           //   )
   
           // }
           // else {
           //   const email = (req['user'].emails.find(items => items.primary) || {}).value || null
           //   const photo = (req['user'].photos.find(items => items.primary) || {}).value || null
           //   const data = {
           //     email: email,
           //     displayName: req['user'].displayName,
           //     photo: photo,
           //     ssoId: req['user'].id
           //   }
           //   console.log("user does not exist. Creating one...")
           //   await this.User.model.create([data])
           //   console.log("user created successfully.")
           // }

  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    // Auth routes
    router.get('/auth/google',
      passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email']
      }));


    router.get('/auth/google/callback',
      passport.authenticate('google',
        { failureRedirect: '/' }
      ),
      async (req, res) => {
        console.log("successfully authenticated user and returned to callback page.");

        res.redirect('/#');
      }
    );

    // ********** CATEGORY ROUTES **********

    // get all categories   
    router.get('/app/category/', this.validateAuth, async (req, res) => {
      console.log('Query All Categories');
      await this.Category.retrieveAllCategories(res);
    });

    //get one category    
    router.get('/app/category/:categoryId', this.validateAuth, async (req, res) => {
      var id = parseInt(req.params.categoryId);
      console.log('Query to get one category with id:' + id);
      try {
        await this.Category.retrieveCategory(res, id);
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the category.' });
      }
    });

    // get count of all categories   
    router.get('/app/categorycount', this.validateAuth, async (req, res) => {
      console.log('Query the number of category elements in db');
      await this.Category.retrieveCategoryCount(res);
    });

    //create category  
    router.post('/app/category/', this.validateAuth, async (req, res) => {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
      var jsonObj = req.body;
      //jsonObj.listId = id;
      try {
        await this.Category.model.create([jsonObj]);
        //res.send('{"id""' + id + '"}');
        res.send(jsonObj.name + ' category created successfully')
      }
      catch (e) {
        console.error(e);
        console.log('object creation failed');
      }
    });

    // ********** BUDGET ROUTES **********

    //get all budget    
    router.get('/app/budget/', this.validateAuth, async (req, res) => {
      console.log('Query All budget');
      await this.createUser(req['user'])
      const user = await this.User.getUserByssoId(req['user']?.id)
      await this.Budget.retrieveAllBudget(user, req, res);
    });

    //get all budget-no auth  
    router.get('/app/budget-noauth/', async (req, res) => {
      console.log('Query All budget');
      const user = await this.User.getUserByssoId(req['user']?.id|| null)
      await this.Budget.retrieveAllBudget(user, req, res);
    });

    //get count of all budgets    
    router.get('/app/budgetcount', this.validateAuth, async (req, res) => {
      console.log('Query the number of budget elements in db');
      await this.Budget.retrieveBudgetCounts(res);
    });

    //get one budget
    router.get('/app/budget/:budgetId', this.validateAuth, async (req, res) => {
      var id = parseInt(req.params.budgetId);
      console.log('Query to get one category with id:' + id);
      try {
        await this.Budget.retrieveBudgetDetails(res, id);
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the category.' });
      }
    });

    //get one budget - no auth
    router.get('/app/budget-noauth/:budgetId', async (req, res) => {
      var id = parseInt(req.params.budgetId);
      console.log('Query to get one category with id:' + id);
      try {
        await this.Budget.retrieveBudgetDetails(res, id);
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the category.' });
      }
    });


    //create budget
    router.post('/app/budget/', this.validateAuth, async (req, res) => {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
      var jsonObj = req.body;
      

      try {
        const data = await this.Budget.model.create([jsonObj]);
        res.send(data)
      }
      catch (e) {
        console.error(e);
        console.log('object creation failed');
      }
    });


    //create budget no authentication
    router.post('/app/budget-noauth/', async (req, res) => {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
      var jsonObj = req.body;

      try {
        await this.Budget.model.create([jsonObj]);
        res.send(jsonObj)
      }
      catch (e) {
        console.error(e);
        console.log('object creation failed');
      }
    });

    //get current user details
    router.get('/app/currentuser', async (req, res) => {
      const user = await this.User.getUserByssoId(req['user']?.id)
      res.send(user)
    }
    )

    // get report 
    router.get('/app/report/', this.validateAuth, async (req, res) => {
      try {
        const user = await this.User.getUserByssoId(req['user']?.id)
        await this.Budget.reportByMonthYear(user, req, res);

      }
      catch (e) {
        console.error(e);
        console.log('something error');
      }
    })

    this.expressApp.use('/', router);

    this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
    this.expressApp.use('/images', express.static(__dirname + '/img'));
    // this.expressApp.use('/', express.static(__dirname+'/pages'));
    this.expressApp.use('/', express.static(__dirname + '/dist/frontend/browser'));

  }

}

export { App };