function Generator(options){
    var generator = this;
    this.settings = {};
    this.setup = function(){};
    this.draw = function(){};

    if(typeof options == 'object') Object.keys(options).forEach(function(attr){
        generator[attr] = options[attr];
    });

    this.onSetters = [];

    this.set = function(name, value){
        this.settings[name] = value;
        this.onSetters.forEach(function(onSet){
            if(typeof onSet == 'function'){
                onSet.call(generator, name, value);
            }
        })
        return generator;
    };

    this.onSet = function(fn, remove){
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
    this.gui.onSetters = [];
    this.gui.constructed = false;
    this.gui.element = null;
    this.gui.construct = function(parent, reconstruct){
        if(this.constructed){
            if(reconstruct){
                var div = document.createElement('div');
                parent = this.element.parentNode;
                parent.replaceChild(div, this.element);
                this.destruct();
                this.element = div;
            }else{
                this.destruct();
                this.element = document.createElement('div');
            }
        }else{
            this.element = document.createElement('div');
        }
        var gui = this;
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
    this.gui.show = function(display){ 
        if(!this.element) return this;
        this.element.style.display = display?display:"block"; 
        return this; 
    }
    this.gui.hide = function(){ 
        if(!this.element) return this;
        this.element.style.display = "none"; 
        return this; 
    }
    this.gui.destruct = function(){
        if(!this.constructed) return;
        if(this.element && this.element.parentNode){
            this.element.parentNode.removeChild(this.element);
        }
        generator.interface.forEach(function(section){
            section.destruct();
        });
        this.onSetters = [];
        this.constructed = false;
    }
    this.gui.onSet = function(fn, remove){
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
    this.gui.section = function(name){
        var gui = this;
        var Section = function(name){
            this.name = name;
            this.components = [];
            this.element = null;
            this.onSetters = [];
        }
        Section.prototype.static = function(setting_name, formatter){
            var section = this;
            var StaticComponent = function(name, formatter){
                this.name = name;
                this.formatter = typeof formatter == 'function' ? formatter : function(a){ return a; };
                this.onSetters = [];
            }
            StaticComponent.prototype.constructed = false;
            StaticComponent.prototype.destruct = function(){
                if(this.element && this.element.parentNode){
                    this.element.parentNode.removeChild(this.element);
                }
                this.element = null;
                this.constructed = false;
                this.onSetters = [];
            }
            StaticComponent.prototype.onSet = function(fn, remove){
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
            StaticComponent.prototype.set = function(value){
                var component = this;
                this.onSetters.forEach(function(fn){
                    fn.call(component, value);
                })
                section.set(this, value);
                return this;
            }
            StaticComponent.prototype.construct = function(parent, reconstruct){
                if(this.constructed){
                    if(reconstruct){
                        var el = document.createElement('li');
                        parent = this.element.parentNode;
                        parent.replaceChild(el, this.element);
                        this.destruct();
                        this.element = el;
                    }else{
                        this.destruct();
                        this.element = document.createElement('li');
                    }
                }else{
                    this.element = document.createElement('li');
                }
                this.element.style.listStyle = "none";
                this.element.style.margin = "0";
                this.element.style.padding = "0";
                this.element.style.display = "block";
                this.element.style.position = "relative";
                this.element.style.height = '50px';
                this.element.className = 'gui-component static-component';
                var label = document.createElement('label');
                label.style.position = 'absolute';
                label.style.left = '0';
                label.style.width = '40%';
                label.style.height = '100%';
                label.innerText = this.name;
                label.style.fontWeight = "bold";
                label.className = "gui-label";
                this.element.appendChild(label);
                var value = document.createElement('div');
                value.style.position = 'absolute';
                value.style.right = '0';
                value.style.width = '60%';
                value.style.height = '100%';
                value.className = 'gui-static-value';
                value.innerText = this.formatter(generator.get(this.name));
                this.element.appendChild(value);

                if(typeof parent == "object" && parent.appendChild){
                    parent.appendChild(this.element);
                }
                return this.element;
            }
            var component = new StaticComponent(setting_name, formatter);
            this.components.push(component)
            return component;
        };
        Section.prototype.string = function(setting_name, min, max, formatter){
            var section = this;
            var StringComponent = function(name, min, max, formatter){
                this.name = name;
                this.min = typeof min == 'number' ? min >= 0 ? min : 0 : 0;
                this.max = typeof max == 'number' ? max > 0 ? max : 1 : 64;
                this.formatter = typeof formatter == 'function' ? formatter : function(a){ return a; };
                this.onSetters = [];
            }
            StringComponent.prototype.constructed = false;
            StringComponent.prototype.destruct = function(){
                if(this.element && this.element.parentNode){
                    this.element.parentNode.removeChild(this.element);
                }
                this.element = null;
                this.constructed = false;
                this.onSetters = [];
            }
            StringComponent.prototype.onSet = function(fn, remove){
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
            StringComponent.prototype.set = function(value){
                var component = this;
                this.onSetters.forEach(function(fn){
                    fn.call(component, value);
                })
                section.set(this, value);
                return this;
            }
            StringComponent.prototype.construct = function(parent, reconstruct){
                if(this.constructed){
                    if(reconstruct){
                        var el = document.createElement('li');
                        parent = this.element.parentNode;
                        parent.replaceChild(el, this.element);
                        this.destruct();
                        this.element = el;
                    }else{
                        this.destruct();
                        this.element = document.createElement('li');
                    }
                }else{
                    this.element = document.createElement('li');
                }
                this.element.style.listStyle = "none";
                this.element.style.margin = "0";
                this.element.style.padding = "0";
                this.element.style.display = "block";
                this.element.style.position = "relative";
                this.element.style.height = '50px';
                this.element.className = 'gui-component static-component';
                var label = document.createElement('label');
                label.style.position = 'absolute';
                label.style.left = '0';
                label.style.width = '40%';
                label.style.height = '100%';
                label.innerText = this.name;
                label.style.fontWeight = "bold";
                label.className = "gui-label";
                this.element.appendChild(label);
                var value = document.createElement('input');
                value.type = 'text';
                value.style.position = 'absolute';
                value.style.right = '0';
                value.style.width = '60%';
                value.style.height = '100%';
                value.className = 'gui-input';
                value.value = this.formatter(generator.get(component.name));
                this.element.appendChild(value);

                value.addEventListener('change', function(e){
                    var min = component.min;
                    var max = component.max;
                    var str = value.value;
                    if((str.length < min)||(str.length > max)){
                        value.value = generator.get(component.name);
                        return;
                    }
                    str = component.formatter(str);
                    component.set(str);
                })

                if(typeof parent == "object" && parent.appendChild){
                    parent.appendChild(this.element);
                }
                return this.element;
            }
            var component = new StringComponent(setting_name, min, max, formatter);
            this.components.push(component)
            return component;
        };
        Section.prototype.button = function(buttonText, onClick){
            var section = this;
            var ButtonComponent = function(name, onClick){
                this.name = name;
                this.onClick = typeof onClick == 'function' ? onClick : function(a){ return a; };
                this.onSetters = [];
            }
            ButtonComponent.prototype.constructed = false;
            ButtonComponent.prototype.destruct = function(){
                if(this.element && this.element.parentNode){
                    this.element.parentNode.removeChild(this.element);
                }
                this.element = null;
                this.constructed = false;
                this.onSetters = [];
            }
            ButtonComponent.prototype.onSet = function(fn, remove){
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
            ButtonComponent.prototype.set = function(){
                var component = this;
                this.onSetters.forEach(function(fn){
                    fn.call(component);
                })
                return this;
            }
            ButtonComponent.prototype.construct = function(parent, reconstruct){
                if(this.constructed){
                    if(reconstruct){
                        var el = document.createElement('li');
                        parent = this.element.parentNode;
                        parent.replaceChild(el, this.element);
                        this.destruct();
                        this.element = el;
                    }else{
                        this.destruct();
                        this.element = document.createElement('li');
                    }
                }else{
                    this.element = document.createElement('li');
                }
                this.element.style.listStyle = "none";
                this.element.style.margin = "0";
                this.element.style.padding = "0";
                this.element.style.display = "block";
                this.element.style.position = "relative";
                this.element.style.height = '50px';
                this.element.className = 'gui-component static-component';
                var button = document.createElement('button');
                button.style.position = 'absolute';
                button.style.left = '0';
                button.style.right = '0';
                button.style.width = 'auto';
                button.style.height = '100%';
                button.innerText = this.name;
                button.style.fontWeight = "bold";
                button.className = "gui-button";
                this.element.appendChild(button);

                button.addEventListener('click', function(e){
                    component.onClick();
                    component.set();
                })

                if(typeof parent == "object" && parent.appendChild){
                    parent.appendChild(this.element);
                }
                return this.element;
            }
            var component = new ButtonComponent(buttonText, onClick);
            this.components.push(component)
            return component;
        };
        Section.prototype.number = function(setting_name, min, max, increment){
            var section = this;
            var NumberComponent = function(name, min, max, increment){
                this.name = name;
                this.min = typeof min == 'string' ? min: typeof min == 'number' ? min : 0;
                this.max = typeof max == 'string' ? max: typeof max == 'number' ? max : this.min+1;
                var distance = this.min < this.max ? this.max-this.min: this.min-this.max;
                distance = Math.abs(distance);
                this.increment = typeof increment == 'number' ? Math.abs(increment) < distance ? Math.abs(increment) : distance : 1;
                this.element = null;
                this.onSetters = [];
            }
            NumberComponent.prototype.constructed = false;
            NumberComponent.prototype.construct = function(parent, reconstruct){
                if(this.constructed){
                    if(reconstruct){
                        var el = document.createElement('li');
                        parent = this.element.parentNode;
                        parent.replaceChild(el, this.element);
                        this.destruct();
                        this.element = el;
                    }else{
                        this.destruct();
                        this.element = document.createElement('li');
                    }
                }else{
                    this.element = document.createElement('li');
                }
                var component = this;
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
                    component.set(num);
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
                    component.set(newValue);
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
                            component.set(newValue);
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
                this.onSetters = [];
            }
            NumberComponent.prototype.onSet = function(fn, remove){
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
            NumberComponent.prototype.set = function(value){
                var component = this;
                this.onSetters.forEach(function(fn){
                    fn.call(component, value);
                })
                section.set(this, value);
                return this;
            }
            var component = new NumberComponent(setting_name, min, max, increment);
            this.components.push(component)
            return component;
        }
        Section.prototype.constructed = false;
        Section.prototype.construct = function(parent, reconstruct){
            if(this.constructed){
                if(reconstruct){
                    var el = document.createElement('ul');
                    parent = this.element.parentNode;
                    parent.replaceChild(el, this.element);
                    this.destruct();
                    this.element = el;
                }else{
                    this.destruct();
                    this.element = document.createElement('ul');
                }
            }else{
                this.element = document.createElement('ul');
            }
            var section = this;
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
            this.onSetters = [];
        }
        Section.prototype.onSet = function(fn, remove){
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
        };
        Section.prototype.set = function(component, value){
            var section = this;
            this.onSetters.forEach(function(fn){
                fn.call(section, component, value);
            })
            gui.set(this, component, value);
            return this;
        }
        var section = new Section(name);
        generator.interface.push(section);
        return section;
    };

    this.gui.set = function(section, component, value){
        var gui = this;
        this.onSetters.forEach(function(fn){
            fn.call(gui, section, component, value);
        })
        generator.set(component.name, value);
        return this;
    }
}

if(typeof module == 'object'){
    module.exports = Generator;
}