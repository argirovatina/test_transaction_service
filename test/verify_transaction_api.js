var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api_key = "aa0a34df13827f999a0d3e3daccede59"
    expired_transaction_id = "7133b3e2-622e-478f-9d36-06da29c6c66d"
    api = supertest('https://transaction-service.herokuapp.com');

    describe('Transaction service', function() {

    	var transaction_id;

    	before(function (done) {
    		api.post('/v1/transaction')
	    	.set('Api-Key', api_key)
	    	.send()
	    	.expect('Content-Type', /json/)
	        .expect(200)
	        .end(function (err, res) {
	        	expect(typeof res.body['transaction_id']).to.equal('string')
	        	expect(typeof res.body['ttl']).to.equal('number')
	        	expect(typeof res.body['created_date']).to.equal('string')
	         	transaction_id = res.body['transaction_id'];
	         	done();
	            })
    	})

    	it('should return a 200 response and body as JSON', function(done) {
	        api.get('/v1/transaction/' + transaction_id)
	        .set('Api-Key', api_key)
			.send()
			.expect(200)
	        .end(function (err, res) {
	         	expect(res.statusCode).to.equal(200)
	         	expect(res.type).to.equal('application/json')
	         	done();
	            });
		});

		it('should return status as string and details as object', function(done) {
			api.get('/v1/transaction/' + transaction_id)
	        .set('Api-Key', api_key)
			.send()
			.expect(200)
	        .end(function (err, res) {
	         	expect(typeof JSON.parse(res.text)['status']).to.equal('string')
	         	expect(typeof JSON.parse(res.text)['details']).to.equal('object')
	         	done();
	            });
		})

	    it('should return 401 when api key is incorrect', function(done) {
	    	api.get('/v1/transaction/' + transaction_id)
	        .set('Api-Key', '12345Q')
			.send()
			.expect(401)
	        .end(function (err, res) {
	         	expect(res.statusCode).to.equal(401)
	         	done();
	            })
	    })

	    it('should return 401 when api key is empty', function(done) {
	    	api.get('/v1/transaction/' + transaction_id)
	        .set('Api-Key', '')
			.send()
			.expect(401)
	        .end(function (err, res) {
	         	expect(res.statusCode).to.equal(401)
	         	done();
	            })
	    })

	  	it('should return 404 if transaction id not found (expired)', function(done) {
	  		api.get('/v1/transaction/' + expired_transaction_id)
	        .set('Api-Key', api_key)
			.send()
			.expect(404)
	        .end(function (err, res) {
	         	expect(res.statusCode).to.equal(404)
	         	done();
	         	});
	  })
})

