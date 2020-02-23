const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Thinker = require('../src/models/thinker');

describe('/thinker', () => {
  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  afterEach(done => {
    Thinker.deleteMany({}, () => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /thinkers', () => {
    it('creates a new thinker in the database', done => {
      request(app)
        .post('/thinkers')
        .send({
          name: 'Prof. Stephen Hawking',
          discipline: 'Physics',
        })
        .then(res => {
          expect(res.status).toBe(201);
          Thinker.findById(res.body._id, (_, thinker) => {
            expect(thinker.name).toBe('Prof. Stephen Hawking');
            expect(thinker.discipline).toBe('Physics');
            done();
          });
        });
    });
  });

  describe('retrieve thinkers in the database', () => {
    let thinkers;
    beforeEach(done => {
      Promise.all([
        Thinker.create({
          name: 'Albert Einstein',
          discipline: 'Physics',
        }),
        Thinker.create({
          name: 'Prof. Brian Cox',
          discipline: 'Physics',
        }),
        Thinker.create({
          name: 'Dr. Carl Sagan',
          discipline: 'Physics',
        }),
      ]).then(documents => {
        thinkers = documents;
        done();
      });
    });

    describe('GET /thinkers', () => {
      it('gets all quotes', done => {
        request(app)
          .get('/thinkers')
          .then(res => {
            expect(res.status).toBe(200);
            // console.log(res);
            expect(res.body.length).toBe(3);

            res.body.forEach(thinker => {
              // console.log(thinkers);
              // console.log(thinker);
              // console.log(thinker._id);
              const expected = thinkers.find(a => a._id.toString() === thinker._id);
              expect(thinker.name).toBe(expected.name);
              expect(thinker.discipline).toBe(expected.discipline);
            });
            done();
          });
      });
    });

    describe('GET /thinkers/:thinkerId', () => {
      it('gets thinker by id', done => {
        const thinker = thinkers[0];
        request(app)
          .get(`/thinkers/${thinker._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            // console.log(res);
            expect(res.body.name).toBe(thinker.name);
            expect(res.body.discipline).toBe(thinker.discipline);
            done();
          });
      });
    });

    it('returns a 404 if the thinker does not exist', done => {
      request(app)
        .get('/thinkers/12345')
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The thinker could not be found.');
          done();
        });
    });

    describe('PATCH /thinkers/:thinkerId', () => {
      it('updates thinkers discipline by id', done => {
        const thinker = thinkers[0];
        request(app)
          .patch(`/thinkers/${thinker._id}`)
          .send({ discipline: 'Astrophysicist' })
          .then(res => {
            expect(res.status).toBe(200);
            Thinker.findById(thinker._id, (_, updatedThinker) => {
              expect(updatedThinker.discipline).toBe('Astrophysicist');
              done();
            });
          });
      });

      it('returns a 404 if the thinker does not exist', done => {
        request(app)
          .patch('/thinkers/12345')
          .send({ discipline: 'Astrophysicist' })
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The thinker could not be found.');
            done();
          });
      });
    });

    describe('DELETE /thinkers/:thinkersId', () => {
      it('deletes thinkers record by id', done => {
        const thinker = thinkers[0];
        request(app)
          .delete(`/thinkers/${thinker._id}`)
          .then(res => {
            expect(res.status).toBe(204);
            Thinker.findById(thinker._id, (error, updatedThinker) => {
              expect(error).toBe(null);
              expect(updatedThinker).toBe(null);
              done();
            });
          });
      });
    });
  });
});
