const request = require('supertest');
const { User } = require('../../schema/users');
let server; 

describe('auth middleware', () => {

      beforeEach( () =>{
        server = require('../../initialize');
        token = new User().generateAuthToken();
    });

    afterEach( async () =>{
        await server.close();
    });

    let token; 

    const exec = ()  => {
     return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1'})
    }

    beforeEach( () =>{
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });
});