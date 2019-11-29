class Tab{
    constructor(that){
      this.box = that;
      this.options = {
          btns:["按钮一","按钮二","按钮三"],
          content:[111,222,333]
      }
    }
    init(options){
        $.extend(true,this.options,options)
        this.createBtn();
        this.createDiv();
        this.events();
    }



    createBtn(){
        this.options.btns.forEach((item,i)=>{
            this.box.append($(`<button class="${i==0?"active":""}>${item}</button>"`))
        })
    }
  
    createDiv(){
        this.options.content.forEach((item,index)=>{
            this.box.append($(`<div calss="${index==0?"show":""}">${item}</div>`))
        })
    }

    events(){
        this.btns = this.box.find("button");
        this.divs = this.box.find("div");
        let that = this;
        this.btns.click(function(){
            $(this).addClass("active").siblings().removeClass("active");
            that.divs.eq($(this).index("button")).addClass("show").siblings("div").removeClass("show")
        });
    }
}


class Drag{
    constructor(that){
        this.box = that;
        this.unalteredX = 0;
        this.unalteredY = 0;
    }

    position(){
        this.box.css({
            position:"absolute",
            top:0,
            left:0
        })
    }
 
    mousedown(){
        let that = this;
        this.box.mousedown(function(e){
            this.unalteredX = e.pageX - $(this).offset().left;
            this.unalteredY = e.pageY - $(this).offset().top;
            that.mousemove();
            that.mouseup();
            return false
        })
    }

    mousemove(){
        let that = this;
        $(document).mousemove(function(e){
          that.box.css({
              top:e.pageY - that.unalteredY,
              left:e.pageX - that.unalteredX
          })
        })
    }
    
    mouseup(){
        $(document).mouseup(function(e){
            $(this).off("mousemove");
            $(this).off("nouseup")
        })
    }
}

$.fn.extend({
    tabs:function(options){
        let t = new Tab(this);
        t.init(options);
        return this ;
    },
    dialog:function(){
        let d = new Drag(this);
        d.position();
        d.mousedown()
    }
})