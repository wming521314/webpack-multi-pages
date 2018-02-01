import "style-loader!css-loader!./../css/index.css";
require(['./common.js','jquery'],(common,$)=>{
    common.initIndex();
    $(function(){
        console.log("this is jQuery");
    });
});