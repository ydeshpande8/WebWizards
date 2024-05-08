db = db.getSiblingDB('my_database')


// Create a collection for users
db.createCollection('users')
// users collection
usersCollection = db.getCollection("users")
// remove existing data
usersCollection.remove({})

// create new data for users
// Insert 10 users into the users collection
for (var i = 0; i < 10; i++) {
    usersCollection.insert({
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
        name: "Clothes",
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
        name: "Education",
        description: "This category will contain expenses and incomes on Education."
    }
);
db.createCollection('budget')
budgetList = db.getCollection("budget")
budgetList.deleteMany({})
budgetList.insertOne({
    userId : 1,
    budgetId : 1,
    categoryId : 1,
    type: "Income",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});

budgetList.insertOne({
    userId : 1,
    budgetId : 2,
    categoryId : 2,
    type: "Expense",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});

budgetList.insertOne({
    userId : 1,
    budgetId : 3,
    categoryId : 1,
    type: "Income",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});

budgetList.insertOne({
    userId : 1,
    budgetId : 4,
    categoryId : 1,
    type: "Income",
    amount: 10,
    date: new Date(),
    note: "Bartender"

});