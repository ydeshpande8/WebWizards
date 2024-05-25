var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;

var http = require('http');
chai.use(chaiHttp);

describe('Test get reports result', function () {

	var requestResult;
	var response;
		 
    before(function (done) {
        chai.request("http://localhost:8080")
			.get("/app/report")
            .query({month: 5, year:2024})
			.end(function (err, res) {
				requestResult = res.body;
				response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
				done();
			});
        });
    
    it('Should return an array object with 2 objects', function (){
		expect(response).to.have.status(200);
		expect(response.body).to.have.length(2);
		expect(response).to.have.headers;
    });
    
	it('The first entry in the array has total income amount ', function(){
	    expect(requestResult[0]).to.have.property('totalAmount').that.is.a('number');
	    expect(requestResult[0]).to.have.property('type').that.equals('Income');
		expect(response.body).to.not.be.a.string;
	});

    it('The second entry in the array has total expense amount ', function(){
	    expect(requestResult[1]).to.have.property('totalAmount').that.is.a('number');
	    expect(requestResult[1]).to.have.property('type').that.equals('Expense');
		expect(response.body).to.not.be.a.string;
	});
});