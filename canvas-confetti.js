(function (global) {
  var canvasInstance = null;
  var ctx = null;
  var particles = [];
  var animationId = null;

  function initCanvas() {
    if (canvasInstance) return;

    canvasInstance = document.createElement('canvas');
    canvasInstance.id = 'mergefetti-canvas';
    canvasInstance.style.position = 'fixed';
    canvasInstance.style.top = '0px';
    canvasInstance.style.left = '0px';
    canvasInstance.style.width = '100vw';
    canvasInstance.style.height = '100vh';
    canvasInstance.style.pointerEvents = 'none';
    canvasInstance.style.zIndex = '999999';

    canvasInstance.width = window.innerWidth;
    canvasInstance.height = window.innerHeight;

    document.documentElement.appendChild(canvasInstance);
    ctx = canvasInstance.getContext('2d');
  }

  function frameLoop() {
    ctx.clearRect(0, 0, canvasInstance.width, canvasInstance.height);

    var hasActiveParticles = false;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Update falling kinetics
      p.y += p.speedY;
      p.x += p.driftX;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;

      if (p.y < canvasInstance.height + 50) {
        hasActiveParticles = true;

        ctx.save();

        if (p.shape === 'spiral') {
          // RIBBON SPIRAL RENDERING CODE ENGINE
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);

          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.lineWidth;
          ctx.lineCap = 'round';
          ctx.beginPath();

          // Draw an elegant, wavy corkscrew spiral line
          for (var j = -p.size; j <= p.size; j++) {
            var spiralX = Math.sin(j * 0.5 + p.wobble) * p.spiralWidth;
            if (j === -p.size) {
              ctx.moveTo(spiralX, j);
            } else {
              ctx.lineTo(spiralX, j);
            }
          }
          ctx.stroke();
        } else {
          // STANDARD FLAT PAPER RENDERING (With 3D Twirl Scaling)
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);

          var twirlScaleX = Math.cos(p.wobble);
          ctx.scale(twirlScaleX, 1);

          ctx.fillStyle = p.color;
          ctx.beginPath();

          if (p.shape === 'circle') {
            ctx.arc(0, 0, p.size / 2, 0, 2 * Math.PI);
          } else {
            ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          ctx.fill();
        }

        ctx.restore();
      }
    }

    if (hasActiveParticles) {
      animationId = requestAnimationFrame(frameLoop);
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
      if (canvasInstance && canvasInstance.parentNode) {
        canvasInstance.parentNode.removeChild(canvasInstance);
      }
      canvasInstance = null;
      particles = [];
    }
  }

  global.confettiRain = function () {
    initCanvas();
    var colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

    // DENSITY: 200 total elements scattered uniformly
    for (var i = 0; i < 200; i++) {
      var rand = Math.random();
      var shapeType = 'square';

      // RATIO CONFIGURATION: 20% spirals, 40% circles, 40% squares
      if (rand < 0.20) {
        shapeType = 'spiral';
      } else if (rand < 0.60) {
        shapeType = 'circle';
      }

      particles.push({
        x: Math.random() * canvasInstance.width,
        y: Math.random() * -canvasInstance.height, // Continuous staggering offset
        speedY: Math.random() * 2.5 + 3,           // Natural uniform falling rate
        driftX: Math.random() * 1.6 - 0.8,         // Subtle side-sway
        size: Math.random() * 4 + 9,               // Baseline core length/size
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapeType,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        // Unique property fields reserved explicitly for ribbon spirals
        spiralWidth: Math.random() * 3 + 4,
        lineWidth: Math.random() * 1 + 2
      });
    }

    if (!animationId) {
      animationId = requestAnimationFrame(frameLoop);
    }
  };
})(window);