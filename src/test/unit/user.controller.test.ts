// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../src/app'); // Import the Express app

// chai.use(chaiHttp);
// const expect = chai.expect;

// describe('User Controller', () => {
//   it('should return a list of users', (done) => {
//     chai
//       .request(app)
//       .get('/api/users')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         done();
//       });
//   });

//   it('should create a new user', (done) => {
//     chai
//       .request(app)
//       .post('/api/users')
//       .send({ username: 'testuser', email: 'test@example.com' })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property('id');
//         done();
//       });
//   });

//   // Add more tests for user controller actions
// });