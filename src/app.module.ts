import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config'
import { NacosModule } from './nacos/nacos.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'src/.env'
  }), NacosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
