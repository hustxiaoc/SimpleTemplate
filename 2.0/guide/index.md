## 综述

SimpleTemplate是一个简单轻量的前端模板引擎,模板语法采用原生的js语法，里边支持传入外部自定义函数。

* 版本：1.0
* 作者：淘杰
* 标签：
* demo：[http://gallery.kissyui.com/SimpleTemplate/1.0/demo/index.html](http://gallery.kissyui.com/SimpleTemplate/1.0/demo/index.html)

## 初始化组件

    S.use('gallery/SimpleTemplate/1.0/index', function (S, SimpleTemplate) {
         var SimpleTemplate = new SimpleTemplate(config,helper);
    })

## API说明
### init(config,helper)
    初始化方法
    config数据结构
     tpl:模板字符串 required
     left:模板左分隔符 optional default {{
     right:模板右分隔符 optional default }}
     data:需要渲染的数据  optional
    helper外部函数对象
    例如
    {
          handleBigNumber:function(str){
                return (''+str).replace( /\B(?=(?:\d{3})+$)/g, ',');
          }
    }
    handleBigNumber函数用于转化大数字，比如12345->12,345
    那么在模板中就可以直接这么用  {{ = handleBigNumber(number) }}
    
     
### render(data)
    根据所传data渲染出html代码

### 相关属性
    tpl:模板字符串
    left:模板左分隔符
    right:模板右分隔符
    compiled:根据模板字符串动态生成的匿名函数，render方法内部会调用此函数，用toString方法可查看函数源码用于调试

