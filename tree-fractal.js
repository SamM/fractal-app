var settings = {
    width: 700,
    height: 500
};

function setup() {
    createCanvas(settings.width, settings.height);
}

function draw() {
    branch(3, 0, 0, 0, 1);
}

function branch(iter, x , y, angle, scale)
{
    if(iter>0)
    {
        translate(settings.width/2, settings.height/2);
        //
    }
}