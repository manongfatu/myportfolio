// bg.js — Three.js animated wave/particle background
// Subtle, dynamic, not distracting

(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Determine colors from theme
  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      color1: isDark ? 0x4F8EF7 : 0x3A7EF0,
      color2: isDark ? 0x6C5CE7 : 0x5B4ADE,
      opacity1: isDark ? 0.5 : 0.3,
      opacity2: isDark ? 0.35 : 0.2,
    };
  }

  // Wave mesh 1
  const cols = getColors();
  const geo1 = new THREE.PlaneGeometry(80, 40, 60, 30);
  const mat1 = new THREE.MeshBasicMaterial({
    color: cols.color1,
    wireframe: true,
    transparent: true,
    opacity: cols.opacity1,
  });
  const mesh1 = new THREE.Mesh(geo1, mat1);
  mesh1.rotation.x = -Math.PI / 4;
  mesh1.position.y = -5;
  scene.add(mesh1);

  // Wave mesh 2
  const geo2 = new THREE.PlaneGeometry(80, 40, 60, 30);
  const mat2 = new THREE.MeshBasicMaterial({
    color: cols.color2,
    wireframe: true,
    transparent: true,
    opacity: cols.opacity2,
  });
  const mesh2 = new THREE.Mesh(geo2, mat2);
  mesh2.rotation.x = -Math.PI / 4;
  mesh2.position.y = -8;
  mesh2.position.z = -5;
  scene.add(mesh2);

  // Floating particles
  const partGeo = new THREE.BufferGeometry();
  const partCount = 120;
  const partPositions = new Float32Array(partCount * 3);
  for (let i = 0; i < partCount; i++) {
    partPositions[i * 3] = (Math.random() - 0.5) * 80;
    partPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    partPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
  const partMat = new THREE.PointsMaterial({
    color: cols.color1,
    size: 0.15,
    transparent: true,
    opacity: 0.6,
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    // Animate wave vertices
    const pos1 = geo1.attributes.position;
    const pos2 = geo2.attributes.position;
    const cols1 = geo1.parameters.widthSegments + 1;
    const rows1 = geo1.parameters.heightSegments + 1;

    for (let i = 0; i < pos1.count; i++) {
      const x = pos1.getX(i);
      const y = pos1.getY(i);
      const wave = Math.sin(x * 0.15 + time) * 1.2 + Math.sin(y * 0.2 + time * 0.7) * 0.8;
      pos1.setZ(i, wave);
    }
    pos1.needsUpdate = true;

    for (let i = 0; i < pos2.count; i++) {
      const x = pos2.getX(i);
      const y = pos2.getY(i);
      const wave = Math.sin(x * 0.1 + time * 0.8) * 1.5 + Math.cos(y * 0.15 + time * 0.5) * 1.0;
      pos2.setZ(i, wave);
    }
    pos2.needsUpdate = true;

    // Rotate particles slowly
    particles.rotation.y = time * 0.05;
    particles.rotation.x = Math.sin(time * 0.03) * 0.1;

    renderer.render(scene, camera);
  }
  animate();

  // Update colors on theme change
  window.addEventListener('themeChanged', function() {
    const c = getColors();
    mat1.color.setHex(c.color1);
    mat1.opacity = c.opacity1;
    mat2.color.setHex(c.color2);
    mat2.opacity = c.opacity2;
    partMat.color.setHex(c.color1);
  });

  // Resize
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Mouse parallax (subtle)
  document.addEventListener('mousemove', function(e) {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    mesh1.rotation.z = mx * 0.02;
    mesh2.rotation.z = -mx * 0.01;
    camera.position.x = mx * 1.5;
    camera.position.y = -my * 1.0;
    camera.lookAt(0, 0, 0);
  });
})();
