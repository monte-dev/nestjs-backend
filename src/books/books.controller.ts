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
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { LikeBookDTO } from './dtos/like-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private usersService: UsersService,
  ) {}

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
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found in a database...');
    await this.booksService.delete(id);
    return { success: true };
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Body() bookData: CreateBookDTO) {
    if (!bookData.authorId) {
      throw new NotFoundException('Author not found...');
    }
    return await this.booksService.create(bookData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found in a database...');
    await this.booksService.update(id, bookData);
    return { success: true };
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async bookLike(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() likeBookDto: LikeBookDTO,
    @Request() req,
  ) {
    const userId = req.user.id;
    const bookId = likeBookDto.bookId;

    if (!(await this.booksService.getById(bookId))) {
      throw new NotFoundException('Book not found');
    }

    await this.booksService.likeBook(bookId, userId);
    return { success: true };
  }
}
