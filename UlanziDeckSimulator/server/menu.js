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
        const pluginsDir = utils.getRootPath()+'/plugins';

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

                  const languages = ['en', 'zh_CN', 'ja_JP', 'de_DE','zh_HK']
                  languages.forEach(language => {
                    const data = this.getLocalization(filePath, language);
                    if(data) manifest[language+'_DATA'] = data;
                  })
                  
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


  getLocalization(filePath,language){
    try{
      const trPath = path.join(filePath, language + '.json');
      const trData = fs.readFileSync(trPath, 'utf8');
      return JSON.parse(trData);
      
    }catch(err){ 
      console.log(`===get ${language} err:${err}`)
      return null
    }
  }



}

const menu = new PluginMenu();
export default menu;