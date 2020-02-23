const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Quote = require('../src/models/quote');
const Thinker = require('../src/models/thinker');

describe('/quotes', () => {
  let thinker;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Thinker.create(
      {
        name: 'Albert Einstein',
        discipline: 'Physicist',
      },
      (_, document) => {
        thinker = document;
        done();
      },
    );
  });

  afterEach(done => {
    Thinker.deleteMany({}, () => {
      Quote.deleteMany({}, () => {
        done();
      });
    });
  });

  afterAll(done => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  });

  describe('POST /thinkers/:thinkerId/quotes', () => {
    it('creates a new quote for a given thinker', done => {
      request(app)
        .post(`/thinkers/${thinker._id}/quotes`)
        .send({
          quote:
            'Insanity: doing the same thing over and over again and expecting different results.',
          mood: 1,
        })
        .then(res => {
          expect(res.status).toBe(201);

          Quote.findById(res.body._id, (err, quote) => {
            expect(err).toBe(null);
            expect(quote.quote).toBe(
              'Insanity: doing the same thing over and over again and expecting different results.',
            );
            expect(quote.mood).toBe(1);
            expect(quote.thinker).toEqual(thinker._id);
            done();
          });
        });
    });

    it('returns a 404 and does not create a quote if the thinker does not exist', done => {
      request(app)
        .post('/thinkers/1234/quotes')
        .send({
          quote:
            'Insanity: doing the same thing over and over again and expecting different results.',
          mood: 1,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('This thinker could not be found.');

          Quote.find({}, (err, quotes) => {
            expect(err).toBe(null);
            expect(quotes.length).toBe(0);
            done();
          });
        });
    });
  });

  describe('with quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'In the middle of difficulty lies opportunity.',
          mood: 1 })]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes', () => {
      it('gets all quotes', done => {
        request(app)
          .get('/quotes')
          .then(res => {
            console.log(res.body);
            expect(res.status).toBe(200);
            // expect(res.body.length).toBe(1);
            // // expect(res.body.quote).toBe(quotes.quote);
            // // expect(res.body.mood).toBe(quotes.mood);
          });
        done();
      });
    });
  });
});
