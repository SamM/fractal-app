class ButtonComponent extends ComponentBase
{

  constructor(section, name, onClick)
  {
      super(section,name);
      this.onClick = typeof onClick == 'function' ? onClick : function(a){ return a; };
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

    var component = this;
    button.addEventListener('click', function(e){
        component.onClick();
        component.set();
    })

    if(typeof parent == "object" && parent.appendChild){
        parent.appendChild(this.element);
    }
    return this.element;
  }
}
