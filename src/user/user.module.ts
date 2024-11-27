import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EtcdService } from 'src/etcd/etcd.service';
import { EtcdModule } from 'src/etcd/etcd.module';
import { ConfigService } from '@nestjs/config';
import { NacosModule } from 'src/nacos/nacos.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    EtcdModule.forRootAsync({
      async useFactory(configService: ConfigService) {
        return {
          hosts: configService.get('etcd_hosts'),
          auth: {
            username: configService.get('etcd_username'),
            password: configService.get('etcd_password'),
          },
        };
      },
      inject: [ConfigService]
    }),
    NacosModule
  ],
})
export class UserModule {}
