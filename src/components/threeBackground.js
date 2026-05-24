/**
 * Three.js interactive particle system for the hero background.
 * Renders floating geometric shapes with subtle color-shifting.
 */
import * as THREE from 'three';

export function initHeroScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // ── Floating torus knots ──
  const geometries = [];
  const colors = [
    new THREE.Color('#c62828'),
    new THREE.Color('#ef5350'),
    new THREE.Color('#8e0000'),
    new THREE.Color('#ff8a80'),
  ];

  for (let i = 0; i < 6; i++) {
    const geo = new THREE.TorusKnotGeometry(0.3 + Math.random() * 0.4, 0.08, 64, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.15 + Math.random() * 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      -5 + Math.random() * -10
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.008 },
      floatSpeed: 0.002 + Math.random() * 0.003,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
    };
    scene.add(mesh);
    geometries.push(mesh);
  }

  // ── Particle field ──
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = -5 - Math.random() * 15;

    const c = colors[Math.floor(Math.random() * colors.length)];
    particleColors[i * 3] = c.r;
    particleColors[i * 3 + 1] = c.g;
    particleColors[i * 3 + 2] = c.b;

    sizes[i] = 0.5 + Math.random() * 1.5;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  camera.position.z = 5;

  // ── Mouse tracking ──
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ── Resize ──
  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resize);

  // ── Animation loop ──
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate geometries
    geometries.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotSpeed.x;
      mesh.rotation.y += mesh.userData.rotSpeed.y;
      mesh.position.y = mesh.userData.baseY +
        Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.3;
    });

    // Camera responds to mouse
    camera.position.x += (targetX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (targetY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Slow particle rotation
    particles.rotation.y += 0.0002;

    renderer.render(scene, camera);
  }

  animate();

  // ── Cleanup ──
  return () => {
    window.removeEventListener('resize', resize);
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}
