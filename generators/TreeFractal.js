var Generator;
if(typeof Generator != 'function' && typeof require == 'function'){
    Generator = require('../Generator');
}

var TreeFractal = new Generator({
    settings: {
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
    },
    setup: function(){
        createCanvas(this.get('width'), this.get('height'));
        noLoop();
        var params = this.gui.section('Params');
        params.number('width', 10, 4000, 1)
        params.number('height', 10, 4000, 1)
        params.number('x', '-width/2', 'width/2', 1);
        params.number('y', '-height/2', 'height/2', 1);
        params.number('branches', 1, 16, 1)
        params.number('angle', 0, 1, 0.01);
        params.number('scale', -2, 2, 0.05);
        params.number('spread', 0, 1, 0.01);
        params.number('max_iters', 1, 20, 1);
        this.gui.onSet(function(){
            redraw();
        })
        //params.color('color');
    },
    draw: function(){
        resizeCanvas(this.get('width'), this.get('height'), true);
        background(255);
        translate(this.get('width')/2, this.get('height')/2);
        rotate(-PI / 2.0);
        let start_angle = this.get('angle') * PI * 2;
        // Switch x and y and invert y here because we rotate and it inverts the axii
        this.branch(this.get('max_iters'), - this.get('y'), this.get('x'), start_angle, this.get('unit') * this.get('scale'));
    },
    branch: function(iter, x , y, angle, scale)
    {
        let progress = 1-iter/this.get('max_iters');//0 to 1
        if(iter>0)
        {
            stroke(lerpColor(color(this.get('color')), color(255), progress));
            strokeWeight(2*(1-progress));
    
            //draw the symmetric lines each iteration
            //instead of starting the recursion multiple times
            var branches = this.get('branches');
            for(let i = 0; i<branches; i++){
              let symmetry_angle = i * ((PI*2)/branches);
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
            var newScale = scale * this.get('scale');
            var newAngle1 = angle - (this.get('spread') * PI);
            var newAngle2 = angle + (this.get('spread') * PI);
            //recursive calls
            this.branch(iter-1, newX, newY, newAngle1, newScale);
            this.branch(iter-1, newX, newY, newAngle2, newScale);
        }
    }
});

var module;
if(typeof module == 'object'){
    module.exports = TreeFractal;
}