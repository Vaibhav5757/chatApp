process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(require('chai-json-schema'));

chai.use(chaiHttp);

describe.skip('/GET users', () => {
    it('Should get all users', (done) => {
        chai.request("http://localhost:3000")
            .get("/users")
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                done();
            })
    })
});

// describe.skip('/POST', () => {

//     it('Should not save a user with invalid email', () => {
//         let user = {
//             name: 'Vaibhav',
//             email: 'invalidEmailString',
//             password: 'randomString'
//         }
//         chai.request("http://localhost:3000")
//             .post("/users/addUser")
//             .send(user)
//             .end((err, response) => {
//                 response.should.not.have.status(200);
//                 expect(response).to.have.property('error');
//             })
//     })

//     it('Should not save a user with password shorter than 3 characters', () => {
//         let user = {
//             name: 'Vaibhav',
//             email: 'random@email.com',
//             password: '11'
//         }
//         chai.request("http://localhost:3000")
//             .post("/users/addUser")
//             .send(user)
//             .end((err, response) => {
//                 response.should.not.have.status(200);
//                 expect(response).to.have.property('error');
//             })
//     })

//     it('Should not save a user with no name', () => {
//         let user = {
//             name: '',
//             email: 'random@email.com',
//             password: '11459'
//         }
//         chai.request("http://localhost:3000")
//             .post("/users/addUser")
//             .send(user)
//             .end((err, response) => {
//                 response.should.not.have.status(200);
//                 expect(response).to.have.property('error');
//             })
//     })

//     it('Must not login with invalid password', () => {
//         let user = {
//             email: 'vaibhav@gmail.com',
//             password: 'invalidpassword'
//         }
//         chai.request("http://localhost:3000")
//             .post("/users/logIn")
//             .send(user)
//             .end((err, response) => {
//                 response.should.have.status(400);
//                 expect(response).to.have.property('error');
//             })
//     })



// });

describe('/POST', () => {
    const expectedResponse = {
        type: 'object',
        required: ['error']
    }

    it('Expected Response Object', () => {
        let user = {
            name: 'marie',
            email: 'marie@gmail.com',
            password: 'password'
        }
        chai.request("http://localhost:3000")
            .post("users/addUser")
            .send(user)
            .end((err,response) => {
                console.log(response.body.data);
            })
    })
});

