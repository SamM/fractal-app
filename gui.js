let gui;
function initgui()
{
  gui = new dat.GUI();
  let f1 = gui.addFolder('Params');
    f1.add(settings, 'branches', 1, 16).step(1);
    f1.add(settings, 'angle', 0, 1).step(0.01);
    f1.add(settings, 'scale', -1, 2).step(0.05);
    f1.add(settings, 'spread', 0, 1).step(0.01);
    f1.add(settings, 'max_iters', 1, 20).step(1);
    f1.addColor(settings, 'color');
  f1.open();
}
