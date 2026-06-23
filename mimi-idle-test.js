(() => {
  const img = new Image();
  img.src = "./assets/asset-pack-01/characters/mimi/idle.png?v=10";

  function tryDraw() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    // 直接在画布左下角测试显示（避免找 drawPlayer）
    img.onload = () => {
      setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 100, 200, 120, 120);
      }, 1000);
    };
  }

  tryDraw();
})();