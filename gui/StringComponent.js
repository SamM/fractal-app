class StringComponent extends ComponentBase
{
  constructor(section, name, min, max, formatter)
  {
      super(section,name);
      this.min = typeof min == 'number' ? min >= 0 ? min : 0 : 0;
      this.max = typeof max == 'number' ? max > 0 ? max : 1 : 64;
      this.formatter = typeof formatter == 'function' ? formatter : function(a){ return a; };
  }

  construct(parent, reconstruct)
  {
    var component = this;
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
    value.value = this.formatter(this.section.generator.get(component.name));
    this.element.appendChild(value);

    var component = this;
    value.addEventListener('change', function(e){
        var min = component.min;
        var max = component.max;
        var str = value.value;
        if((str.length < min)||(str.length > max)){
            value.value = this.section.generator.get(component.name);
            return;
        }
        str = component.formatter(str);
        component.set(str);
    })

    if(!reconstruct && typeof parent == "object" && parent.appendChild){
        parent.appendChild(this.element);
    }

    this.constructed = true;

    return this.element;
  }
}
