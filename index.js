// 开启http
let http = require('http');
// 引入文件
let fs=require('fs');
// 引入path路径
let path = require('path');
// 配置网站根目录
let rootpath = path.join(__dirname,'www');
// 引入mime 第三方模块
let mime = require('mime');
// 引入querystring
let querystring=require('querystring');
// 创建服务
http.createServer((request,response)=>{
    // 根据URL请求，生成静态资源服务站的绝对地址
    let filepath=path.join(rootpath,querystring.unescape(request.url));
    //判断访问的这个路径是否存在
    let isexist = fs.existsSync(filepath);
    if(isexist){
        fs.readdir(filepath,(err,files)=>{
        // 这个readdir方法将返回一个包含“指定目录下所有文件名称”的数组对象。
            // console.log(err);
            // console.log(files);
            if(err){
                // 如果进到这里，说明是文件，不是文件夹
                // 读取文件
                fs.readFile(filepath,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        // 判断文件的类型
                        response.writeHead(200,{
                            "content-type":mime.getType(filepath)
                        })
                        response.end(data);
                    }
                })
            }else{
                // 如果进到这里，说明是文件夹，不是文件
                // 直接判断首页
                if(files.indexOf("index.html")!=-1){
                    // 有首页
                    fs.readFile(path.join(filepath,'index.html'),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            response.end(data);
                        }
                    })
                }else{
                    // 没有首页
                    let backData='';
                    for( let i=0;i<files.length;i++){
                        backData+=`<h2><a href="${request.url=="/"?"":request.url}/${files[i]}">${files[i]}</a><h2>`
                    }
                    response.writeHead(200,{
                        "content-type":"text/html;charset=utf-8"
                      })
                    response.end(backData);
                }
            }
        })
        
    }else{
        response.writeHead(404,{
            "content-type":"text/html;charset=utf-8"
        });
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /index.hththt was not found on this server.</p>
        </body></html>
        `)
    }
    // response.end('day day up');
}).listen(88,'127.0.0.1',()=>console.log('监听成功~'));