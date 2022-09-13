import * as THREE from "three";

export const worldPlane = () => {
  const geometryPlane = new THREE.PlaneGeometry(1000, 1000);
  const materialPlane = new THREE.MeshStandardMaterial({ color: 0x050505 });
  const meshPlane = new THREE.Mesh(geometryPlane, materialPlane); // idk why this is throwing an error it compiles fine
  meshPlane.rotateX(-Math.PI / 2);

  return meshPlane;
};

export const cubeRenderTargetBuilder = () => {
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });
  cubeRenderTarget.texture.type = THREE.HalfFloatType;
  return cubeRenderTarget;
};
