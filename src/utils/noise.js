const noise = () => {
  let ctx, canvas;
  let wWidth, wHeight;
  let noiseData = [];
  let frame = 0;
  let loopTimeout;
  // Create Noise
  const createNoise = () => {
    const idata = ctx.createImageData(wWidth, wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.1) {
        buffer32[i] = 0xff000000;
      }
    }
    noiseData.push(idata);
  };
  // Play Noise
  const paintNoise = () => {
    frame = (frame + 1) % 10;
    ctx.putImageData(noiseData[frame], 0, 0);
  };
  // Loop
  const loop = () => {
    paintNoise(frame);
    loopTimeout = window.setTimeout(() => {
      window.requestAnimationFrame(loop);
    }, 1000 / 25);
  };
  // Setup
  const setup = () => {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;
    canvas.width = wWidth;
    canvas.height = wHeight;
    for (let i = 0; i < 10; i++) {
      createNoise();
    }
    loop();
  };
  // Reset
  let resizeThrottle;
  const reset = () => {
    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(resizeThrottle);
        resizeThrottle = window.setTimeout(() => {
          window.clearTimeout(loopTimeout);
          setup();
        }, 200);
      },
      false
    );
  };
  // Init
  const init = (() => {
    const localCanvasWrapper = document.getElementsByClassName("noise-layer");
    canvas = document.createElement("canvas");
    canvas.id = "noise";
    canvas.class = "noise-layer-canvas";
    if (localCanvasWrapper && localCanvasWrapper.length === 1) {
      localCanvasWrapper[0].appendChild(canvas);
    }
    console.log(canvas);
    ctx = canvas.getContext("2d");
    setup();
  })();
};

export default noise;
