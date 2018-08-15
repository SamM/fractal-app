var Generator;
if(typeof Generator != 'function' && typeof require == 'function'){
    Generator = require('../Generator');
}

var TreeFractal = new Generator({
    settings: {
        width: 1000,
        height: 1000,
        max_iters: 5,
        spread: 0.1,
        color: '#ff0000',
        scale: 0.9,
        branches: 1,
        angle: 0,
        x: 0,
        y: 0,
        unit: 50,
        file_name: "My Fractal"
    },
    setup: function(){
        var generator = this;
        createCanvas(this.get('width'), this.get('height'));
        noLoop();
        if(this.gui.constructed){
            this.gui.construct(false, true);
        }else{
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
            params.string('file_name', 1, 128);
            params.button('Save Image as PNG', function(){ generator.saveImage(generator.settings.file_name); });
            this.onSet(function(){
                redraw();
            })
        }
        noLoop();
        redraw();
        //params.color('color');
    },
    draw: function(){
        resizeCanvas(this.settings.width, this.settings.height, true);
        background(255);
        translate(this.settings.width/2, this.settings.height/2);
        rotate(-PI / 2.0);
        let start_angle = this.settings.angle * PI * 2;
        // Switch x and y and invert y here because we rotate and it inverts the axii
        this.branch(this.settings.max_iters, - this.settings.y, this.settings.x, start_angle, this.settings.unit * this.settings.scale);
    },
    branch: function(iter, x , y, angle, scale)
    {
        let progress = 1-iter/this.settings.max_iters;//0 to 1
        if(iter>0)
        {
            stroke(lerpColor(color(this.settings.color), color(255), progress));
            strokeWeight(2*(1-progress));
    
            //draw the symmetric lines each iteration
            //instead of starting the recursion multiple times
            var branches = this.settings.branches;
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
            var newScale = scale * this.settings.scale;
            var newAngle1 = angle - (this.settings.spread * PI);
            var newAngle2 = angle + (this.settings.spread * PI);
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