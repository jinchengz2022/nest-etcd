import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Etcd3 } from 'etcd3';
import { EtcdService } from 'src/etcd/etcd.service';
import { NacosService } from 'src/nacos/nacos.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EtcdService)
  private etcdService: EtcdService;

  @Inject(NacosService)
  private nacosService: NacosService;

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('save')
  async save(@Query('key') key: string, @Query('value') value: string) {
    await this.etcdService.save(key, value)
    return 'done';
  }

  @Get('getConfig')
  async getConfig(@Query('key') key: string) {
    const res = await this.etcdService.get(key)
    return res;
  }

  @Post('saveNacos')
  saveNacos(@Body() params: any) {
    return this.nacosService.register(params.key, params.instance);
  }

  @Post('delNacos')
  delNacos(@Body() params: any) {
    return this.nacosService.deRegister(params.key, params.instance);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
