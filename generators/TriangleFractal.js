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
        file_name: "My Fractal"
    },
    setup: function(){
        var generator = this;
        createCanvas(this.get('width'), this.get('height'));
        if(this.gui.constructed){
            this.gui.construct(false, true);
        }else{
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
            params.string('file_name', 1, 128);
            params.button('Save Image as PNG', function(){
                var fileName = generator.settings.file_name;
                var canvas = document.querySelector('.p5Canvas');
                if(!canvas){
                    alert('There is no canvas image to save.');
                    return;
                }
                if(typeof savePNGImage !== 'function'){
                    throw new Error('savePNGImage.js file has not been imported');
                }
                savePNGImage(canvas, fileName).then(function(path){
                    alert('Successfully saved to this path:\n'+path+'\n\nPress [ Esc ] to exit...')
                }).catch(function(){
                    alert('OH NO! There was an error when saving the image at the path you specified. You might not have permission to write here, or the directory might not exist.\nPlease try another path and/or filename when saving again.\n\nPress [ Esc ] to exit...')
                });
            });
            this.onSet(function(){
                redraw();
            })
        }
        noLoop();
        redraw();
    },
    /*/
    /// Fore-shadowing... 
    ...
    getBitSize: function(depth){
        function solve(depth){
            if(depth < 0) return 0;
            return Math.pow(4, depth) + solve(depth -1);
        }
        return solve(depth);
        //return Math.pow(2, Math.pow(4, depth));
    },
    drawFromCode : function(code, x, y, radius, angle){
        var max_bit = 0;
        if(typeof code == 'string' && code.length){
            while(code.length <= this.getBitSize(max_bit)){
                max_bit++;
            }
            max_bit--;
            if(max_bit<0) return; // Draw no triangles
        }else{
            return;
        }
        var bit_size = this.getBitSize(max_bit);
        function drawTriangle(code, bit_size){
            if(bit_size == 4){

            }
        }
    },
    /*/
    draw: function(){
        resizeCanvas(this.settings.width, this.settings.height, true);
        background(this.settings.background_color);
        translate(this.settings.width/2, this.settings.height/2);
        strokeCap(SQUARE);
        if(this.settings.stroke){
            if(Array.isArray(this.settings.stroke)) stroke(this.settings.stroke[0],this.settings.stroke[1],this.settings.stroke[2],typeof this.settings.stroke[3] == 'number'?this.settings.stroke[3]:255);
            else stroke(this.settings.stroke);
        }
        this.drawFractal(this.settings.max_iters, this.settings.x, this.settings.y, this.settings.radius, this.settings.angle*PI*2);
    },
    drawFractal: function(iter, x, y, radius, angle, no_stroke){
        if(this.settings.max_iters < 0) return;
        var max_iter = this.settings.max_iters;
        var progress = 1-(iter/max_iter);
        if(iter>0){

            if(progress > 0 && Math.random() < this.settings.delete_chance) return;

            strokeWeight(1);

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
            triangle(
                x+(radius*cos(angle)), y+(radius*sin(angle)),
                x+(radius*cos(angle+third)), y+(radius*sin(angle+third)),
                x+(radius*cos(angle+third+third)), y+(radius*sin(angle+third+third))
            );   

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