import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RescueEventService } from './rescue-event.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RescueEventDto } from './dto/rescue-event.dto';

@Controller('rescue-event')
export class RescueEventController {
  constructor(private rescueEventService: RescueEventService) {}

  @Get('getAll')
  getAll() {
    return this.rescueEventService.getAll();
  }

  @Get('getById/:id')
  getById(@Param('id') id: string) {
    return this.rescueEventService.getById(id);
  }

  @Get('getAllByUserId/:id')
  getAllByUserId(@Param('id') id: string) {
    return this.rescueEventService.getAllByUserId(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: RescueEventDto, @Request() req) {
    return this.rescueEventService.create(dto, req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  editById(@Param('id') id: string, @Body() dto: RescueEventDto) {
    return this.rescueEventService.editById(id, dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.rescueEventService.deleteById(id);
  }
}
