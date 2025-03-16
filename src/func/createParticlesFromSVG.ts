/**
 * SVG粒子系统配置选项接口
 * @interface SVGParticleSystemOptions
 * @property {number} particleSpacing - 粒子之间的采样间距，值越大粒子越稀疏
 * @property {number} scaleFactor - SVG图像的缩放因子，控制整体大小
 * @property {number} minAlpha - 最小透明度阈值，只有透明度大于等于此值的像素才会生成粒子
 * @property {number} particleSize - 每个粒子的大小
 * @property {string} particleColor - 粒子的颜色
 */
interface SVGParticleSystemOptions {
    particleSpacing: number;   //粒子间距
    scaleFactor: number;       //缩放因子
    minAlpha: number;          //最小透明阈值
    particleSize: number;      //粒子大小
    particleColor: string;     //粒子颜色
}
/**
 * 计算画布尺寸
 * @param img - SVG图像元素
 * @param SCALE_FACTOR - 缩放因子
 * @returns 返回计算后的画布宽高
 */
const calculateCanvasSize = (img: HTMLImageElement, SCALE_FACTOR: number) => ({
    width: img.width * SCALE_FACTOR || 200,  // 如果计算结果为0，则使用默认值200
    height: img.height * SCALE_FACTOR || 200
});

/**
 * 创建临时画布用于图像处理
 * @param width - 画布宽度
 * @param height - 画布高度
 * @returns 返回创建的画布元素
 */
const createTempCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

/**
 * 根据图像数据生成粒子
 * @param img - 加载的SVG图像元素
 * @param canvas - 目标画布，用于计算粒子位置偏移
 * @param particlesArray - 存储生成的粒子的数组
 * @param Particle - 粒子类构造函数
 * @param options - 粒子系统配置选项
 */
const generateParticles = (
    img: any,
    canvas: HTMLCanvasElement,
    particlesArray: Array<any>,
    Particle: any,
    options: SVGParticleSystemOptions
) => {
    const { width, height } = calculateCanvasSize(img, options.scaleFactor);  // 计算画布尺寸
    const tempCanvas = createTempCanvas(width, height);  // 创建临时画布
    const tempCtx = tempCanvas.getContext('2d');  // 获取2D上下文
    tempCtx!.drawImage(img, 0, 0, width, height);  // 将SVG绘制到临时画布
    const imageData = tempCtx!.getImageData(0, 0, width, height);  // 获取图像像素数据
    const data = imageData.data;  // 像素数据数组
    const offsetX = (canvas.width - width) / 2;  // 计算水平居中偏移
    const offsetY = (canvas.height - height) / 2;  // 计算垂直居中偏移
    particlesArray.length = 0;  // 清空现有粒子数组
    // 确保粒子间距不为0，防止无限循环
    const spacing = Math.max(1, options.particleSpacing);   
    // 遍历图像像素，按照指定间距采样
    for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
            const index = (y * width + x) * 4;  // 计算像素在数据数组中的索引（每个像素4个值：R,G,B,A）
            // 修改条件为大于等于，确保完全不透明的像素也能显示
            if (index >= 0 && index < data.length && data[index + 3] >= options.minAlpha) {
                particlesArray.push(new Particle(
                    x + offsetX,
                    y + offsetY,
                    options.particleSize,
                    options.particleColor
                ));
            }
        }
    }
};
/**
 * 将SVG转换为粒子数据的主函数
 * @param canvas - 目标画布元素，用于渲染粒子
 * @param svg - SVG字符串内容
 * @param particlesArray - 存储生成的粒子的数组
 * @param Particle - 粒子类构造函数
 * @param options - 粒子系统配置选项
 * @returns Promise对象，在粒子生成完成后解析
 */
const createParticlesFromSVG = (
    canvas: HTMLCanvasElement,
    svg: string,
    particlesArray: Array<any>,
    Particle: any,
    options: SVGParticleSystemOptions
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const blob = new Blob([svg], { type: 'image/svg+xml' });  // 创建SVG的Blob对象
        img.src = URL.createObjectURL(blob);  // 将Blob转换为URL并设置为图像源
        img.onload = () => {
            generateParticles(img,canvas,particlesArray,Particle,options);  // 生成粒子
            URL.revokeObjectURL(img.src);  // 释放创建的URL对象
            resolve();
        };
        img.onerror = () => reject(new Error('Failed to load SVG'));  // 图像加载失败时的错误处理
    });
};

export {
    createParticlesFromSVG
}