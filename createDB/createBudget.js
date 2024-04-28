db = db.getSiblingDB('my_database')
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
budgetList.insertOne(
    {
        categoryId : 1,
        budgets : 
        [
            {
                budgetId: 1,
                type: "Expense",
                amount: 100,
                date: new Date(),
                note: "Restaurant Bill"
            },
            {
                budgetId: 2,
                type: "Income",
                amount: 10,
                date: new Date(),
                note: "Bartender"
            },
            {
                budgetId: 3,
                type: "Expense",
                amount: 150,
                date: new Date(),
                note: "Groceries Bill"
            }
        ]
    });
budgetList.insertOne(
    {
        categoryId : 2,
        budgets : 
        [
            {
                budgetId: 1,
                type: "Expense",
                amount: 50,
                date: new Date(),
                note: "Shopping"
            },
            {
                budgetId: 2,
                type: "Income",
                amount: 500,
                date: new Date(),
                note: "E-commerce Sales"
            }
        ]
    });
budgetList.insertOne(
    {
        categoryId : 3,
        budgets : 
        [
            {
                budgetId: 1,
                type: "Expense",
                amount: 50,
                date: new Date(),
                note: "Dentist Treatment"
            }
        ]
    });
budgetList.insertOne(
    {
        categoryId : 4,
        budgets : 
        [
            {
                budgetId: 1,
                type: "Expense",
                amount: 35518,
                date: new Date(),
                note: "Tution Fees"
            }
        ]
    });
