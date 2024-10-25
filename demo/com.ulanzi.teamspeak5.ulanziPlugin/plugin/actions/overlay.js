
import { createSVGWindow } from 'svgdom'
import { SVG, registerWindow } from '@svgdotjs/svg.js';
import { Utils } from './plugin-common-node/index.js';


import fs from 'fs';
import axios from 'axios';

const window = createSVGWindow()
const document = window.document

// register window and document
registerWindow(window, document)


export default class OverlayUsers {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {}

    this.onActionEvents()
  }

  onActionEvents() {
    this.$TeamSpeak.on('talkinguser',(newState) => {
      this.setIcon()
    })
  }


  add(){
    this.setIcon()
  }

  run(){
    console.log('=-----overlay run')
  }

  setActive(){
    this.setIcon()
  }


  async setParams(params){
    console.log('overlay setParams',params)

  }


  async setIcon(){
    const list =  this.$TeamSpeak.globalData.talkingUsers && [...this.$TeamSpeak.globalData.talkingUsers] || []
    const icon = await this.generateMultiAvatarImage(list, list.length)
    this.$UD.setBaseDataIcon(this.context,icon)


    if(this.config.connectState != this.$TeamSpeak.TeamSpeakConnectState){
      this.updatePluginParams({connectState:this.$TeamSpeak.TeamSpeakConnectState})
    }
  }

  
  async generateMultiAvatarImage (urls, n){
    // one images takes up a little over 1/3 of the width (let's say 50px for now)
    // all images are cut into circles
    // images overlap by 1/3 of their radius
    // there will be a max of 6 images
    // the combination of all images will be centered in a square
    // the square will be 144 x 144

    if (urls.length > 6) {
      urls = urls.slice(0, 6);
    }

    const canvas_size = 200;
    const canvas_center = canvas_size / 2;
    const circle_radius = (canvas_size / 6) * 1.05;
    const single_offset = (circle_radius / 3) * 2;
    const double_offset = (circle_radius / 3) * 5;
    const line_shift = canvas_size * 0.05;

    const folderPath = Utils.getPluginPath()


    // create a list of images and their positions
    let images = [];
    for (let i = 0; i < urls.length; i++) {
      // position describes the center of the image
      let y = canvas_center + (urls.length > 3) * (i < 3 ? -single_offset : single_offset);
      let x = canvas_center;
      switch (urls.length) {
        case 1:
          break;
        case 2:
          x += i == 0 ? -single_offset : single_offset;
          break;
        case 3:
          x += i == 0 ? -double_offset : i == 1 ? 0 : double_offset;
          break;
        case 4:
        case 5:
        case 6:
          x += i % 3 == 0 ? -double_offset : i % 3 == 1 ? 0 : double_offset;
          x += i < 3 ? -line_shift : i < 6 ? 0 : line_shift;
          break;
      }

      let url = urls[i] || folderPath + "/assets/actions/overlay/default_profilepicture.png"
      // if(!url){
        
      // }

      const img = await this.loadImageToBase64(url);
      // console.warn('====ovelay url',url)
      images.push({
        img: img,
        x: x,
        y: y,
      });
    }

    // create a canvas
    
    //创建画布
    const draw = SVG(document.documentElement).size(canvas_size, canvas_size);

    // draw background fromfolderPath +  /assets/overlay/overlay_blank.png
    const bkgrd_image = await this.loadImageToBase64(folderPath + "/assets/actions/overlay/overlay_blank.png");
    draw.image(bkgrd_image).size(canvas_size, canvas_size).attr({ preserveAspectRatio: 'none' });

    // draw all images
    for (let i = 0; i < images.length; i++) {

      // draw gradient
      const pp_bkgrd_image = await this.loadImageToBase64(folderPath + "/assets/actions/overlay/default_gradient.png");
      let x = images[i].x - circle_radius;
      let y = images[i].y - circle_radius;
      let w = circle_radius * 2;
      let h = circle_radius * 2;



      // 创建第一个圆形
      const circle1 = draw.circle(w).move(x, y);
      // 创建第二个圆形
      const circle2 = draw.circle(w).move(x, y);

      // 使用圆形作为裁剪路径
      const clip1 = draw.clip().add(circle1.clone());
      const clip2 = draw.clip().add(circle2.clone());

      // 创建图片元素并应用裁剪路径
      const image1 = draw.image(pp_bkgrd_image).size(w, h).move(x, y).clipWith(clip1);
      const image2 = draw.image(images[i].img).size(w, h).move(x, y).clipWith(clip2);

      // 调整图片的位置使其与圆形对齐
      image1.center(circle1.cx(), circle1.cy());
      image2.center(circle2.cx(), circle2.cy());
    }

  
    const textName = draw.text(n).font({
      // family: 'Source Han Sans',
      size: '24px',
      weight: 'bold',
      fill: '#fff',
      textBaseline:"top",
      textAlign:"left"
    });
    textName.move(10, 30);


    // 生成 SVG 内容
    const svgContent = draw.svg();


    // 将 SVG 内容转换为 base64
    const base64Svg = Buffer.from(svgContent).toString('base64');
    const resultBase64 = 'data:image/svg+xml;base64,' + base64Svg;
    
    // 清空画布
    draw.clear();

    return resultBase64;
  };

  


 extractKeyFromPath(path) {
    const parts = path.split('/').filter(Boolean); // 过滤掉可能存在的空字符串
    if (parts.length < 2) {
        throw new Error('路径至少需要包含两部分');
    }
    return parts.slice(-2).join('__');
}

/**
 * 将图片转换为Base64编码
 * @param {string} imagePath - 图片路径（可以是本地路径或远程URL）
 * @returns {Promise<string>} 返回Base64编码的Promise
 */
async convertToBase64(imagePath) {
    if (imagePath.startsWith('http')) {
        // 处理远程图片
        const response = await axios({
            method: 'get',
            url: imagePath,
            responseType: 'arraybuffer'
        });
        return 'data:image/jpeg;base64,'+Buffer.from(response.data).toString('base64');
    } else {
        // 处理本地图片
        const imgData = fs.readFileSync(imagePath);
        return 'data:image/jpeg;base64,'+imgData.toString('base64');
    }
}


  async loadImageToBase64(imagePath){

    try {
      const key = this.extractKeyFromPath(imagePath);
      
      // 检查Map中是否已经存在
      if (this.$TeamSpeak.baseImgCache.has(key)) {
          console.log(`Image ${key} already exists in map.`);
          return this.$TeamSpeak.baseImgCache.get(key);
      }

      const base64 = await this.convertToBase64(imagePath);
      this.$TeamSpeak.baseImgCache.set(key, base64);
      console.log(`Image ${key} added to map.`);

      return base64
  } catch (error) {
      console.error(`Failed to process image at path ${imagePath}:`, error);
  }
	}


  updatePluginParams(params){
    if(!params) return 
    this.config = {
      ...this.config,
      ...params
    }
    this.$UD.sendParamFromPlugin(this.config,this.context)
  }


}