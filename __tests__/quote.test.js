const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Quote = require('../src/models/quote');

describe('/quotes', () => {
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

  describe('POST /quotes', () => {
    it('creates a new artist in the database', done => {
      request(app)
        .post('/quotes')
        .send({
          quote: 'Be yourself; everyone else is already taken.',
          author: 'Oscar Wilde',
          category: 'Artist',
        })
        .then(res => {
          expect(res.status).toBe(201);
          Quote.findById(res.body._id, (_, quote) => {
            expect(quote.quote).toBe('Be yourself; everyone else is already taken.');
            expect(quote.author).toBe('Oscar Wilde');
            expect(quote.category).toBe('Artist');
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
          quote: 'To be or not to be',
          author: 'William Shakespeare',
          category: 'Artist',
        }),
        Quote.create({
          quote: 'Imitation is the highest form of flattery',
          author: 'Oscar Wilde',
          category: 'Artist',
        }),
        Quote.create({
          quote: 'Do or do not: There is no try.',
          author: 'Master Yoda',
          category: 'Artist',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes', () => {
      it('gets all quotes', done => {
        request(app)
          .get('/quotes')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a._id.toString() === quote._id);
              expect(quote.quote).toBe(expected.quote);
              expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });

    describe('GET /quotes/random', () => {
      it('gets a random quote', done => {
        const quote = quotes[0];
        request(app)
          .get(`/quotes/random`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            done();
          });
      });
    });

    it('returns a 404 if the quote does not exist', done => {
      request(app)
        .get('/quotes/12345')
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The quote could not be found.');
          done();
        });
    });
  });

  // describe('with quotes in the database', () => {
  //   let quotes;
  //   beforeEach(done => {
  //     Promise.all([
  //       Quote.create({
  //         quote: 'Man is a social animal',
  //         author: 'Aristotle',
  //         category: 'Ancient',
  //       }),
  //       Quote.create({
  //         quote: 'The only thing I know, is that I know nothing',
  //         author: 'Socrates',
  //         category: 'Ancient',
  //       }),
  //       Quote.create({
  //         quote: 'Workers of the world, UNITE!',
  //         author: 'Karl Marx',
  //         category: 'Modern',
  //       }),
  //     ]).then(documents => {
  //       quotes = documents;
  //       done();
  //     });
  //   });

  //   describe('GET /quotes/ancient', () => {
  //     it('gets all  ancient quotes', done => {
  //       request(app)
  //         .get('/quotes/ancient')
  //         .then(res => {
  //           console.log(res);
  //           expect(res.status).toBe(200);
  //           expect(res.body.length).toBe(2);

  //           // res.body.forEach(quote => {
  //           //   const expected = quotes.find(a => a._id.toString() === quote._id);
  //           //   expect(quote.quote).toBe(expected.quote);
  //           //   expect(quote.author).toBe(expected.author);
  //           //   expect(quote.category).toBe(expected.category);
  //           // });
  //           done();
  //         });
  //     });
  //   });
  // });
});
