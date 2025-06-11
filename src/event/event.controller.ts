import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EditEventDto } from './dto/edit-event.dto';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  createEventByUserId(@Body() dto: CreateEventDto, @Param('id') id: string) {
    return this.eventService.createEvent(dto, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  editEventById(@Body() dto: EditEventDto, @Param('id') id: string) {
    return this.eventService.editEventById(dto, id);
  }

  @Get()
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('getEventById/:id')
  getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @Get('getAllEventsByUserId/:id')
  getAllEventsByUserId(@Param('id') id: string) {
    return this.eventService.getAllEventsByUserId(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteEventById(@Param('id') id: string) {
    return this.eventService.deleteEventById(id);
  }

  @Get('getFilteredEvents')
  async getFilteredEvents(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('countryId') countryId?: string,
    @Query('cityId') cityId?: string,
    @Query('petsIds') petsIds?: string,
    @Query('breedIds') breedIds?: string,
    @Query('name') name?: string,
  ) {
    const parsedAnimalIds = petsIds
      ? petsIds.split(',').filter((id) => id)
      : [];

    const parsedBreedIds = breedIds
      ? breedIds.split(',').filter((id) => id)
      : [];

    return this.eventService.getFilteredEvents({
      startDate,
      endDate,
      type: type && type.trim() !== '' ? String(type) : null,
      minPrice: minPrice && minPrice.trim() !== '' ? Number(minPrice) : null,
      maxPrice: maxPrice && maxPrice.trim() !== '' ? Number(maxPrice) : null,
      countryId,
      cityId,
      petsIds: parsedAnimalIds,
      breedIds: parsedBreedIds,
      name,
    });
  }
}
