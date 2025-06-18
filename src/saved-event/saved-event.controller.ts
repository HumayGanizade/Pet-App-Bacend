import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SavedEventService } from './saved-event.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('saved-event')
export class SavedEventController {
  constructor(private readonly eventService: SavedEventService) {}

  @Post('addEventToUser/:eventId/:eventTypeId')
  @UseGuards(JwtAuthGuard)
  addEventToUser(
    @Param('eventId') eventId: string,
    @Request() req: any,
    @Param('eventTypeId') eventTypeId: string,
  ) {
    return this.eventService.addEventToUser(eventId, req.user.id, eventTypeId);
  }

  @Delete('remove/:eventId/:eventTypeId')
  @UseGuards(JwtAuthGuard)
  removeEventFromUser(
    @Param('eventId') eventId: string,
    @Param('eventTypeId') eventTypeId: string,
    @Request() req: any,
  ) {
    return this.eventService.removeEventFromUser(
      eventId,
      req.user.id,
      eventTypeId,
    );
  }

  @Delete(':/eventId/:eventTypeId')
  @UseGuards(JwtAuthGuard)
  deleteEventFromUser(
    @Param('eventId') eventId: string,
    @Request() req: any,
    @Param('eventTypeId') eventTypeId: number,
  ) {
    return this.eventService.deleteEventFromUser(
      eventId,
      req.user.id,
      eventTypeId,
    );
  }

  @Get('getAllSavedEventsOfUserByEventTypeId/:eventTypeId')
  @UseGuards(JwtAuthGuard)
  getAllSavedEventsOfUserByEventTypeId(
    @Request() req: any,
    @Param('eventTypeId') eventTypeId: string,
  ) {
    return this.eventService.getAllSavedEventsOfUserByEventTypeId(
      req.user.id,
      eventTypeId,
    );
  }
}
