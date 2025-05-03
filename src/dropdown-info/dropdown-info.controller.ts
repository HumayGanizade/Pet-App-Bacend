import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { DropdownInfoService } from './dropdown-info.service';

@Controller('dropdown-info')
export class DropdownInfoController {
  constructor(private dropdownInfoService: DropdownInfoService) {}

  @Post('createPet')
  createPet(@Body() body: { name: string }) {
    return this.dropdownInfoService.createPet(body);
  }

  @Get('pets')
  getAllPets() {
    return this.dropdownInfoService.getAllPets();
  }

  @Post('createBreedByPetId/:id')
  createBreedByPetId(@Param('id') id: string, @Body() body: { name: string }) {
    return this.dropdownInfoService.createBreedByPetId(id, body);
  }

  @Get('getAllBreedsByPetId/:id')
  getAllBreedsByPetId(@Param('id') id: string) {
    return this.dropdownInfoService.getAllBreedsByPetId(id);
  }

  @Get('getEventTypes')
  getEventTypes() {
    return this.dropdownInfoService.getEventTypes();
  }

  @Post('country')
  createCountry(@Body() body: { name: string }) {
    return this.dropdownInfoService.createCountry(body);
  }

  @Post('city')
  createCity(@Body() body: { name: string; countryId: string }) {
    const { name, countryId } = body;

    if (!name || !countryId) {
      throw new BadRequestException('Name and countryId are required');
    }

    return this.dropdownInfoService.createCity({ name, countryId });
  }

  @Get('getAllCountries')
  getAllCountries() {
    return this.dropdownInfoService.getAllCountries();
  }

  @Get('getAllCitiesByCountryId/:id')
  getAllCitiesByCountryId(@Param('id') id: string) {
    return this.dropdownInfoService.getAllCitiesByCountryId(id);
  }

  // @Get('getCountryById')
  // getCountryById(@Param('id') id: string) {
  //   return this.dropdownInfoService.getCountryById(id);
  // }
  //
  // @Get('getCityById')
  // getCityById(@Param('id') id: string) {
  //   return this.dropdownInfoService.getCityById(id);
  // }
  //
  // @Get('getPetById')
  // getPetById(@Param('id') id: string) {
  //   return this.dropdownInfoService.getPetById(id);
  // }
  //
  // @Get('getBreedById')
  // getPetById(@Param('id') id: string) {
  //   return this.dropdownInfoService.getPetById(id);
  // }
}
