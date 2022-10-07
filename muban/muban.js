######模板列表1
网页-MXone Pro：/index.php/vod/search/page/#PN#/wd/#KEY#.html
网页-MX Pro：/index.php/vod/search/page/#PN#/wd/#KEY#.html
网页-MX(采集站)：/index.php/vod/search/page/#PN#/wd/#KEY#.html
接口-CMS(json)：?ac=videolist&wd=#KEY#&pg=#PN#
接口-CMS(xml)：?ac=videolist&wd=#KEY#&pg=#PN#
接口-CMS(mc10)：?ac=videolist&wd=#KEY#&pg=#PN#
接口-APP(vod)：?wd=#KEY#&page=#PN#
接口-APP(app)：search?test=#KEY#&pg=#PN#
接口-APP(v1)：search?test=#KEY#&pg=#PN#
接口-APP(v2)：search?test=#KEY#&pg=#PN#
接口-iptv(zm)：?ac=list&zm=#KEY#&page=#PN#
接口-iptv(wd)：?ac=list&wd=#KEY#&page=#PN#
######UA列表2
网页：Mozilla/5.0
接口(cms/iptv)：Dalvik/2.1.0
接口(vod)：okhttp/4.1.0
接口(app/v1/v2)：Dart/2.14 (dart:io)
######本地新增3
var key=getVar("输入内容");
var 记录=[];
if(key.indexOf("==http")!=-1&&key.indexOf("#KEY#")!=-1&&(key.indexOf("网页-MXone Pro")!=-1||key.indexOf("网页-MX Pro")!=-1||
key.indexOf("网页-MX(采集站)")!=-1||key.indexOf("接口-CMS(json)")!=-1||key.indexOf("接口-CMS(xml)")!=-1||
key.indexOf("接口-CMS(mc10)")!=-1||key.indexOf("接口-APP(vod)")!=-1||key.indexOf("接口-APP(app)")!=-1||key.indexOf("接口-APP(v1)")!=-1||
key.indexOf("接口-APP(v2)")!=-1||key.indexOf("接口-APP(iptv)")!=-1)){
    var filename='站源.json';
    var 输入条目=key.match(/.+==http.+/g);
    for(var j=0;j<输入条目.length;j++){
        var title=e2Rex(输入条目[j],".tz(==)");
        var index=e2Rex(输入条目[j],".ty(==).tz(@@)");
        var search=e2Rex(输入条目[j],".ty(@@).tz(--)");
        var type=e2Rex(输入条目[j],".ty(--).tz(**)");
        var UA=e2Rex(输入条目[j],".ty(**)");
        记录.push({"站名":title,"首页地址":index,"搜索地址":search,"类型":type,"UA":UA});
    }
    if(readStr(filename)){
        var 新记录=JSON.parse(readStr(filename));
    }else{
        var 新记录=[];
    }
    for(var i in 记录){
        var 当前条目=[];当前条目.push(记录[i]);
        if(新记录.length==0){
            新记录.push({title:记录[i].类型,data:当前条目});
        }else{
            let res=新记录.some(item=>{
                if(item.title==记录[i].类型){
                    item.data=当前条目.concat(item.data.filter(d=>d.首页地址!=记录[i].首页地址));
                    return true
                }
            });
            if(!res){
                新记录.push({title:记录[i].类型,data:当前条目});
            }
        }
    }
    writeStr(filename,JSON.stringify(新记录));
    alert(title+"\n规则写入成功");
}else{
    alert("输入格式错误，请重新输入");
}
######站源分类4
var 首页地址=getVar("首页地址");
var 类型=getVar("类型");
var UA=getVar("UA");
function 头部导航(){
    var res={};var items=[];
    if(类型.indexOf("CMS")!=-1){
        for (var j=0;j<列表.length;j++){
          var 标题=e2Rex(列表[j],标题规则);
          var 地址=e2Rex(列表[j],地址规则);
          var 分类地址=首页地址+前+地址+后;
          items.push({title:标题,url:分类地址,mode:"OKHTTP",翻页后:翻页后});
        }
    }else if(类型.indexOf("网页")!=-1){
        for(var j=0;j<列表.length;j++){
          if(e2Rex(列表[j],地址规则).indexOf("id")!=-1){
            var 标题=e2Rex(列表[j],标题规则);
            var 地址=e2Rex(列表[j],地址规则).split("id/")[1].split(".html")[0];
            var 分类地址=首页地址+前+地址+后;
            items.push({title:标题,url:分类地址,mode:"JSOUP",翻页后:翻页后});
          }
        }
    }
    res.data=items;
    return JSON.stringify(res);
}
if(类型.indexOf("网页")!=-1){
    var 源码=getHttp(JSON.stringify({url:首页地址,redirect:false,head:{"User-Agent":UA}}));
    if(类型.indexOf("MXone Pro")!=-1){
        var 列表=e2Arr(源码,".css(div.sidebar).css(div).i(0).css(ul li a)");
        var 标题规则=".t()";
        var 地址规则=".css(a).a(href)";
        var 前="/index.php/vod/show/id/";
        var 后="/page/";
        var 翻页后='.html';
        头部导航();
    }else if(类型.indexOf("MX Pro")!=-1){
        var 列表=e2Arr(源码,".css(ul.drop-content-items.grid-items li.grid-item).or().css(div.nav ul li)");
        var 标题规则=".t()";
        var 地址规则=".css(a).a(href)";
        var 前="/index.php/vod/show/id/";
        var 后="/page/";
        var 翻页后=".html";
        头部导航();
    }else if(类型.indexOf("MX(采集站)")!=-1){
        var 列表=e2Arr(源码,".css(ul.stui-header__menu.clearfix li.)");
        var 标题规则=".t()";
        var 地址规则=".css(a).a(href)";
        var 前="&ac=videolist&t=";
        var 后="&pg=#PN#";
        头部导航();
    }
}else if(类型.indexOf("app")!=-1||类型.indexOf("v1")!=-1||类型.indexOf("v2")!=-1){
    var URL=首页地址+"nav";
    var 源码=getHttp(JSON.stringify({url:URL,redirect:false,head:{"User-Agent":UA}}));
    if(类型.indexOf("app")!=-1){
        var 列表=e2Arr(源码,".json(list).json(type_name)");
        var 标题规则=".json(type_name)";
        var 地址规则=".json(type_id)";
        var 前="&ac=videolist&t=";
        var 后="&pg=#PN#";
        头部导航();
    }else if(类型.indexOf("v1")!=-1){
        var 列表=e2Arr(源码,".json(data)");
        var 标题规则=".json(type_name)";
        var 地址规则=".json(type_id)";
        var 前="&ac=videolist&t=";
        var 后="&pg=#PN#";
        头部导航();
    }else if(类型.indexOf("v2")!=-1){
        var 列表=e2Arr(源码,".json(data)");
        var 标题规则=".json(type_name)";
        var 地址规则=".json(type_id)";
        var 前="&ac=videolist&t=";
        var 后="&pg=#PN#";
        头部导航();
    }
}else if(类型.indexOf("vod")!=-1){
    var URL=首页地址+"/types";
    var 源码=getHttp(JSON.stringify({url:URL,redirect:false,head:{"User-Agent":UA}}));
    var 列表=e2Arr(源码,".json(data).json(list)");
    var 标题规则=".json(type_name)";
    var 地址规则=".json(type_id)";
    var 前="ac=videolist&t=";
    var 后="&pg=#PN#";
    头部导航();
}else if(类型.indexOf("CMS")!=-1){
    var URL=首页地址+"?ac=list";
    var 源码=getHttp(JSON.stringify({url:URL,redirect:false,head:{"User-Agent":UA}}));
    if(类型.indexOf("json")!=-1){
        var 列表=e2Arr(源码,".json(class)");
        var 标题规则=".json(type_name)";
        var 地址规则=".json(type_id)";
        var 前="?ac=videolist&t=";
        var 后="&pg=";
        var 翻页后='';
        头部导航();
    }else if(类型.indexOf("xml")!=-1){
        var 列表=e2Arr(源码,".xml(class ty)");
        var 标题规则=".t()";
        var 地址规则=".a(id)";
        var 前="?ac=videolist&t=";
        var 后="&pg=#PN#";
        头部导航();
    }else if(类型.indexOf("mc10")!=-1){
        var 列表=e2Arr(源码,".json(class)");
        var 标题规则=".json(type_name)";
        var 地址规则=".json(type_id)";
        var 前="?ac=videolist&t=";
        var 后="&pg=#PN#";
        头部导航();
    }
}else if(类型.indexOf("iptv")!=-1){
    var URL=首页地址+"?ac=flitter";
    var 源码=getHttp(JSON.stringify({url:URL,redirect:false,head:{"User-Agent":UA}}));
    var 列表=e2Arr(源码,".json(list).json(type_name)");
    var 标题规则=".json(type_name)";
    var 地址规则=".json(type_id)";
    var 前="&ac=videolist&t=";
    var 后="&pg=#PN#";
    头部导航();
}
######分类地址判断
