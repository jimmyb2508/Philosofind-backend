const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Quote = require('../src/models/quote');

describe('/quote', () => {
  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  afterEach(done => {
    Quote.deleteMany({}, () => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /quote', () => {
    it('creates a new quote in the database', done => {
      request(app)
        .post('/quote')
        .send({
          name: 'Prof. Stephen Hawking',
          quote: "People won't have time for you if you are always angry or complaining.",
        })
        .then(res => {
          expect(res.status).toBe(201);
          Quote.findById(res.body._id, (_, quote) => {
            expect(quote.name).toBe('Prof. Stephen Hawking');
            expect(quote.quote).toBe(
              `People won't have time for you if you are always angry or complaining.`,
            );
            done();
          });
        });
    });
  });

  describe('with artists in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          name: 'Albert Einstein',
          quote:
            'Insanity: doing the same thing over and over again and expecting different results.',
        }),
        Quote.create({
          name: 'Prof. Brian Cox',
          quote: `The problem with today's world is that everyone believes they have the right to express their opinion AND have others listen to it.`,
        }),
        Quote.create({
          name: 'Dr. Carl Sagan',
          quote: `We're made of star stuff. We are a way for the cosmos to know itself.`,
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });
  });

  describe('GET /quote', () => {
    it('gets all quotes', done => {
      request(app)
        .get('/quote')
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(3);

          res.body.forEach(quotes => {
            const expected = quotes.find(a => a._id.toString() === quotes._id);
            expect(quotes.name).toBe(expected.name);
            expect(quotes.quote).toBe(expected.quote);
          });
          done();
        });
    });
  });
});
