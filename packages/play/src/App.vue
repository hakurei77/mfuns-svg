<template>
    <div class="w-full h-screen flex items-center justify-center relative">
        <!-- Canvas 背景 -->
        <canvas class="w-full h-full" :style="{ backgroundColor: backgroundColor }" ref="canvasRef"></canvas>
        <!-- 控制面板 -->
        <div class="absolute top-4 left-4 p-6 bg-gray-900/60 rounded-xl shadow-lg flex flex-col gap-5 text-white w-80">
            <h2 class="text-lg font-semibold text-center text-gray-100">粒子效果设置</h2>
            <!-- 交互类型 -->
            <label class="flex items-center justify-between text-sm">
                <span>交互类型</span>
                <select class="w-24 h-8 ml-2 rounded bg-gray-700 cursor-pointer" v-model="interactionType">
                    <option value="push">推</option>
                    <option value="pull">拉</option>
                </select>
            </label>
            <!-- 背景颜色 -->
            <label class="flex items-center justify-between text-sm">
                <span>背景颜色</span>
                <input class="w-12 h-8 ml-2 rounded cursor-pointer" type="color" v-model="backgroundColor" />
            </label>
            <!-- 粒子颜色 -->
            <label class="flex items-center justify-between text-sm">
                <span>粒子颜色</span>
                <input class="w-12 h-8 ml-2 rounded cursor-pointer" type="color" v-model="particleColor" />
            </label>
            <!-- 图像缩放 -->
            <label class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between">
                    <span>图像缩放</span>
                    <span>{{ scaleFactor }}</span>
                </div>
                <input class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" type="range"
                    v-model="scaleFactor" min="1" max="10" step="0.1" />
            </label>
            <!-- 粒子大小 -->
            <label class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between">
                    <span>粒子大小</span>
                    <span>{{ particleSize }}</span>
                </div>
                <input class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" type="range"
                    v-model="particleSize" min="1" max="10" step="0.1" />
            </label>
            <!-- 粒子密度 -->
            <label class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between">
                    <span>粒子密度</span>
                    <span>{{ -particleSpacing }}</span>
                </div>
                <input class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" type="range"
                    v-model="particleSpacing" min="1" max="20" />
            </label>
            <!-- 透明阈值 -->
            <label class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between">
                    <span>透明阈值</span>
                    <span>{{ minAlpha }}</span>
                </div>
                <input class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" type="range"
                    v-model="minAlpha" min="1" max="254" />
            </label>
            <!-- 触发距离 -->
            <label class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between">
                    <span>触发距离</span>
                    <span>{{ mouseRadius }}</span>
                </div>
                <input class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" type="range"
                    v-model="mouseRadius" min="20" max="200" />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { createSVGParticleSystem } from 'svg-particle'
import svgContent from './assets/logo.svg?raw';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let particleSystem: ReturnType<typeof createSVGParticleSystem> | null = null;

// 响应式配置
const backgroundColor = ref('#a78bfa');
const particleColor = ref('#ffffff');
const interactionType = ref('pull');
const scaleFactor = ref(3);
const particleSize = ref(2);
const particleSpacing = ref(5);
const minAlpha = ref(128);
const mouseRadius = ref(70);

// 监听配置变化
watch([particleColor, scaleFactor, particleSize, particleSpacing, minAlpha, mouseRadius, interactionType], async () => {
    if (!particleSystem) return;
    await particleSystem.updateOptions({
        particleColor: particleColor.value,
        scaleFactor: scaleFactor.value,
        particleSize: particleSize.value,
        particleSpacing: particleSpacing.value,
        minAlpha: minAlpha.value,
        mouseRadius: mouseRadius.value,
        type:interactionType.value as 'pull' | 'push'
    });
});

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
</script>
<style scoped>
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #a78bfa;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s;
}

input[type="range"]::-webkit-slider-thumb:hover {
    background: #8b5cf6;
}

input[type="range"] {
    background: #ffffff;
    outline: none;
}

/* 移除默认的 input focus 边框 */
input:focus {
    outline: none;
}
/* 下拉框样式 */
select {
    background-color: white;
    color: black;
    border: none;
    padding: 0 8px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;
}

</style>