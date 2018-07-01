/*global describe it*/
const should = require('chai').should(),
	{
		getRandomNumber,
		getRandomInt,
		getFakeAnswer,
		getRealAnswer,
		createQuestion
	} = require('../../app/webSocketConfig');

describe('home.js:', function(){
	let options = {
			operators : ['+', '-', '*', '/'],
			minValue : 1,
			maxValue : 10
		},
		max = 20,
		min = 10,
		randNum = getRandomNumber(max, min),
		randInt = getRandomInt(max, min),
		fakeNum = getFakeAnswer(),
		realNum = getRealAnswer(5, 3),
		question = createQuestion();

	describe('getRandomNumber()', function(){
		it(`should return a number between ${min} and ${max} (boundaries inclusive)`,
			function(done){

				should.exist(randNum);
				randNum.should.be.a('number');
				randNum.should.match(/^[0-9]{1,2}\.{0,1}[0-9]{0,2}$/);
				randNum.should.be.least(min);
				randNum.should.be.most(max);

				done();
			});
	});

	describe('getRandomInt()', function(){
		it(`should return an integer between ${min} and ${max} (boundaries inclusive)`, function(done){

			should.exist(randInt);
			randInt.should.be.a('number').that.is.equal(parseInt(randInt));
			randInt.should.be.least(min);
			randInt.should.be.most(max);

			done();
		});
	});

	// Test invoking getFakeAnswer() without operator
	describe('getFakeAnswer()', function(){
		it(`should return a number between ${options.minValue / options.maxValue} and ${options.maxValue / options.minValue} (boundaries inclusive)`,
			function(done){

				should.exist(fakeNum);
				fakeNum.should.be.a('number');
				fakeNum.should.match(/^[0-9]{1,2}\.{0,1}[0-9]{0,2}$/);
				fakeNum.should.be.least(options.minValue / options.maxValue);
				fakeNum.should.be.most(options.maxValue / options.minValue);

				done();
			});
	});

	// Test invoking getRealAnswer() without operator
	describe('getRealAnswer()', function(){
		it('should return 1.67', function(done){

			should.exist(realNum);
			realNum.should.be.equal(1.67);

			done();
		});
	});

	describe('createQuestion()', function(){
		it('should return an object with properties', function(done){

			should.exist(question);
			question.should.be.an('object');
			question.should.have.all.keys('operand1', 'operand2', 'operator', 'answer', 'expectedResponse');
			question.operator.should.be.oneOf(options.operators);
			question.expectedResponse.should.be.oneOf(['yes', 'no']);
			question.operand1.should.be.a('number');
			question.operand2.should.be.a('number');
			question.answer.should.be.a('number');

			done();
		});
	});
});

