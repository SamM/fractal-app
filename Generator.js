function Generator(options){
    var generator = this;
    this.settings = {};
    this.setup = function(){};
    this.draw = function(){};

    if(typeof options == 'object') Object.keys(options).forEach(function(attr){
        generator[attr] = options[attr];
    });

    this.onSet = [];
    this.set = function(name, value){
        this.settings[name] = value;
        this.onSet.forEach(function(onSet){
            if(typeof onSet == 'function'){
                onSet.call(generator, name, value);
            }
        })
        return generator;
    };
    this.get = function(name){
        return this.settings[name];
    }
    
    this.interface = [];
    this.gui = function(build){
        if(typeof build == 'object'){
            // Build GUI from object
        }
        return generator.gui;
    }
    this.gui.constructed = false;
    this.gui.element = null;
    this.gui.construct = function(parent){
        if(this.constructed){
            this.destruct();
        }
        var gui = this;
        this.element = document.createElement('div');
        this.element.className = 'gui';
        this.element.style.position = 'relative';

        var toggleButton = document.createElement('div');
        toggleButton.className = "gui-toggle-menu";
        toggleButton.innerText = "Open / Close Settings";
        this.open = false;
        function onClick(e){
            gui.open = !gui.open;
            if(gui.open){
                generator.interface.forEach(function(section){
                    section.element.style.display = 'block';
                });
            }else{
                generator.interface.forEach(function(section){
                    section.element.style.display = 'none';
                });
            }
        }
        toggleButton.addEventListener('click', onClick)
        this.element.appendChild(toggleButton);


        generator.interface.forEach(function(section){
            section.construct(gui.element);
            section.element.style.display = 'none';
        });
        

        this.constructed = true;
        if(typeof parent == "object" && parent.appendChild){
            parent.appendChild(this.element);
        }
        return this.element;
    }
    this.gui.destruct = function(){
        if(!this.constructed) return;
        if(this.element && this.element.parentNode){
            this.element.parentNode.removeChild(this.element);
        }
        generator.interface.forEach(function(section){
            section.destruct();
        });
        this.constructed = false;
    }
    this.gui.onSet = function(fn, remove){
        if(typeof fn == 'function'){
            if(remove){
                var i = generator.onSet.indexOf(fn);
                if(i > -1){
                    generator.splice(i,1);
                }   
            }else{
                generator.onSet.push(fn);
            }

        }
        return generator.gui;
    }
    this.gui.section = function(name){
        var Section = function(name){
            this.name = name;
            this.components = [];
            this.element = null;
        }
        Section.prototype.number = function(setting_name, min, max, increment){
            var NumberComponent = function(name, min, max, increment){
                this.name = name;
                this.min = typeof min == 'string' ? min: typeof min == 'number' ? min : 0;
                this.max = typeof max == 'string' ? max: typeof max == 'number' ? max : this.min+1;
                var distance = this.min < this.max ? this.max-this.min: this.min-this.max;
                distance = Math.abs(distance);
                this.increment = typeof increment == 'number' ? Math.abs(increment) < distance ? Math.abs(increment) : distance : 1;
                this.element = null;
            }
            NumberComponent.prototype.constructed = false;
            NumberComponent.prototype.construct = function(parent){
                this.destruct();
                var component = this;
                this.element = document.createElement('li');
                this.element.style.listStyle = "none";
                this.element.style.margin = "0";
                this.element.style.padding = "0";
                this.element.style.display = "block";
                this.element.style.position = "relative";
                this.element.style.height = '50px';
                this.element.className = 'gui-component number-component';
                var label = document.createElement('label');
                label.style.position = 'absolute';
                label.style.left = '0';
                label.style.width = '40%';
                label.style.height = '100%';
                label.innerText = this.name;
                label.style.fontWeight = "bold";
                label.className = "gui-label";
                this.element.appendChild(label);
                var slider = document.createElement('div');
                slider.style.position = 'absolute';
                slider.style.right = '20%';
                slider.style.width = '40%';
                slider.style.height = '100%';
                slider.className = 'gui-slider';
                this.element.appendChild(slider);

                var sliderActive = false;
                var sliderHover = false;

                function getValuefromString(string){
                    function doAddSubtract(string){
                        var minus = string.indexOf('-');
                        var plus = string.indexOf('+');
                        if(minus > -1){
                            if(minus == 0) return 0 - doDivide(string.slice(1));
                            return parseFloat(string.slice(0,minus)) - doDivide(string.slice(minus+1));
                        }else if(plus > -1){
                            if(plus == 0) return doDivide(string.slice(1));
                            return parseFloat(string.slice(0,plus)) + doDivide(string.slice(plus+1));
                        }
                        return doDivide(string);
                    }
                    function doDivide(string){
                        var slash = string.indexOf('/');    
                        if(slash > -1){
                            return getValue(string.slice(0, slash)) / parseFloat(string.slice(slash+1));
                        }else{
                            return getValue(string);
                        }
                    }
                    function getValue(string){
                        return generator.get(string);
                    }
                    return doAddSubtract(string);
                }

                function valueToPercentage(value){
                    var min = component.min;
                    if(typeof min == 'string'){
                        min = getValuefromString(min);
                    }
                    var max = component.max;
                    if(typeof max == 'string') max = getValuefromString(max);
                    var distance = min < max ? max-min : min-max;
                    return ((value-min)/Math.abs(distance)) * 100;
                }

                function percentageToValue(percentage){
                    var min = component.min;
                    if(typeof min == 'string') min = getValuefromString(min);
                    var max = component.max;
                    if(typeof max == 'string') max = getValuefromString(max);
                    var distance = min < max ? max-min : min-max;
                    var value = distance * (percentage / 100);
                    var incr = component.increment;
                    var round = value % increment;
                    value = round >= incr/2 ? value - round + incr : value - round;
                    round = value % increment;
                    value = value - round;
                    value = value + min;
                    if(value<min) value = min;
                    if(value>max) value = max;
                    var trim = value.toString()
                    var point = trim.indexOf('.');
                    if(point >-1){
                        trim = trim.replace(/0{5,}[0-9]+$/, '');
                        if(trim.search(/9{5,}[0-9]*$/)>-1){
                            trim = trim.replace(/9{5,}[0-9]*$/, '');
                            trim = trim.slice(0,-1) + (parseInt(trim.slice(-1))+1);
                        }
                    }
                    return parseFloat(trim);
                }

                var bar = document.createElement('div');
                bar.style.position = 'absolute';
                bar.style.left = '0';
                bar.style.width = valueToPercentage(generator.get(component.name))+"%";
                bar.style.height = '100%';
                bar.style.backgroundColor = 'rgba(0,0,0,0.2)';
                slider.appendChild(bar);

                var value = document.createElement('input');
                value.type = 'text';
                value.style.position = 'absolute';
                value.style.right = '0';
                value.style.width = '19%';
                value.style.height = '100%';
                value.className = 'gui-input';
                value.value = generator.get(component.name);
                this.element.appendChild(value);

                value.addEventListener('change', function(e){
                    var min = component.min;
                    if(typeof min == 'string') min = getValuefromString(min);
                    var max = component.max;
                    if(typeof max == 'string') max = getValuefromString(max);
                    var num = parseFloat(value.value);
                    if(isNaN(num)){
                        value.value = generator.get(component.name);
                        return;
                    }else if(num < min){
                        num = min;
                        value.value = num;
                    }else if(num > max){
                        num = max;
                        value.value = num;
                    }
                    generator.set(component.name, num);
                    var percentage = valueToPercentage(num);
                    bar.style.width = percentage+"%";
                })

                slider.addEventListener('mousedown', function(){
                    sliderActive = true;
                });

                slider.addEventListener('click', function(e){
                    var coords = getAbsolutePosition(slider);
                    var x = e.pageX - coords.x;
                    var width = slider.clientWidth-1;
                    var percentage = (x/width)*100;
                    var newValue = percentageToValue(percentage);
                    value.value = newValue;
                    generator.set(component.name, newValue);
                    bar.style.width = percentage+"%";
                });
                function getAbsolutePosition(element) {
                    var r = { x: element.offsetLeft, y: element.offsetTop };
                    if (element.offsetParent) {
                      var tmp = getAbsolutePosition(element.offsetParent);
                      r.x += tmp.x;
                      r.y += tmp.y;
                    }
                    return r;
                  };
                slider.addEventListener('mousemove', function(e){
                    if(sliderActive){
                        var coords = getAbsolutePosition(slider);
                        var x = e.pageX - coords.x;
                        var width = slider.clientWidth;
                        var percentage = (x/width)*100;
                        var newValue = percentageToValue(percentage);
                        if(newValue != generator.get(component.name)){
                            value.value = newValue;
                            generator.set(component.name, newValue);
                        }
                        bar.style.width = percentage+"%";
                    }
                })
                this.onMouseUp = function(){
                    sliderActive = false;
                };
                document.addEventListener('mouseup', this.onMouseUp);

                
                if(typeof parent == "object" && parent.appendChild){
                    parent.appendChild(this.element);
                }
                return this.element;
            };
            NumberComponent.prototype.destruct = function(){
                if(this.element && this.element.parentNode){
                    this.element.parentNode.removeChild(this.element);
                }
                if(this.onMouseUp) document.removeEventListener('mouseup', this.onMouseUp);
                this.element = null;
                this.constructed = false;
            }
            var component = new NumberComponent(setting_name, min, max, increment);
            this.components.push(component)
        }
        Section.prototype.constructed = false;
        Section.prototype.construct = function(parent){
            this.destruct();
            var section = this;
            this.element = document.createElement('ul');
            this.element.style.listStyle = "none";
            this.element.style.margin = "0";
            this.element.style.padding = "0";
            this.element.className = 'gui-section';
            this.components.forEach(function(component){
                component.construct(section.element);
            });
            if(typeof parent == "object" && parent.appendChild){
                parent.appendChild(this.element);
            }
            this.constructed = true;
            return this.element;
        };
        Section.prototype.destruct = function(){
            this.components.forEach(function(component){
                component.destruct();
            });
            if(this.element && this.element.parentNode){
                this.element.parentNode.removeChild(this.element);
            }
            this.element = null;
            this.constructed = false;
        }
        var section = new Section(name);
        generator.interface.push(section);
        return section;
    };
}

if(typeof module == 'object'){
    module.exports = Generator;
}