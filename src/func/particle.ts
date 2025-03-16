/**
 * 粒子类
 * 表示SVG图像中的一个粒子，具有位置、大小和颜色属性
 * 可以响应鼠标交互，实现吸引或排斥效果
 */
class Particle {
    private x: number;         // 当前x坐标
    private y: number;         // 当前y坐标
    private baseX: number;     // 原始/基准x坐标
    private baseY: number;     // 原始/基准y坐标
    private size: number;      // 粒子大小
    private color: string;     // 粒子颜色

    /**
     * 创建一个新的粒子实例
     * @param x - 粒子的初始x坐标
     * @param y - 粒子的初始y坐标
     * @param size - 粒子的大小（半径）
     * @param color - 粒子的颜色
     */
    constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.baseX = x;        // 保存初始位置作为基准位置
        this.baseY = y;
        this.size = size;
        this.color = color;
    }

    /**
     * 在画布上绘制粒子
     * @param ctx - 画布的2D渲染上下文
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);  // 绘制圆形粒子
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * 根据鼠标位置更新粒子位置
     * @param mouse - 鼠标对象，包含x、y坐标和影响半径
     * @param type - 交互类型，'pull'表示吸引，'push'表示排斥
     */
    update(mouse: any, type: 'push' | 'pull' = 'pull') {
        // 计算粒子到鼠标的距离向量
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);  // 计算欧几里得距离

        // 计算粒子到其原始位置的距离
        let distanceToOrigin = Math.sqrt(
            Math.pow(this.x - this.baseX, 2) +
            Math.pow(this.y - this.baseY, 2)
        );

        // 计算力的方向和大小
        let forceDirectionX = dx / distance;  // 单位向量x分量
        let forceDirectionY = dy / distance;  // 单位向量y分量
        let maxDistance = mouse.radius;       // 最大影响距离
        let force = (maxDistance - distance) / maxDistance;  // 力的大小，距离越近力越大
        let directionX = forceDirectionX * force * mouse.radius / 12;  // x方向的位移
        let directionY = forceDirectionY * force * mouse.radius / 12;  // y方向的位移

        // 吸引模式：当鼠标靠近时，粒子向鼠标移动
        if (type === 'pull') {
            if (distance < mouse.radius) {
                this.x += directionX;
                this.y += directionY;
            }
        }

        // 排斥模式：当鼠标靠近时，粒子远离鼠标
        if (type === 'push') {
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            }
        }

        // 当粒子在鼠标影响范围内且已经偏离原位较远时，缓慢回归原位
        if (distance < mouse.radius && distanceToOrigin > mouse.radius) {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;  // 每帧回归原位的1/20距离
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }
        // 当粒子不在鼠标影响范围内时，也缓慢回归原位
        else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }
    }
}

export default Particle;