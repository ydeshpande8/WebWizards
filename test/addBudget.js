var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;

var http = require('http');
chai.use(chaiHttp);

describe('Test add budget result', function () {

	var requestResult;
	var response;

    const budgetEntry = {
        "categoryId":"664d42399c5ccb86f746fe0a",
        "userId":"664531c188d1ad588b6f3808",
        "amount" : 80,
        "date" : "05-22-2024",
        "note" : "test third entry",
        "type": "Expense"
    }
		 
    before(function (done) {
        chai.request("http://localhost:8080")
			.post("/app/budget")
            .send(budgetEntry)
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return success message in an object', function (){
		expect(response.body).to.not.be.a.string;
		expect(response.body).to.have.a.property('message').that.equals('Budget for type Expense created successfully');
    });
});