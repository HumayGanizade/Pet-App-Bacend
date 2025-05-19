import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { LostAnimalEventService } from './lost-animal-event.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateLostAnimalEventDto } from './dto/create-lost-animal-event.dto';

@Controller('lost-animal-event')
export class LostAnimalEventController {
  constructor(private lostAnimalEventService: LostAnimalEventService) {}

  @Get()
  getAll() {
    return this.lostAnimalEventService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.lostAnimalEventService.getById(id);
  }

  @Get('getAllByUserId/:id')
  getAllByUserId(@Param('id') id: string) {
    return this.lostAnimalEventService.getAllByUserId(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateLostAnimalEventDto, @Request() req: any) {
    return this.lostAnimalEventService.create(dto, req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  editById(@Body() dto, @Param('id') id: string) {
    return this.lostAnimalEventService.editById(dto, id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.lostAnimalEventService.deleteById(id);
  }
}
