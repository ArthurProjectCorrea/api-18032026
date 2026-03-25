import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { PermissionsGuard } from '@/auth/permissions.guard';
import { CheckPermissions } from '@/auth/permissions.decorator';
import { SCREENS, ACTIONS } from '@/common/constants/permissions';

@Controller('users')
@UseGuards(AuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPermissions(SCREENS.USERS, ACTIONS.CREATE)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPermissions(SCREENS.USERS, ACTIONS.VIEW)
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @CheckPermissions(SCREENS.USERS, ACTIONS.DELETE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
