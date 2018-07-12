var settings = {
    width: 720,
    height: 720,
    max_iters: 5,
    spread: 0.1,
    color: '#ff0000',
    scale: 0.9,
    branches: 1,
    angle: 0,
    x: 0,
    y: 0,
    unit: 50
};

function setup() {
    createCanvas(settings.width, settings.height);
    initgui();
}

function draw() {
    background(255);
    translate(settings.width/2, settings.height/2);
    rotate(-PI / 2.0);
    let start_angle = settings.angle * PI * 2;
    branch(settings.max_iters, settings.x, settings.y, start_angle, settings.unit);
}

function branch(iter, x , y, angle, scale)
{
    let progress = 1-iter/settings.max_iters;//0 to 1
    if(iter>0)
    {
        stroke(lerpColor(color(settings.color), color(255), progress));
        strokeWeight(2*(1-progress));

        //draw the symmetric lines each iteration
        //instead of starting the recursion multiple times
        for(let i = 0; i<settings.branches; i++){
          let symmetry_angle = i * ((PI*2)/settings.branches);
          let a = atan2(y,x)+symmetry_angle;
          let l = sqrt(x*x+y*y);//convert to polar coords to easily add extra rotation
          let x1 = l*cos(a);
          let y1 = l*sin(a);
          let x2 = x1 + scale*cos(symmetry_angle+angle);
          let y2 = y1 + scale*sin(symmetry_angle+angle);
          line(x1, y1, x2, y2);
        }

        //calculate next iteration params
        var newX = x + scale*cos(angle);
        var newY = y + scale*sin(angle);
        var newScale = scale * settings.scale;
        var newAngle1 = angle - (settings.spread * PI);
        var newAngle2 = angle + (settings.spread * PI);
        //recursive calls
        branch(iter-1, newX, newY, newAngle1, newScale);
        branch(iter-1, newX, newY, newAngle2, newScale);
    }
}
