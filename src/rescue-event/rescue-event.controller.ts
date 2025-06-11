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
  Query,
} from '@nestjs/common';
import { RescueEventService } from './rescue-event.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RescueEventDto } from './dto/rescue-event.dto';
import { RescueEventFilterDto } from './dto/rescue-event-filter.dto';

@Controller('rescue-event')
export class RescueEventController {
  constructor(private rescueEventService: RescueEventService) {}

  @Get('getAll')
  getAll(@Query() filter: RescueEventFilterDto) {
    return this.rescueEventService.getAll(filter);
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
  create(@Body() dto: RescueEventDto, @Request() req: any) {
    return this.rescueEventService.create(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  editById(@Param('id') id: string, @Body() dto: RescueEventDto) {
    return this.rescueEventService.editById(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.rescueEventService.deleteById(id);
  }
}
