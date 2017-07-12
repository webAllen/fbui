$(function(){
        //普通点击
        var lis = $(".met-banner .adiv li");
        console.log(lis);
        var ims = $('.met-banner .item');
        var inow= 0,timer;
        lis.click(function () {
            inow = $(this).index();
           console.log(inow);
            ims.eq(inow).css("display","block");
            ims.eq(inow).siblings().css("display","none");
            lis.eq(inow).addClass("active").siblings().removeClass("active");
        });
        //左点击
        $('.left').click(function () {
            inow--;
            if(inow<0){
                inow = ims.length-1;
            }
            ims.eq(inow).css("display","block");
            ims.eq(inow).siblings().css("display","none");
            lis.eq(inow).addClass('active').siblings().removeClass('active');

        });
        //右点击
        $('.right').click(function () {
run2();
        });
        //自动轮播

       function run2(){
           inow++;
           if (inow>ims.length-1){
               inow = 0;
           }
           ims.eq(inow).siblings().css("display","none");
           ims.eq(inow).css("display","block");
           lis.eq(inow).addClass('active').siblings().removeClass('active');
       }
      var time= setInterval(run2,5000);
       $(".ims").hover(function(){
           clearInterval(time);
       }, function () {
           time = setInterval(run2,5000)
       })
    })