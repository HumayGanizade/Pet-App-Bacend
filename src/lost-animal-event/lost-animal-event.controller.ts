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
  Query,
} from '@nestjs/common';
import { LostAnimalEventService } from './lost-animal-event.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateLostAnimalEventDto } from './dto/create-lost-animal-event.dto';

@Controller('lost-animal-event')
export class LostAnimalEventController {
  constructor(private lostAnimalEventService: LostAnimalEventService) {}

  @Get()
  getAll(
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('gender') gender?: string,
    @Query('colorId') colorId?: string,
    @Query('petId') petId?: string,
    @Query('breedIds') breedIds?: string,
    @Query('countryId') countryId?: string,
    @Query('cityId') cityId?: string,
    @Query('name') name?: string,
  ) {
    const parsedBreedIds = breedIds
      ? breedIds.split(',').filter((id) => id)
      : [];

    return this.lostAnimalEventService.getAll({
      name,
      minAge: minAge !== undefined ? Number(minAge) : undefined,
      maxAge: maxAge !== undefined ? Number(maxAge) : undefined,
      gender,
      colorId,
      petId,
      breedIds: parsedBreedIds,
      countryId,
      cityId,
    });
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  editById(@Body() dto: any, @Param('id') id: string) {
    return this.lostAnimalEventService.editById(dto, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.lostAnimalEventService.deleteById(id);
  }

  @Get('/getColors')
  getColors() {
    return this.lostAnimalEventService.getColors();
  }
}
