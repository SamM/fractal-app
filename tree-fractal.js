var settings = {
    width: 720,
    height: 720,
    max_iters: 5,
    spread: 0.1,
    color: '#ff0000',
    scale: 0.9
};

function setup() {
    createCanvas(settings.width, settings.height);
    initgui();
}

function draw() {
    background(255);
    translate(settings.width/2, settings.height/2);
    rotate(-PI / 2.0);
    branch(settings.max_iters, 0, 0, 0, 50);
}

function branch(iter, x , y, angle, scale)
{
    let progress = 1-iter/settings.max_iters;//0 to 1
    if(iter>0)
    {
        var newX = x + scale*cos(angle);
        var newY = y + scale*sin(angle);
        stroke(lerpColor(color(settings.color), color(255), progress));
        strokeWeight(2*(1-progress));
        line(x, y, newX, newY);
        var newScale = scale * settings.scale;
        var angle1 = angle - settings.spread;
        var angle2 = angle + settings.spread;
        branch(iter-1, newX, newY, angle1, newScale);
        branch(iter-1, newX, newY, angle2, newScale);
    }
}
