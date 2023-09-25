import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Body,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found in a database...');
    return book;
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found in a database...');
    await this.booksService.delete(id);
    return { success: true };
  }

  @Post('/')
  async create(@Body() bookData: CreateBookDTO) {
    if (!bookData.authorId) {
      throw new NotFoundException('Author not found...');
    }
    return await this.booksService.create(bookData);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found in a database...');
    await this.booksService.update(id, bookData);
    return { success: true };
  }
}
