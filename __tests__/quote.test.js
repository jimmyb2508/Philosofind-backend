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
      it('gets a random ancient quote', done => {
        request(app)
          .get('/quotes/ancient/random')
          .then(res => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.category).toEqual('Ancient');
            done();
          });
      });
    });
  });

  describe('gets a random enlightenment quote from the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'What wisdom can you find that is greater than kindness?',
          author: 'Jean-Jacques Rousseau',
          category: 'Enlightenment',
        }),
        Quote.create({
          quote: 'I would never die for my beliefs because I might be wrong',
          author: 'Bertrand Russell',
          category: 'Modern',
        }),
        Quote.create({
          quote: 'All wealth is the product of labor.',
          author: 'John Locke',
          category: 'Enlightenment',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/enlightenment/random', () => {
      it('gets a random enlightenment quote', done => {
        request(app)
          .get('/quotes/enlightenment/random')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.category).toEqual('Enlightenment');
            done();
          });
      });
    });
  });

  describe('gets a random modern quote from the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote:
            'The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.',
          author: 'Bertrand Russell',
          category: 'Modern',
        }),
        Quote.create({
          quote: 'A lie told often enough becomes the truth.',
          author: 'Vladimir Lenin',
          category: 'Modern',
        }),
        Quote.create({
          quote: 'The duty of youth is to challenge corruption.',
          author: 'Kurt Cobain',
          category: 'Artists',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/modern/random', () => {
      it('gets a random modern quote', done => {
        request(app)
          .get('/quotes/modern/random')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.category).toEqual('Modern');
            done();
          });
      });
    });
  });

  describe('gets a random artists quote from the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'Practise what you know, and it will help to make clear what now you do not know.',
          author: 'Rembrandt Van Rijn',
          category: 'Artists',
        }),
        Quote.create({
          quote: 'Everything you can imagine is real.',
          author: 'Pablo Picasso',
          category: 'Artists',
        }),
        Quote.create({
          quote:
            'Perhaps it is good to have a beautiful mind, but an even greater gift is to discover a beautiful heart!',
          author: 'John Nash',
          category: 'Scientists',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/artists/random', () => {
      it('gets a random artists quote', done => {
        request(app)
          .get('/quotes/artists/random')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.category).toEqual('Artists');
            done();
          });
      });
    });
  });

  describe('gets a random entrepreneurs quote from the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: 'The Internet is becoming the town square for the global village of tomorrow.',
          author: 'Bill Gates',
          category: 'Entrepreneurs',
        }),
        Quote.create({
          quote: `Love is when the other person's happiness is more important than your own.`,
          author: 'Kylie Jenner',
          category: 'Entrepreneurs',
        }),
        Quote.create({
          quote: 'The two most powerful warriors are patience and time.',
          author: 'Leo Tolstoy',
          category: 'Artists',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/entrepreneurs/random', () => {
      it('gets a random entrepreneurs quote', done => {
        request(app)
          .get('/quotes/entrepreneurs/random')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.category).toEqual('Entrepreneurs');
            done();
          });
      });
    });
  });

  describe('gets a random scientists quote from the database', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: `We're made of star stuff. We are a way for the cosmos to know itself.`,
          author: 'Carl Sagan',
          category: 'Scientists',
        }),
        Quote.create({
          quote: `For small creatures such as we the vastness is bearable only through love.`,
          author: 'Carl Sagan',
          category: 'Scientists',
        }),
        Quote.create({
          quote:
            'If the doors of perception were cleansed everything would appear to man as it is, infinite.',
          author: 'William Blake',
          category: 'Artists',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/scientists/random', () => {
      it('gets a random scientists quote', done => {
        request(app)
          .get('/quotes/scientists/random')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.category).toEqual('Scientists');
            done();
          });
      });
    });
  });

  describe('gets all the quotes for a given author', () => {
    let quotes;
    beforeEach(done => {
      Promise.all([
        Quote.create({
          quote: `Each problem that I solved became a rule, which served afterwards to solve other problems`,
          author: 'Renee Descartes',
          category: 'Enlightenment',
        }),
        Quote.create({
          quote: `Science knows no country, because knowledge belongs to humanity, and is the torch which illuminates the world`,
          author: 'Louis Pasteur',
          category: 'Scientists',
        }),
        Quote.create({
          quote: `Most people say that it is intellect which makes a great scientist. They are wrong: it is character`,
          author: 'Albert Einstein',
          category: 'Scientists',
        }),
        Quote.create({
          quote: `To raise new questions, new possibilities, to regard old problems from a new angle, requires creative imagination and marks real advance in science`,
          author: 'Albert Einstein',
          category: 'Scientists',
        }),
        Quote.create({
          quote: `Science never solves a problem without creating ten more`,
          author: 'George Bernard Shaw',
          category: 'Artists',
        }),
        Quote.create({
          quote: 'It is greed to do all the talking but not to want to listen at all',
          author: 'Democritus',
          category: 'Ancient',
        }),
      ]).then(documents => {
        quotes = documents;
        done();
      });
    });

    describe('GET /quotes/author', () => {
      it('gets all quotes for specified author', done => {
        request(app)
          .get(`/quotes/author`)
          .then(res => {
            console.log(res);
            console.log(res.status);
            console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
          });
      });
    });
  });
});
