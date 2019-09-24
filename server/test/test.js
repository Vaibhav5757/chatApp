process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(require('chai-json-schema'));

chai.use(chaiHttp);

describe('/GET users', () => {
    const expectedResponseForGet = {
        type: 'object',
        required: ['status', 'data'],
        properties: {
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['name', 'email', 'id', 'password', 'timestamp']
                }
            }
        }
    }

    it('Should get all users', (done) => {
        chai.request("http://localhost:3000")
            .get("/users")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.jsonSchema(expectedResponseForGet);
                done();
            })
    })
});

describe('/POST', () => {
    const expectedResponseForBadRequest = {
        type: 'object',
        required: ['error', 'status']
    }

    const expectedResponseForGoodRequest = {
        type: 'object',
        required: ['data', 'status']
    }

    it('Should not save a user with invalid email', () => {
        let user = {
            name: 'Vaibhav',
            email: 'invalidEmailString',
            password: 'randomString'
        }
        chai.request("http://localhost:3000")
            .post("/users/addUser")
            .send(user)
            .end((err, response) => {
                expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);
            })
    })

    it('Should not save a user with password shorter than 3 characters', () => {
        let user = {
            name: 'Vaibhav',
            email: 'random@email.com',
            password: '11'
        }
        chai.request("http://localhost:3000")
            .post("/users/addUser")
            .send(user)
            .end((err, response) => {
                expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);
            })
    })

    it('Should not save a user with no name', () => {
        let user = {
            name: '',
            email: 'random@email.com',
            password: '11459'
        }
        chai.request("http://localhost:3000")
            .post("/users/addUser")
            .send(user)
            .end((err, response) => {
                expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);
            })
    })

    it('Must not login with invalid password', () => {
        let user = {
            email: 'vaibhav@gmail.com',
            password: 'invalidpassword'
        }
        chai.request("http://localhost:3000")
            .post("/users/logIn")
            .send(user)
            .end((err, response) => {
                expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);
            })
    })

    it('Expected Response Object for adding a new user', () => {
        /*Modify the user variable for every new user*/
        let user = {
            name: 'marie',
            email: 'marie@gmail.com',
            password: 'password'
        }
        chai.request("http://localhost:3000")
            .post("/users/addUser")
            .send(user)
            .end((err, response) => {
                expect(response.body.status).to.equal(false); // If user already exists response should have status false
                // expect(response.body.status).to.equal(true); //If user is not existing response should be true

                expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);// If User already exists
                // expect(response.body).to.be.jsonSchema(expectedResponseForGoodRequest);// If User does not exist
            })
    })

    it('Expected Response Object for logging in', () => {
        /*  Modify the user variable as per test case   */

        let user = {
            email: 'vaibhav@gmail.com',
            password: 'password'
        }
        chai.request("http://localhost:3000")
            .post("/users/logIn")
            .send(user)
            .end((err, response) => {
                // expect(response.body.status).to.equal(false); // If login credentials are not correct or user does not exist
                expect(response.body.status).to.equal(true); // If login credentials are correct and user exists in database

                // expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);// If login credentials are not correct or user does not exist
                expect(response.body).to.be.jsonSchema(expectedResponseForGoodRequest);// If login credentials are correct
            })
    })

    it('Expected response for forgot Password', () => {
        let user = {
            email: 'invalidmail@gmail.com'
        }
        chai.request("http://localhost:3000")
            .post("/users/forgotPassword")
            .send(user)
            .end((err, response) => {
                expect(response.body.status).to.equal(false); // If user with this email does not exists
                // expect(response.body.status).to.equal(true); // If user with this email exists

                expect(response.body).to.be.jsonSchema(expectedResponseForBadRequest);// If user with this email does not exists
                // expect(response.body).to.be.jsonSchema(expectedResponseForGoodRequest); // If user with this email exists
            })
    })

    it('Expected response for reset Password', () => {
        /*              TEST will fail because no token is provided         */
        let user = {
            password:'some password',
            confirmPassword: 'some password'
        }
        chai.request("http://localhost:3000")
            .post("/users/resetPassword")
            .send(user)
            .end((err, response) => {
                expect(response).to.be.undefined; //There will be no response to a request without valid token
            })
    })

});
