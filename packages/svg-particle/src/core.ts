/**
 * 导入粒子类和从SVG创建粒子的函数
 */
import { Particle } from './particle';
import { createParticlesFromSVG } from './createParticlesFromSVG';

/**
 * SVG粒子系统配置选项接口
 * @interface SVGParticleSystemOptions
 * @property {number} [particleSpacing] - 粒子之间的间距
 * @property {number} [scaleFactor] - SVG缩放因子
 * @property {number} [minAlpha] - 最小透明度阈值，用于确定是否创建粒子
 * @property {number} [particleSize] - 粒子大小
 * @property {string} [particleColor] - 粒子颜色
 * @property {number} [mouseRadius] - 鼠标影响半径
 * @property {'pull' | 'push'} [type] - 鼠标交互类型：吸引或排斥
 */
export interface SVGParticleSystemOptions {
    particleSpacing?: number;
    scaleFactor?: number;
    minAlpha?: number;
    particleSize?: number;
    particleColor?: string;
    mouseRadius?: number;
    type?: 'pull' | 'push'
}

/**
 * 默认配置选项
 * @constant defaultOptions
 */
export const defaultOptions: Required<SVGParticleSystemOptions> = {
    particleSpacing: 5, //粒子间距
    scaleFactor: 3, //缩放因子
    minAlpha: 128,  //最小透明阈值
    particleSize: 2,    //粒子大小
    particleColor: 'white',  //粒子颜色
    mouseRadius: 70,    //鼠标影响半径
    type: 'pull'        //默认为吸引模式
};

/**
 * 设置画布尺寸以匹配其显示尺寸
 * @param {HTMLCanvasElement} canvas - 要设置的画布元素
 */
export const setupCanvas = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
};

/**
 * 动画循环函数，负责清除画布、更新和绘制所有粒子
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {HTMLCanvasElement} canvas - 画布元素
 * @param {Particle[]} particlesArray - 粒子数组
 * @param {number | null} animationFrameId - 当前动画帧ID
 * @param {Object} mouse - 鼠标状态对象
 * @param {number | null} mouse.x - 鼠标X坐标
 * @param {number | null} mouse.y - 鼠标Y坐标
 * @param {number} mouse.radius - 鼠标影响半径
 * @param {'pull' | 'push'} mouse.type - 鼠标交互类型
 * @returns {number} 新的动画帧ID
 */
export const animate = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particlesArray: Particle[],
    animationFrameId: number | null,
    mouse: { x: number | null; y: number | null; radius: number; type: 'pull' | 'push' }
) => {
    // 清除整个画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 遍历所有粒子
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw(ctx);  // 绘制粒子
        particlesArray[i].update(mouse, mouse.type);  // 更新粒子位置
    }
    // 请求下一帧动画
    animationFrameId = requestAnimationFrame(() => animate(ctx, canvas, particlesArray, animationFrameId, mouse));
};

/**
 * 创建SVG粒子系统
 * @param {HTMLCanvasElement} canvas - 用于渲染的画布元素
 * @param {string} svg - SVG字符串
 * @param {SVGParticleSystemOptions} options - 配置选项
 * @returns {Object} 包含start、stop和updateOptions方法的控制对象
 */
export const createSVGParticleSystem = (
    canvas: HTMLCanvasElement,
    svg: string,
    options?: SVGParticleSystemOptions
) => {
    // 获取2D渲染上下文
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 存储所有粒子的数组
    const particlesArray: Particle[] = [];
    // 动画帧ID，用于取消动画
    let animationFrameId: number | null = null;
    // 合并默认选项和用户提供的选项
    const mergedOptions = { ...defaultOptions, ...(options || {}) };

    /**
     * 创建鼠标状态对象，跟踪鼠标位置和交互设置
     */
    const mouse = {
        x: null as number | null,  // 鼠标X坐标
        y: null as number | null,  // 鼠标Y坐标
        radius: mergedOptions.mouseRadius,  // 鼠标影响半径
        type: mergedOptions.type as 'pull' | 'push'  // 鼠标交互类型
    };

    /**
     * 鼠标移动事件处理函数
     * 更新鼠标在画布上的相对坐标
     * @param {MouseEvent} event - 鼠标事件对象
     */
    const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;  // 计算相对于画布的X坐标
        mouse.y = event.clientY - rect.top;   // 计算相对于画布的Y坐标
    };

    /**
     * 处理窗口大小变化
     * 重新设置画布尺寸并重新创建粒子
     */
    const handleResize = async () => {
        setupCanvas(canvas);  // 调整画布尺寸
        // 根据SVG重新创建粒子
        await createParticlesFromSVG(canvas, svg, particlesArray, Particle, mergedOptions);
    };

    /**
     * 启动粒子系统
     * 初始化画布、添加事件监听器并开始动画循环
     */
    const start = async () => {
        handleResize();  // 初始化画布尺寸和粒子
        // 添加事件监听器
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        // 开始动画循环
        animate(ctx, canvas, particlesArray, animationFrameId, mouse);
    };

    /**
     * 停止粒子系统
     * 取消动画循环并移除事件监听器
     */
    const stop = () => {
        // 如果存在动画帧，取消它
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // 移除事件监听器
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
    };

    /**
     * 更新粒子系统选项
     * @param {Partial<SVGParticleSystemOptions>} newOptions - 新的配置选项
     */
    const updateOptions = async (newOptions: Partial<SVGParticleSystemOptions>) => {
        // 更新合并的选项
        Object.assign(mergedOptions, newOptions);
        // 更新鼠标设置
        mouse.radius = mergedOptions.mouseRadius;
        mouse.type = mergedOptions.type as 'pull' | 'push';
        // 重新初始化粒子
        await handleResize();
    };

    /**
     * 返回控制对象，包含启动、停止和更新选项的方法
     */
    return {
        start,
        stop,
        updateOptions
    };
}

