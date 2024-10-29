import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import utils from './utils.js';

class PluginMenu extends EventEmitter {
  constructor(){
    super();

    this.plugins = {}
    this.getList()
  }

  getList(){
    
      try {

        this.plugins = {}
        // 定义plugins文件夹的路径
        const pluginsDir = utils.getRootPath()+'/static/plugins';

        // 同步读取plugins文件夹下的所有子文件夹
        const files = fs.readdirSync(pluginsDir);

        // 遍历所有子文件夹
        files.forEach(file => {
            const filePath = path.join(pluginsDir, file);

            // 同步检查是否为文件夹并且以'ulanziPlugin'结尾
            const stats = fs.statSync(filePath);
            if (stats.isDirectory() && file.endsWith('ulanziPlugin')) {
              // console.log('===file',file)
                // 构造manifest.json的完整路径
                const manifestPath = path.join(filePath, 'manifest.json');

                // 同步读取manifest.json文件
                const data = fs.readFileSync(manifestPath, 'utf8');

                // 解析JSON数据
                const manifest = JSON.parse(data);

                try{
                  const zhPath = path.join(filePath, 'zh_CN.json');
                  const zhData = fs.readFileSync(zhPath, 'utf8');
                  manifest.zhData = JSON.parse(zhData);
                }catch(err){
                  console.log('===get zh err',err)
                }

                this.plugins[file] = manifest;
            }
        });
        // console.log('===plugins',this.plugins)
        this.emit('listUpdated', this.plugins)
      } catch (err) {
        console.error('An error occurred:', err);
      }
  }



}

const menu = new PluginMenu();
export default menu;