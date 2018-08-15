class GeneratorGui
{
  constructor(generator, build)
  {
    //TODO: build from object
    this.generator = generator;
    this.onSetters = [];
    this.constructed = false;
    this.element = null;
    this.interface = [];
    this.select = {};
  }

  construct(parent, reconstruct)
  {
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
      toggleButton.addEventListener('click', function(e){
          gui.open = !gui.open;
          if(gui.open){
              gui.interface.forEach(function(section){
                  section.element.style.display = 'block';
              });
          }else{
              gui.interface.forEach(function(section){
                  section.element.style.display = 'none';
              });
          }
      });
      this.element.appendChild(toggleButton);

      this.interface.forEach(function(section){
          section.construct(gui.element);
          section.element.style.display = 'none';
      });


      this.constructed = true;
      if(typeof parent == "object" && parent.appendChild){
          parent.appendChild(this.element);
      }
      return this.element;
  }

  show(display)
  {
      if(!this.element)
        return this;
      this.element.style.display = display?display:"block";
      return this;
  }

  hide()
  {
      if(!this.element)
        return this;
      this.element.style.display = "none";
      return this;
  }

  update(){
      this.interface.forEach(function(section){
          section.update();
      })
      return this;
  }

  destruct()
  {
      if(!this.constructed)
        return;
      if(this.element && this.element.parentNode){
          this.element.parentNode.removeChild(this.element);
      }
      this.interface.forEach(function(section){
          section.destruct();
      });
      this.onSetters = [];
      this.constructed = false;
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

  set(section, component, value)
  {
      var gui = this;
      this.onSetters.forEach(function(fn){
          fn.call(gui, section, component, value);
      })
      this.generator.set(component.name, value);
      return this;
  }

  section(name)
  {
    var section = new Section(name, this.generator);
    this.interface.push(section);
    this.select[name] = section;
    return section;
  }
}
