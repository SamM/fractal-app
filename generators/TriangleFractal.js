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
        colors: [],
        background_color: "#FFFFFF",
        file_name: "My Fractal",
        pattern: '',
        hide_base: false
    },
    setup: function(){
        var generator = this;
        createCanvas(this.get('width'), this.get('height'));
        if(this.gui.constructed){
            this.gui.construct(false, true);
        }else{
            this.randomizePattern();
            var params = this.gui.section('params');
            params.number('width', 10, 4000, 1)
            params.number('height', 10, 4000, 1)
            params.string('background_color', 4, 32);
            params.number('x', '-width/2', 'width/2', 1);
            params.number('y', '-height/2', 'height/2', 1);
            params.number('angle', 0, 1, 0.01);
            params.number('radius', 1, 'width', 1);
            params.number('delete_chance', 0, 1, 0.01);
            params.number('max_iters', 1, 12, 1);
            params.string('pattern', 0, 4000);
            params.button('Randomize Pattern', this.randomizePattern);
            params.button('Toggle Base Visibility', function(){
                if(generator.get('hide_base')){
                    generator.set('hide_base', false);
                }else{
                    generator.set('hide_base', true);
                }
            })
            params.button('Randomize Colors', this.randomizeColors);
            params.string('file_name', 1, 128);
            params.button('Save Image as PNG', function(){ generator.saveImage(generator.settings.file_name); });
            this.onSet(function(){
                redraw();
            });
        }
        noLoop();
        redraw();
    },
    randomizeColors: function(){
        var generator = this;
        var colors = [];
        for(var i=0; i<12; i++){
            colors.push(this.randomRGBA());
        }
        generator.set('colors', colors);
    },
    randomizePattern: function(){
        var generator = this;
        var pattern = '';
        var length = Math.ceil(Math.random()*10);
        for(var i=0; i<length; i++){
            pattern += Math.random()<generator.settings.delete_chance ? '0' : '1';
            pattern += Math.random()<generator.settings.delete_chance ? '0' : '1';
            pattern += Math.random()<generator.settings.delete_chance ? '0' : '1';
            pattern += Math.random()<generator.settings.delete_chance ? '0' : '1';
        }
        generator.set('pattern', pattern);
        var params = generator.gui.select['params'];
        if(params){
            params.select['pattern'].update();
        }
        
    },
    draw: function(){
        resizeCanvas(this.settings.width, this.settings.height, true);
        background(this.settings.background_color);
        translate(this.settings.width/2, this.settings.height/2);
        strokeCap(SQUARE);
        if(this.settings.stroke){
            if(Array.isArray(this.settings.stroke)) stroke(this.settings.stroke[0],this.settings.stroke[1],this.settings.stroke[2],typeof this.settings.stroke[3] == 'number'?this.settings.stroke[3]:255);
            else stroke(this.settings.stroke);
        }
        this.index = 0;
        this.drawFractal(this.settings.max_iters, this.settings.x, this.settings.y, this.settings.radius, this.settings.angle*PI*2);
    },
    drawFractal: function(iter, x, y, radius, angle, no_stroke){
        if(this.settings.max_iters < 0) return;
        var max_iter = this.settings.max_iters;
        var progress = 1-(iter/max_iter);
        if(iter>0){

            strokeWeight(progress);

            var third = 2*PI/3;

            var color = typeof this.settings.colors[max_iter-iter] == 'undefined' ? this.randomRGBA() : this.settings.colors[max_iter-iter];
            this.settings.colors[max_iter-iter] = color;
            if(Array.isArray(color)){
                if(!this.settings.stroke) stroke(color[0],color[1],color[2], 255);
                fill(color[0],color[1],color[2], 255);
            }else{
                if(!this.settings.stroke) stroke(color);
                fill(color);
            }

            if((progress == 0 && !this.settings.hide_base) || (progress !== 0 && this.settings.pattern[this.index%(this.settings.pattern.length+1)] == "1")){
                triangle(
                    x+(radius*cos(angle)), y+(radius*sin(angle)),
                    x+(radius*cos(angle+third)), y+(radius*sin(angle+third)),
                    x+(radius*cos(angle+third+third)), y+(radius*sin(angle+third+third))
                );
            }

            this.index++;

            var r = radius/2;
            this.drawFractal(iter-1, x+(r*cos(angle)), y+(r*sin(angle)), r, angle);
            this.drawFractal(iter-1, x+(r*cos(angle+third)), y+(r*sin(angle+third)), r, angle);
            this.drawFractal(iter-1, x+(r*cos(angle+third+third)), y+(r*sin(angle+third+third)), r, angle);
            this.drawFractal(iter-1, x, y, r, angle+PI, true);

            
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
