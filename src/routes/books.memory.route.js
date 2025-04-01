

const books = [];

async function booksMemoryRoute(fastify, options) {

  fastify.get('/', async (request, reply) => {
    reply.code(200).send(books);
  });

  const getBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };

  fastify.get('/:id', { schema: getBookSchema }, async (request, reply) => {
    const { id } = request.params;
    const book = books.find((b) => b.id === id);

    if (!book) {
      return reply.code(404).send({ error: 'Book not found' });
    }

    reply.code(200).send(book);
  });

  const createBookSchema = {
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.post('/', { schema: createBookSchema }, async (request, reply) => {
    const { title, author } = request.body;
    const newBook = {id:books.length , title: title, author: author };
    books.push(newBook);
    reply.code(201).send(newBook);
  });

  const updateBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.put('/:id', { schema: updateBookSchema }, async (request, reply) => {
    const { id } = request.params;
    const { title, author } = request.body;

    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      return reply.code(404).send({ error: 'Book not found' });
    }

    books[bookIndex] = { id, title, author };
    reply.code(200).send(books[bookIndex]);
  });

  const deleteBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };

  fastify.delete('/:id', { schema: deleteBookSchema }, async (request, reply) => {
    const { id } = request.params;
    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      return reply.code(404).send({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    reply.code(204).send();
  });
}

export default booksMemoryRoute;
