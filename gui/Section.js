class Section
{
    constructor(name, generator){
        this.name = name;
        this.components = [];
        this.element = null;
        this.onSetters = [];
        this.generator = generator;
        this.constructed = false;
    }

    static(setting_name, formatter){
        var section = this;
        var component = new StaticComponent(this, setting_name, formatter);
        this.components.push(component);
        return component;
    }

    string(setting_name, min, max, formatter){
        var section = this;
        var component = new StringComponent(this, setting_name, min, max, formatter);
        this.components.push(component);
        return component;
    }

    button(buttonText, onClick){
        var section = this;
        var component = new ButtonComponent(this, buttonText, onClick);
        this.components.push(component);
        return component;
    }

    number(setting_name, min, max, increment){
        var section = this;
        var component = new NumberComponent(this, setting_name, min, max, increment);
        this.components.push(component);
        return component;
    }

    construct(parent, reconstruct)
    {
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
    }

    destruct()
    {
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

    onSet(fn, remove)
    {
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

    set(component, value)
    {
        var section = this;
        this.onSetters.forEach(function(fn){
            fn.call(section, component, value);
        })
        this.generator.gui.set(this, component, value);
        return this;
    }

}
