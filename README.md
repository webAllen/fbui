# fbui
fbui是基于jquery开发的入门级组件插件 ,你需要引用一个fbui.js,fbui.css,jquery.js。
### 手动开始

引用一个`fbui.js`,`fbui.css`,`jquery.js`

```html
<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <title>我的fbui</title>
    <meta name="Keywords" content=""/>
    <meta name="Description" content=""/>
    <!-- jquery -->
    <script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
    <!-- fbui 的 CSS -->
    <link rel="stylesheet" type="text/css" href="css/fbUi.css">
     <!-- fbui 的 JS -->
    <script type="text/javascript" src="js/fbUi.js"></script>
</head>
<body>
    <div >
        <button class="fb-buttonSize-medium fb-buttonFill-blue" onclick='$fb.fbNews({"type":"info","content":"信息提醒"})'>正常按钮</button>
    </div>
</body>
</html>
```
