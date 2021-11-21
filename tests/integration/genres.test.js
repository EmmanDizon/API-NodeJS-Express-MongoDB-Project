const request = require('supertest');
const { Genres } = require('../../schema/genre');
const { User } = require('../../schema/users');
const mongoose = require('mongoose');

let server; 


describe('/api/genres', () => {
    beforeEach( () =>{
        server = require('../../initialize');
    });

    afterEach( async () =>{
        await server.close();
        await Genres.remove({});
    });

    const exec = ()  => {
        return request(server)
               .post('/api/genres')
               .set('x-auth-token', token)
               .send({ name: 'genre1'})
       }
   

    describe('GET /', () => {
        it('should return all genres', async () => {
           await Genres.collection.insertMany([
                {name: ''},      
                {name: 'genre2'}      
            
            ]);
            const result = await request(server).get('/api/genres');

            expect(result.status).toBe(200);
            expect(result.body.length).toBe(2);


        })
    })

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genres({name: 'genre1'});
            await genre.save();

            const result = await request(server).get('/api/genres/' + genre._id);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('name', genre.name);
        })

        it('should return 404 if invalid id is passed', async () => {
            
            const result = await request(server).get('/api/genres/1');

            expect(result.status).toBe(404);
           // expect(result.body).toHaveProperty('name', genre.name);
        })
    })

    describe('POST /', () => {

        let token; 
        let name;

        const exec = async function() {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }

        beforeEach( () =>{
            token = new User().generateAuthToken();
        });

        it('should return 401 error if the client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        })

        it('should return 404 error if genre is less than 5 characters', async () => {
            name = '123'
            
            const result = await exec();
 
             expect(result.status).toBe(404);
         })

         it('should save the genre to the database if it is valid', async () => {
    
             await exec();

             const genre = Genres.find({name: 'gemre1'});
 
             expect(genre).not.toBeNull();
         })
    })

});