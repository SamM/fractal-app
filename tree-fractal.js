var settings = {
    width: 500,
    height: 500
};

function setup() {
    createCanvas(settings.width, settings.height);
}

function draw() {
    translate(settings.width/2, settings.height/2);
    branch(3, 0, 0, 0, 250);
}

function branch(iter, x , y, angle, scale)
{
    if(iter>0)
    {   
        var newX = scale*Math.cos(angle);
        var newY = scale*Math.sin(angle);
        var newScale = scale * 0.8;
        var angle1 = angle - 0.2;
        var angle2 = angle + 0.2;
        line(x, y, newX, newY);
        branch(iter-1, newX, newY, angle1, newScale);
        branch(iter-1, newX, newY, angle2, newScale);
        //
    }
}