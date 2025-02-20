import { Controller, Get, Param } from '@nestjs/common';
import { DropdownInfoService } from './dropdown-info.service';

@Controller('dropdown-info')
export class DropdownInfoController {
  constructor(private dropdownInfoService: DropdownInfoService) {}

  @Get('pets')
  getAllPets() {
    return this.dropdownInfoService.getAllPets();
  }

  @Get('pets')
  getAllPetsByCategoryId(@Param('id') id: number) {
    return this.dropdownInfoService.getAllPetsByCategoryId(id);
  }

  @Get('pets')
  getAllTypes() {
    return this.dropdownInfoService.getAllTypes();
  }
}
