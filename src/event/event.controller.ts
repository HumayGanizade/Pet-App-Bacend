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
    @Query('type') type?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('countryId') countryId?: string,
    @Query('cityId') cityId?: string,
    @Query('allAnimals') allAnimals?: string,
    @Query('animalIds') animalIds?: string,
    @Query('allBreeds') allBreeds?: string,
    @Query('breedIds') breedIds?: string,
  ) {
    const parsedAnimalIds = animalIds ? animalIds.split(',') : [];
    const parsedBreedIds = breedIds ? breedIds.split(',') : [];

    const isAllAnimals = allAnimals === 'true'; // Convert the string to boolean

    return this.eventService.getFilteredEvents({
      startDate,
      endDate,
      type: type ? Number(type) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      countryId,
      cityId,
      allAnimals: isAllAnimals, // Now it's a boolean flag
      animalIds: isAllAnimals ? [] : parsedAnimalIds, // If allAnimals is true, ignore animalIds
      allBreeds: allBreeds === 'true', // Convert the string to boolean
      breedIds: parsedBreedIds,
    });
  }
}
