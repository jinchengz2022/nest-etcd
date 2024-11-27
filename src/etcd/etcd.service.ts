import { Injectable, Inject, Query, Get } from '@nestjs/common';
import { Etcd3 } from 'etcd3';

@Injectable()
export class EtcdService {
  @Inject('ETCD_CLIENT')
  private etcdClient: Etcd3;

  async get(key: string) {
    return await this.etcdClient.get(key).string();
  }

  async save(key: string, @Query('value') value: string) {
    await this.etcdClient.put(key).value(value);
    return 'done';
  }

  async delete(key: string) {
    await this.etcdClient.delete().key(key);
    return 'done';
  }

  async register(serviceName: string, instanceId: string, metadata: any) {
    const key = `/services/${serviceName}/${instanceId}`;
    const lease = this.etcdClient.lease(10);
    await lease.put(key).value(JSON.stringify(metadata));
    lease.on('lost', async () => {
      console.log('租约过期');
      await this.register(serviceName, instanceId, metadata);
    });
  }

  async discoverService(serviceName: string) {
    const instances = await this.etcdClient
      .getAll()
      .prefix(`/services/${serviceName}`);
    return instances;
  }

  async watchServices(serviceName: string, callback: (val: any) => void) {
    const watcher = await this.etcdClient.watch().prefix(serviceName).create();

    watcher
      .on('put', async (val) => {
        console.log(`新增节点：${val}`);
        callback(await this.discoverService(serviceName));
      })
      .on('delete', async (val) => {
        console.log(`删除节点：${val}`);
        callback(await this.discoverService(serviceName));
      });
  }
}
