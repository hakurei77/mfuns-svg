# SVG Particle System

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/svg-particle)](https://npmjs.com/package/svg-particle)
[![npm downloads](https://img.shields.io/npm/dm/svg-particle)](https://npm.chart.dev/svg-particle)

<!-- /automd -->

> 一个轻量级的 SVG 粒子系统库，将 SVG 图像转换为动态粒子效果，支持鼠标交互和实时调整

<img src="https://github.com/hakurei77/mfuns-svg/blob/main/preview.gif">

### 🌟 核心功能

- **SVG 转粒子**：将 SVG 图像分解为粒子，支持自定义间距和透明度阈值。
- **鼠标交互**：提供“吸引”和“排斥”两种模式，粒子随鼠标动态移动。
- **动态调整**：支持实时更新画布尺寸和粒子配置。
- **模块化支持**：提供 ES 和 UMD 格式，附带 TypeScript 类型声明。
- **轻量高效**：无外部依赖，适用于现代前端项目。

## 安装

通过 pnpm 安装：

```bash
pnpm add svg-particle
```


## ✨ 使用方法

创建一个简单的粒子系统，将 SVG 圆形转换为动态粒子效果：

```js

import { createSVGParticleSystem } from 'svg-particle'
import svgContent from './assets/logo.svg?raw';  //需要导入原始svg字符串

const canvasRef = ref<HTMLCanvasElement | null>(null);
let particleSystem: ReturnType<typeof createSVGParticleSystem> | null = null;

onMounted(async () => {
    if (!canvasRef.value) return;
    particleSystem = createSVGParticleSystem(
        canvasRef.value,
        svgContent,
        {
            particleSpacing: particleSpacing.value,
            scaleFactor: scaleFactor.value,
            minAlpha: minAlpha.value,
            particleSize: particleSize.value,
            particleColor: particleColor.value,
            mouseRadius: mouseRadius.value,
            type: interactionType.value as 'pull' | 'push'
        }
    );
    await particleSystem.start();
});

onUnmounted(() => {
    particleSystem?.stop();
});
```

运行后，鼠标靠近时粒子会被推开。你可以通过 `updateOptions` 方法动态调整效果。

## 📦 API

### `createSVGParticleSystem(canvas, svg, options)`

创建并返回一个 SVG 粒子系统实例。

- **参数**：
  - `canvas: HTMLCanvasElement` - 用于渲染粒子的画布元素。
  - `svg: string` - SVG 图像的字符串内容。
  - `options: SVGParticleSystemOptions` - 配置选项（见下表）。

- **返回值**：
  - 一个控制对象，包含以下方法：
    - `start(): Promise<void>` - 启动粒子系统。
    - `stop(): void` - 停止粒子系统。
    - `updateOptions(newOptions: Partial<SVGParticleSystemOptions>): Promise<void>` - 更新配置。


## 📦 配置

### 配置选项

| 属性             | 类型             | 默认值      | 描述                         |
|------------------|------------------|-------------|------------------------------|
| particleSpacing  | number           | 5           | 粒子之间的采样间距，值越大粒子越稀疏 |
| scaleFactor      | number           | 3           | SVG 图像的缩放因子，控制整体大小 |
| minAlpha         | number           | 128         | 最小透明度阈值，只有透明度大于等于此值的像素生成粒子 |
| particleSize     | number           | 2           | 每个粒子的大小（半径）        |
| particleColor    | string           | 'white'     | 粒子的颜色（如 '#fff' 或 'red'） |
| mouseRadius      | number           | 70          | 鼠标影响半径，决定交互范围    |
| type             | 'pull' | 'push' | 'pull'      | 鼠标交互类型：吸引或排斥      |



### 使用 UMD 格式

如果你的项目不支持 ES 模块，可以使用 UMD 格式：

```html
<script src="https://cdn.jsdelivr.net/npm/svg-particle/dist/umd/index.umd.min.js"></script>
<script>
  const { createSVGParticleSystem } = window.SVGParticleSystem;
  let svgContent = `放入svg字符串`
  let particleSystem = createSVGParticleSystem(
        canvasRef,
        svgContent,
        {
          particleColor:'#138AFA',
          type:'push'
        }
    );
     particleSystem.start();
</script>
```

### ✍ 自定义粒子行为

通过修改 `Particle` 类（需 fork 项目）或扩展选项，可以实现更多效果，例如粒子速度、动画样式等。

