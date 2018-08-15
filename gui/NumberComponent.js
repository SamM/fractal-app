class NumberComponent extends ComponentBase
{

  constructor(section, name, min, max, increment)
  {
      super(section,name);
      this.min = typeof min == 'string' ? min: typeof min == 'number' ? min : 0;
      this.max = typeof max == 'string' ? max: typeof max == 'number' ? max : this.min+1;
      var distance = this.min < this.max ? this.max-this.min: this.min-this.max;
      distance = Math.abs(distance);
      this.increment = typeof increment == 'number' ? Math.abs(increment) < distance ? Math.abs(increment) : distance : 1;
      this.incrementParam = increment;//to fix percentageToValue problem
  }

  construct(parent, reconstruct)
  {
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
            return component.section.generator.get(string);
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
        var round = value % component.incrementParam;
        value = round >= incr/2 ? value - round + incr : value - round;
        round = value % component.incrementParam;
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
    bar.style.width = valueToPercentage(this.section.generator.get(component.name))+"%";
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
    value.value = this.section.generator.get(component.name);
    this.element.appendChild(value);

    value.addEventListener('change', function(e){
        var min = component.min;
        if(typeof min == 'string') min = getValuefromString(min);
        var max = component.max;
        if(typeof max == 'string') max = getValuefromString(max);
        var num = parseFloat(value.value);
        if(isNaN(num)){
            value.value = this.section.generator.get(component.name);
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
            if(newValue != component.section.generator.get(component.name)){
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


    if(!reconstruct && typeof parent == "object" && parent.appendChild){
        parent.appendChild(this.element);
    }

    this.constructed = true;

    return this.element;
}

  destruct()
  {
      super.destruct();
      if(this.onMouseUp)
        document.removeEventListener('mouseup', this.onMouseUp);
  }

}
