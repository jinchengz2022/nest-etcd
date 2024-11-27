import { Inject, Injectable } from '@nestjs/common';
import * as Nacos from 'nacos';

@Injectable()
export class NacosService {
  //   @Inject('NACOS_CLIENT')
  //   private nacosClient: Nacos.NacosNamingClient;

  async register(key: string, instance: any) {
    const client = new Nacos.NacosNamingClient({
      serverList: ['127.0.0.1:8848'],
      namespace: 'public',
      logger: console,
    });
    await client.ready();
    await client.registerInstance(key, instance);
    return 'done';
  }

  async deRegister(key: string, instance: any) {
    const client = new Nacos.NacosNamingClient({
      serverList: ['127.0.0.1:8848'],
      namespace: 'public',
      logger: console,
    });
    await client.ready();
    await client.deregisterInstance(key, instance);
    return 'done';
  }

  async getAllRegister(key: string) {
    const client = new Nacos.NacosNamingClient({
      serverList: ['127.0.0.1:8848'],
      namespace: 'public',
      logger: console,
    });
    await client.ready();
    return client.getAllInstances(key);
  }
}
