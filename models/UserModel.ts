import * as Mongoose from "mongoose";
import { IUserModel } from "../interfaces/IUserModel";
import { DataAccess } from "../DataAccess";

let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class UserModel {
    public schema : any;
    public model : any;
    public dbConnectionString : string;
    
    public constructor(dbConnectionString : string) 
    {
        this.dbConnectionString = dbConnectionString;
        this.createSchema();
        this.createModel();
    }

    public async createModel() 
    {
        try{
            this.model = mongooseConnection.model<IUserModel>("Users", this.schema)
        }
        catch(e){
            console.error(e)
        }
    }

    public createSchema(): void
    {
        this.schema = new Mongoose.Schema(
            {
                fname : String,
                lname : String,
                email : String,
                password : String
            }, { collection : "users" });
    }

    public getAllUsers(response : any)
    {
        console.log("Get all users")
        var query = this.model.find({})
        query.exec((error,itemArray)=>{response.json(itemArray)})
    }
    

    public async getUserById(id: string, response: any) {
        try {
            const user = await this.model.findById(id);
            if (!user) {
                response.status(404).json({ message: 'User not found' });
            } else {
                response.json(user);
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    public async updateUserById(id: string, userData: Partial<IUserModel>, response: any) {
        try {
            const user = await this.model.findByIdAndUpdate(id, userData, { new: true });
            if (!user) {
                response.status(404).json({ message: 'User not found' });
            } else {
                response.json(user);
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

}
export{UserModel}