import React, { useEffect, useRef } from 'react';

interface VoxelBlock {
  x: number;
  y: number;
  size: number;
  origX: number;
  origY: number;
  scatterVx: number;
  scatterVy: number;
  floatPhase: number;
  floatSpeed: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  borderColor: string;
  depth: number;
  rotation: number;
  rotationSpeed: number;
}

export const GlobalVoxelBlockBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initBlocks();
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive repulsion
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll progress (0 at top, 1 further down)
    let currentScrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Palette of cyan/blue voxel colors matching the image
    const palette = [
      { fill: 'rgba(0, 220, 255, ', border: 'rgba(180, 245, 255, ' },
      { fill: 'rgba(56, 189, 248, ', border: 'rgba(224, 242, 254, ' },
      { fill: 'rgba(14, 165, 233, ', border: 'rgba(125, 211, 252, ' },
      { fill: 'rgba(2, 132, 199, ', border: 'rgba(56, 189, 248, ' },
      { fill: 'rgba(96, 165, 250, ', border: 'rgba(191, 219, 254, ' },
    ];

    let blocks: VoxelBlock[] = [];

    const initBlocks = () => {
      const count = Math.min(140, Math.floor((width * height) / 12000));
      blocks = [];

      for (let i = 0; i < count; i++) {
        // Initial cluster around the title area (top 20% to 50% of the screen)
        // or scattered across the whole canvas
        const isCluster = i < count * 0.45;
        const origX = isCluster 
          ? width * 0.5 + (Math.random() - 0.5) * Math.min(width * 0.8, 800)
          : Math.random() * width;
        const origY = isCluster
          ? height * 0.4 + (Math.random() - 0.5) * 260
          : Math.random() * height;

        // Radial explosion vector when scrolling
        const angle = Math.atan2(origY - height * 0.4, origX - width * 0.5) + (Math.random() - 0.5) * 0.8;
        const speed = 200 + Math.random() * 900;
        const scatterVx = Math.cos(angle) * speed;
        const scatterVy = Math.sin(angle) * speed * 1.3;

        const size = Math.floor(Math.random() * 16) + 8; // 8px to 24px blocks
        const col = palette[Math.floor(Math.random() * palette.length)];

        blocks.push({
          x: origX,
          y: origY,
          origX,
          origY,
          scatterVx,
          scatterVy,
          size,
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: 0.015 + Math.random() * 0.02,
          baseAlpha: 0.2 + Math.random() * 0.65,
          alpha: 0.2 + Math.random() * 0.65,
          color: col.fill,
          borderColor: col.border,
          depth: 0.2 + Math.random() * 0.8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
        });
      }
    };

    initBlocks();

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth scroll interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;
      const scrollFactor = Math.min(currentScrollY / (height * 1.5), 1);

      ctx.clearRect(0, 0, width, height);

      // Draw subtle digital tech grid lines
      ctx.strokeStyle = 'rgba(0, 180, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      const offsetY = (currentScrollY * 0.2) % gridSize;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(width, y + offsetY);
      }
      ctx.stroke();

      // Render each voxel block
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];

        // Float wave animation
        b.floatPhase += b.floatSpeed;
        const floatOffsetX = Math.cos(b.floatPhase) * (6 * b.depth);
        const floatOffsetY = Math.sin(b.floatPhase) * (8 * b.depth);

        // Position calculation:
        // As scrollFactor increases, blocks disperse outward from their original positions
        // plus continuous vertical parallax as you scroll the entire site
        const dispersedX = b.origX + b.scatterVx * Math.pow(scrollFactor, 1.2) + floatOffsetX;
        
        // Wrap around vertically so blocks exist continuously for the whole website!
        const totalPageY = b.origY + b.scatterVy * Math.pow(scrollFactor, 1.2) + floatOffsetY;
        const relativeY = ((totalPageY - currentScrollY * (0.3 + b.depth * 0.5)) % (height + 120) + (height + 120)) % (height + 120) - 60;
        
        // Wrap horizontally if dispersed off screen
        const relativeX = ((dispersedX % (width + 120)) + (width + 120)) % (width + 120) - 60;

        // Mouse repulsion
        const dx = relativeX - mouseX;
        const dy = relativeY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let repelX = 0;
        let repelY = 0;
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          repelX = (dx / dist) * force * 35;
          repelY = (dy / dist) * force * 35;
        }

        const finalX = relativeX + repelX;
        const finalY = relativeY + repelY;

        // Fade in more intensely as user scrolls, diffusing through the background
        const dynamicAlpha = Math.min(1, b.baseAlpha * (0.5 + scrollFactor * 0.7));

        ctx.save();
        ctx.translate(finalX, finalY);
        
        // Slight rotation for dissolving aesthetic
        b.rotation += b.rotationSpeed;
        ctx.rotate(b.rotation);

        const half = b.size / 2;

        // Outer Glow for prominent blocks
        if (b.depth > 0.6) {
          ctx.shadowColor = 'rgba(0, 220, 255, 0.45)';
          ctx.shadowBlur = 12 * b.depth;
        } else {
          ctx.shadowBlur = 0;
        }

        // 1. Block Face
        ctx.fillStyle = b.color + dynamicAlpha + ')';
        ctx.fillRect(-half, -half, b.size, b.size);

        // 2. High-Tech Edge Border (Block Grooves)
        ctx.strokeStyle = b.borderColor + (dynamicAlpha * 0.9) + ')';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-half, -half, b.size, b.size);

        // 3. Inner Pixel Highlight (3D bevel aesthetic like in the image)
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (dynamicAlpha * 0.5) + ')';
        ctx.fillRect(-half + 1, -half + 1, Math.max(2, b.size * 0.35), Math.max(2, b.size * 0.35));

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.92 }}
    />
  );
};
