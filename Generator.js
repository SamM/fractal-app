class Generator
{
    constructor(options)
    {
      let generator = this;

      this.settings = {};
      this.setup=function(){};
      this.draw=function(){};

      if(typeof options == 'object') Object.keys(options).forEach(function(attr){
          generator[attr] = options[attr];
      });

      this.onSetters = [];

      this.gui = new GeneratorGui(this);

    }

    /*setup()
    {
      //override this
    }
    draw()
    {
      //override this
    }*/

    saveImage(fileName){
        fileName = !fileName? 'export':fileName;//TODO: display a save file dialog so user can choose name
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
    }

    set(name, value){
        let generator = this;
        this.settings[name] = value;
        this.onSetters.forEach(function(onSet){
            if(typeof onSet == 'function'){
                onSet.call(generator, name, value);
            }
        })
        return generator;
    }

    onSet(fn, remove){
        if(typeof fn == 'function'){
            if(remove){
                var i = this.onSetters.indexOf(fn);
                if(i > -1){
                    this.onSetters.splice(i,1);
                }
            }else{
                this.onSetters.push(fn);
            }

        }
        return this;
    }

    get(name){
        return this.settings[name];
    }
}

if(typeof module == 'object'){
    module.exports = Generator;
}
