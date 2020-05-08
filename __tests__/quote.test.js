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

    xit('returns a 404 if the quote does not exist', done => {
      request(app)
        .get('/quotes/12345')
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The quote could not be found.');
          done();
        });
    });
  });

  describe('gets all ancient quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'Man is a social animal',
          author: 'Aristotle',
          category: 'Ancient',
        }),
        Quote.create({
          quote: 'The only thing I know, is that I know nothing',
          author: 'Socrates',
          category: 'Ancient',
        }),
        Quote.create({
          quote: 'Workers of the world, UNITE!',
          author: 'Karl Marx',
          category: 'Modern',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/ancient', () => {
      it('gets all ancient quotes', done => {
        request(app)
          .get('/quotes/ancient')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a.category === quote.category);
              // expect(quote.quote).toBe(expected.quote);
              // expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });
  });

  describe('gets all enlightenment quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'Common sense is not so common',
          author: 'Voltaire',
          category: 'Enlightenment',
        }),
        Quote.create({
          quote: 'Man is born free and everywhere he is in chains',
          author: 'Jean-Jacques Rousseau',
          category: 'Enlightenment',
        }),
        Quote.create({
          quote: 'History repeats itself: First as tragedy, second as farce',
          author: 'Karl Marx',
          category: 'Modern',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/enlightenment', () => {
      it('gets all enlightenment quotes', done => {
        request(app)
          .get('/quotes/enlightenment')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a.category === quote.category);
              // expect(quote.quote).toBe(expected.quote);
              // expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });
  });

  describe('gets all modern quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'God is dead',
          author: 'Nietzche',
          category: 'Modern',
        }),
        Quote.create({
          quote: 'Never has so much been owed by so few to so many',
          author: 'Winston Churchill',
          category: 'Modern',
        }),
        Quote.create({
          quote: 'One cannot step into the same river twice',
          author: 'Heraclitus',
          category: 'Ancient',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/modern', () => {
      it('gets all modern quotes', done => {
        request(app)
          .get('/quotes/modern')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a.category === quote.category);
              // expect(quote.quote).toBe(expected.quote);
              // expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });
  });

  describe('gets all artists quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'To be or not to be',
          author: 'William Shakespeare',
          category: 'Artists',
        }),
        Quote.create({
          quote: 'Neither a borrower nor a beggar be',
          author: 'William Shakespeare',
          category: 'Artists',
        }),
        Quote.create({
          quote: 'I think therefore I am',
          author: 'Descartes',
          category: 'Enlightenment',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/artists', () => {
      it('gets all artists quotes', done => {
        request(app)
          .get('/quotes/artists')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a.category === quote.category);
              // expect(quote.quote).toBe(expected.quote);
              // expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });
  });

  describe('gets all entrepreneurs quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote:
            'It’s fine to celebrate success but it is more important to heed the lessons of failure.',
          author: 'Bill Gates',
          category: 'Entrepreneurs',
        }),
        Quote.create({
          quote: 'I have not failed. I’ve just found 10,000 ways that won’t work.',
          author: 'Thomas Edison',
          category: 'Entrepreneurs',
        }),
        Quote.create({
          quote: 'Logic will get you from A to B. Imagination will take you everywhere',
          author: 'Albert Einstein',
          category: 'Scientists',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/entrepreneurs', () => {
      it('gets all entrepreneurs quotes', done => {
        request(app)
          .get('/quotes/entrepreneurs')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a.category === quote.category);
              // expect(quote.quote).toBe(expected.quote);
              // expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });
  });

  describe('gets all scientists quotes in the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'Intelligence is the ability to adapt to change.',
          author: 'Stephen Hawking',
          category: 'Scientists',
        }),
        Quote.create({
          quote: 'Be less curious about people and more curious about ideas',
          author: 'Marie Curie',
          category: 'Scientists',
        }),
        Quote.create({
          quote: 'Every child is an artist. The problem is how to remain an artist once we grow up',
          author: 'Pablo Picasso',
          category: 'Artists',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/scientists', () => {
      it('gets all scientists quotes', done => {
        request(app)
          .get('/quotes/scientists')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(quote => {
              const expected = quotes.find(a => a.category === quote.category);
              // expect(quote.quote).toBe(expected.quote);
              // expect(quote.author).toBe(expected.author);
              expect(quote.category).toBe(expected.category);
            });
            done();
          });
      });
    });
  });

  describe('gets a random ancient quote from the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'Man is a social animal',
          author: 'Aristotle',
          category: 'Ancient',
        }),
        Quote.create({
          quote: 'The only thing I know, is that I know nothing',
          author: 'Socrates',
          category: 'Ancient',
        }),
        Quote.create({
          quote: 'Workers of the world, UNITE!',
          author: 'Karl Marx',
          category: 'Modern',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/ancient/random', () => {
      it('gets all ancient quotes', done => {
        request(app)
          .get('/quotes/ancient/random')
          .then(res => {
            expect(res.body).toBeInstanceOf(Object);
            done();
          });
      });
    });
  });
});
