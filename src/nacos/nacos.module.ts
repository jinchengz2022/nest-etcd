import { Module } from '@nestjs/common';
import { NacosService } from './nacos.service';
import * as Nacos from 'nacos';

@Module({
  providers: [NacosService],
  exports: [NacosService],
})
export class NacosModule {}
