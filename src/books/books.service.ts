import { Injectable, ConflictException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany();
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
    });
  }

  public delete(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    try {
      return await this.prismaService.book.create({
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2008')
        throw new ConflictException('Name is already taken.');
      throw Error;
    }
  }

  public async update(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        where: { id },
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      throw error;
    }
  }
}
