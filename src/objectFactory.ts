import * as THREE from "three";

export const worldPlane = () => {
  const geometryPlane = new THREE.PlaneGeometry(600, 600);
  const materialPlane = new THREE.MeshStandardMaterial({
    color: 0x050505,
    side: THREE.DoubleSide,
  });
  const meshPlane = new THREE.Mesh(geometryPlane, materialPlane);
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

export const hugeCircleLight = () => {
  return new THREE.Mesh(
    new THREE.TorusBufferGeometry(350, 3, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
};
