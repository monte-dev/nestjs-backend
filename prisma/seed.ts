import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

function getAuthors() {
  return [
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17252',
      name: 'John Steinbeck',
      country: 'USA',
    },
    {
      id: 'c920c7b9-a67d-4edb-8ce7-e3c9f3889e53',
      name: 'J. R. R. Tolkien',
      country: 'UK',
    },
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17254',
      name: 'George Orwell',
      country: 'UK',
    },
  ];
}

function getBooks() {
  return [
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17260',
      title: 'The Grapes of Wrath',
      rating: 4,
      price: 10,
      authorId: 'fd105551-0f0d-4a9f-bc41-c559c8a17252',
    },
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17261',
      title: 'The Lord of the Rings',
      rating: 5,
      price: 15,
      authorId: 'c920c7b9-a67d-4edb-8ce7-e3c9f3889e53',
    },
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17262',
      title: '1984',
      rating: 5,
      price: 12,
      authorId: 'fd105551-0f0d-4a9f-bc41-c559c8a17254',
    },
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17263',
      title: 'Animal Farm',
      rating: 4,
      price: 11,
      authorId: 'fd105551-0f0d-4a9f-bc41-c559c8a17254',
    },
    {
      id: 'fd105551-0f0d-4a9f-bc41-c559c8a17264',
      title: 'The Hobbit',
      rating: 4,
      price: 10,
      authorId: 'c920c7b9-a67d-4edb-8ce7-e3c9f3889e53',
    },
  ];
}

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.author.create({ data: author });
    }),
  );

  await Promise.all(
    getBooks().map(({ authorId, ...orderData }) => {
      return db.book.create({
        data: {
          ...orderData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    }),
  );
}

seed();
