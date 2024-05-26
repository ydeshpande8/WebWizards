// Importing the Mongoose library for working with MongoDB.
import Mongoose = require("mongoose");

// Defining an interface IUserModel which extends Mongoose.Document.
// This interface represents the structure of a user document in the MongoDB collection.
interface IUserModel extends Mongoose.Document
{
    
    // Property for the user ID associated with the budget.
    userId : number;
    
    // Property for the user's first name.
    displayName : string;

    // Property for the user's email.
    email: string;

    photo : string;

    ssoId : string;
}

// Exporting the IUserModel interface for use in other parts of the application.
export {IUserModel};