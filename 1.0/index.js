/**
 * @fileoverview 
 * @author 淘杰<taojie.hjp@taobao.com>
 * @module SimpleTemplate
 **/
KISSY.add(function (S) {
    var EMPTY = '',
        ENTER_REG_EXP=/\\n/g;
    /**
     * 
     * @class SimpleTemplate
     * @constructor
     * @extends Base
     */
    var default_config={
            left:"{{",
            right:"}}"
        };

    function SimpleTemplate(options,helper) {
        var args=S.makeArray(arguments);
        return this instanceof arguments.callee?this.init.apply(this,args):new arguments.callee(options,helper);
    }

    S.mix(SimpleTemplate,{
        parse:function(){
               var self=this,
                   temp,
                   i=0,
                   cached_regexp=this.cached_regexp;

               if(this.right=="}}"){
                  temp=self.tpl.replace(/(}})([^}])/g,"$1 $2").split(cached_regexp.split_1);
               }else{
                  temp=this.tpl.split(cached_regexp.split);
               }
               
                temp=S.filter(temp,function(v){
                       v=S.trim(v);
                       return v&&!(cached_regexp.right).test(v);
                });
                S.each(temp,function(v){
                    if(cached_regexp.left.test(v)){
                        v=v.replace(/@/g,'data.');
                        if(cached_regexp.left_equal.test(v)){
                           self.body.push(v.replace(cached_regexp.left_replace,'\ttemp.push($1);\n').replace(ENTER_REG_EXP,''));
                        }else{                      
                           self.body.push(v.replace(cached_regexp.left_replace_1,'$1\n').replace(ENTER_REG_EXP,''));
                        }
                    }
                    else {
                        self.__lines[i]=v;
                        self.body.push('\ttemp.push($_this.__lines['+(i++)+']);\n');
                    }
                });
                return this.body.join("");
        }
    });

    S.augment(SimpleTemplate, {
            init:function(options,helper){
                this.tpl=options.tpl;
                this.left=options.left||default_config.left;
                this.right=options.right||default_config.right;
                this.body=[];
                this.__lines={};
                this.compiled=null;
                this.data=options.data||{};
                this.helper=helper;
                this.cached_regexp={
                    'split':new RegExp('(?='+this.left+')|('+this.right+')'),
                    'split_1':new RegExp('(?='+this.left+')|(}})(?:[^}])'),
                    'left':new RegExp('^'+this.left),
                    'left_equal':new RegExp('^'+this.left+'\\s*='),
                    'left_replace':new RegExp('^'+this.left+'\\s*=(.*)'),
                    'left_replace_1':new RegExp('^'+this.left+'\\s*(.*)'),
                    'right':new RegExp(this.right)
                };
            },
            compile:function(){
                if(!this.compiled){
                    var helpers=[],helper=this.helper;
                    if(this.helper){
                        for(var h in helper){
                            if(helper.hasOwnProperty(h) && typeof helper[h] == "function"){
                                helpers.push('var '+h+'=this.helper["'+h+'"]');
                            }
                        }
                    }
                    this.compiled=new Function("data",helpers.join(";")+';var temp=[],$_this=this;\n'+SimpleTemplate.parse.call(this)+'\n return temp.join("");');
                }
                return this.compiled;
            },
            render:function(data){
                return this.compile().call(this,S.mix(this.data,data));
            }
    });
    return SimpleTemplate;
});



