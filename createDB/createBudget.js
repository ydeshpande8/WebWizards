db = db.getSiblingDB('my_database')
// Create a collection for users
db.createCollection('users')
// users collection
usersCollection = db.getCollection("users")
// remove existing data
usersCollection.deleteMany({})
// create new data for users
// Insert 10 users into the users collection
for (var i = 0; i < 10; i++) {
    usersCollection.insertOne({
        fname: "First" + (i + 1),
        lname: "Last" + (i + 1),
        email: "user" + (i + 1) + "@example.com", 
        password: "password" + (i + 1), userId : i +1
    });
}
db.createCollection('category')
categoryList = db.getCollection("category")
categoryList.deleteMany({})
categoryList.insertOne(
    {
        categoryId: 1,
        name: "Food",
        description: "This category will contain expenses and incomes on Food."
    }
);
categoryList.insertOne(
    {
        categoryId: 2,
        name: "Education",
        description: "This category will contain expenses and incomes on Clothes."
    }
);
categoryList.insertOne(
    {
        categoryId: 3,
        name: "Medical",
        description: "This category will contain expenses and incomes on Medical."
    }
);
categoryList.insertOne(
    {
        categoryId: 4,
        name: "Salary",
        description: "This category will contain expenses and incomes on Education."
    }
);
categoryList.insertOne(
    {
        categoryId: 4,
        name: "Bonus",
        description: "This category will contain expenses and incomes on Education."
    }
);
const userId = 1
const user_1 = usersCollection.findOne({userId : 1})
const user_2 = usersCollection.findOne({userId : 2})
const cat_1 = categoryList.findOne({categoryId : 1})
const cat_2 = categoryList.findOne({categoryId : 2})
const cat_3 = categoryList.findOne({categoryId : 3})
const cat_4 = categoryList.findOne({categoryId : 4})
const cat_5 = categoryList.findOne({categoryId : 5})
db.createCollection('budget')
budgetList = db.getCollection("budget")
budgetList.deleteMany({})
budgetList.insertOne({
    userId : user_1._id,
    categoryId : cat_1._id,
    budgetId : 1,
    type: "Income",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});

budgetList.insertOne({
    userId : user_1._id,
    categoryId : cat_3._id,
    budgetId : 2,
    type: "Expense",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});

budgetList.insertOne({
    userId : user_1._id,
    categoryId : cat_2._id,
    budgetId : 3,
    type: "Income",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});

budgetList.insertOne({
    userId : user_1._id,
    categoryId : cat_4._id,
    budgetId : 4,
    type: "Income",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});