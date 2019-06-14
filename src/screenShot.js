import html2canvas from 'html2canvas';
const screen = {
  screenShot: function(cntElem, callback) {
    var shareContent = cntElem; //需要截图的包裹的（原生的）DOM 对象
    var width = shareContent.offsetWidth; //获取dom 宽度
    var height = shareContent.offsetHeight; //获取dom 高度
    var canvas = document.createElement('canvas'); //创建一个canvas节点
    var scale = 0.6; //定义任意放大倍数 支持小数
    canvas.style.display = 'none';
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.getContext('2d').scale(scale, scale); //获取context,设置scale
    var opts = {
      scale: scale, // 添加的scale 参数
      canvas: canvas, //自定义 canvas
      logging: false, //日志开关，便于查看html2canvas的内部执行流程
      width: width, //dom 原始宽度
      height: height,
      useCORS: true // 【重要】开启跨域配置
    };
    html2canvas(cntElem, opts).then(function(canvas) {
      var dataURL = canvas.toDataURL();
      var tempCompress = dataURL.replace('data:image/png;base64,', '');
      // var compressedDataURL = Base64String.compress(tempCompress);
      callback(tempCompress);
    });
  },

  loadJs: function(url, callback) {
    var script = document.createElement('script');
    script.async = 1;
    script.src = url;
    script.onload = callback;
    var dom = document.getElementsByTagName('script')[0];
    dom.parentNode.insertBefore(script, dom);
    return dom;
  }
};

export default screen;
