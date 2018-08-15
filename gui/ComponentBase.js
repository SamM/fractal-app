class ComponentBase
{
  constructor(section, name)
  {//call this with super(section,name) in every descendant's constructor
    this.name = name;
    this.section = section;
    this.element = null;
    this.onSetters = [];
    this.constructed = false;
  }

  destruct()
  {
      if(this.element && this.element.parentNode){
          this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
      this.onSetters = [];
      this.constructed = false;
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

  set(value)
  {
    var component = this;
    this.onSetters.forEach(function(fn){
        if(value)
          fn.call(component, value);
        else
          fn.call(component);
    })
    if(value)
      this.section.set(this, value);
    return this;
  }

  update(){
    this.construct(false, true);
  }

}
