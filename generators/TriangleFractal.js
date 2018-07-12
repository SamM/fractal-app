var Generator;
if(typeof Generator != 'function' && typeof require == 'function'){
    Generator = require('../Generator');
}

var TriangleFractalGenerator = new Generator({
    settings: {
        width: 1000,
        height: 1000,
        max_iters: 5,
        delete_chance: 0.5,
        x: 0,
        y: 0,
        angle: 0,
        radius: 100,
        stroke: false,
        colors: []
    },
    setup: function(){
        createCanvas(this.get('width'), this.get('height'));
        if(this.gui.constructed) this.gui.destroy();
        var params = this.gui.section('params');
        params.number('width', 10, 4000, 1)
        params.number('height', 10, 4000, 1)
        params.number('x', '-width/2', 'width/2', 1);
        params.number('y', '-height/2', 'height/2', 1);
        params.number('angle', 0, 1, 0.01);
        params.number('radius', 1, 'width', 1);
        params.number('delete_chance', 0, 1, 0.01);
        params.number('max_iters', 1, 12, 1);
        this.gui.onSet(function(){
            redraw();
        })
        noLoop();
        redraw();
    },
    draw: function(){
        resizeCanvas(this.settings.width, this.settings.height, true);
        background(255);
        translate(this.settings.width/2, this.settings.height/2);
        if(!this.settings.stroke) noStroke();
        else{
            if(Array.isArray(this.settings.stroke)) stroke(this.settings.stroke[0],this.settings.stroke[1],this.settings.stroke[2],typeof this.settings.stroke[3] == 'number'?this.settings.stroke[3]:255);
            else stroke(this.settings.stroke);
        }
        this.drawFractal(this.settings.max_iters, this.settings.x, this.settings.y, this.settings.radius, this.settings.angle);
    },
    drawFractal: function(iter, x, y, radius, angle){
        if(this.settings.max_iters < 0) return;
        var max_iter = this.settings.max_iters;
        var progress = 1-(iter/max_iter);
        if(iter>0){

            if(progress > 0 && Math.random() < this.settings.delete_chance) return;
            var third = 2*PI/3;

            var color = typeof this.settings.colors[max_iter-iter] == 'undefined' ? this.randomRGBA() : this.settings.colors[max_iter-iter];
            this.settings.colors[max_iter-iter] = color;
            if(Array.isArray(color)){
                fill(color[0],color[1],color[2], color[3]||255);
            }else{
                fill(color);
            }
            triangle(
                x+(radius*cos(angle)), y+(radius*sin(angle)),
                x+(radius*cos(angle+third)), y+(radius*sin(angle+third)),
                x+(radius*cos(angle+third+third)), y+(radius*sin(angle+third+third))
            );   

            var r = radius/2;
            this.drawFractal(iter-1, x+(r*cos(angle)), y+(r*sin(angle)), r, angle);
            this.drawFractal(iter-1, x+(r*cos(angle+third)), y+(r*sin(angle+third)), r, angle);
            this.drawFractal(iter-1, x+(r*cos(angle+third+third)), y+(r*sin(angle+third+third)), r, angle);
            this.drawFractal(iter-1, x, y, r, angle+PI);

        }

    },
    random256: function(){
        return Math.floor(Math.random()*256);
    },
    randomRGBA: function(){
        return [this.random256(),this.random256(),this.random256(),this.random256()];
    },
    randomRGB: function(){
        return [this.random256(),this.random256(),this.random256()];
    }
});

if(typeof module == 'object'){
    module.exports = TriangleFractalGenerator;
}