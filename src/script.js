import "./style.css";
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { Water } from "three/examples/jsm/objects/Water.js";

import * as dat from "lil-gui";

import {
  worldPlane,
  cubeRenderTargetBuilder,
  hugeCircleLight,
} from "./objectFactory.ts";
import noise from "./utils/noise";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const sceneHasFog = false;
scene.fog = sceneHasFog ? new THREE.Fog("#000", 1, 400) : null;

// Plane / Water plane
// Water

const waterGeometry = new THREE.PlaneGeometry(1000, 1000);

// const texture = new THREE.TextureLoader().load("waternormals.jpg");

const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load(
    "waternormals.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
  fog: scene.fog !== undefined,
});
water.rotation.x = -Math.PI / 2;
scene.add(water);
// scene.add(worldPlane());

// Cube Cam
const cubeRenderTarget = cubeRenderTargetBuilder();
const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

// Shiny Material
const shinyMaterial2 = new THREE.MeshLambertMaterial({
  color: 0xd1d1d1,
  envMap: cubeRenderTarget.texture,
  emissive: 0x1b1b1b,
  emissiveIntensity: 1,
  refractionRatio: 1,
});
const shinyMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.1,
  metalness: 1.0,
  envMap: cubeRenderTarget.texture,
});

// Sphere
const geometrySphere = new THREE.SphereGeometry(10, 32, 16);
// const materialSphere = new THREE.MeshBasicMaterial({ color: "cyan" });
const icoSphere = new THREE.IcosahedronGeometry(10, 60);
icoSphere.computeVertexNormals();
const meshSphere = new THREE.Mesh(icoSphere, shinyMaterial);
meshSphere.position.set(0, 15, 0);
meshSphere.add(cubeCamera);
scene.add(meshSphere);

// reference cube
const cubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({ color: "red" })
);
cubeMesh.position.set(20, 2.5, 20);
scene.add(cubeMesh);
// reference cube

const taurusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(5, 3, 16, 100),
  new THREE.MeshStandardMaterial({ color: "blue" })
);
taurusMesh.position.set(0, 33, 0);
gui.add(taurusMesh.position, "x", -50, 50, 1).name("torus x");
gui.add(taurusMesh.position, "y", -50, 50, 1).name("torus y");
gui.add(taurusMesh.position, "z", -50, 50, 1).name("torus z");
scene.add(taurusMesh);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

/**
 * Lights
 */
const light = new THREE.AmbientLight(0x404040, 1); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight("#ffffff", 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

const bigLight1 = hugeCircleLight();
const bigLight2 = hugeCircleLight();
bigLight2.rotateY(Math.PI / 2);
scene.add(bigLight1);
scene.add(bigLight2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(40, 30, 40);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post processing
 */
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Animations
  bigLight1.rotation.y = elapsedTime * 0.5;
  bigLight1.rotation.x = elapsedTime * 0.25;
  bigLight2.rotation.y = elapsedTime * 0.5 * -1.0;
  bigLight2.rotation.z = elapsedTime * 0.5 * -1.0;
  water.material.uniforms["time"].value += 1.0 / 60.0;

  // Cube Cam
  cubeCamera.position.copy(meshSphere.position);
  meshSphere.visible = false;
  cubeCamera.update(renderer, scene);

  // Update controls
  controls.update();

  // Render
  meshSphere.visible = true;
  // renderer.render(scene, camera);
  effectComposer.render();

  stats.end();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

noise();
tick();
