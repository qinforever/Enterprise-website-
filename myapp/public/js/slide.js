//轮播图渲染
$(function(){
    function swiper(){
        $.ajax({
        type: 'get',
        url: '/api/main/facous',
        async: true,
        data: {},
        dataType: 'json',
        success:function(data){
            for (let i = 0; i < data.data.length; i++) {
                var arr = data.data[i];
                $("<li><img src="+ arr.facousimg +"></li>").appendTo('.carouseSlider');
                var li = $("<li>"+ Number(i+1) +"</li>").appendTo('.subScript');
            }
            animateCarousel();
        }
        })
        function animateCarousel(){
        //初始化显示第一张图
        $('.subScript').find('li').eq(0).addClass('active');
        $(".carouseSlider li").eq(0).show().siblings().hide();
        //图片总数量
        var size = $(".carouseSlider li").size();
        //自动轮播
        var i = 0; //记录图片下标
        var timer = setInterval(function(){
        move();
            i++;
        }, 3000);
        //移动的函数
        function move(){
            //如果i超出了图片总数量
            if (i == size) {
                i = 0;//即将移动到2张图
            }
        if(i<0){
            i=size-1;
        }
            //透明度切换到第i张图
            $('.carouseSlider li').eq(i).stop().fadeIn().siblings().fadeOut();
            //改变ul2的按钮状态
            $(".subScript li").eq(i).removeClass().addClass("active").siblings().removeClass("active");
        }
        //li2上面的按钮
        $(".subScript li").mouseenter(function(){
            var index = $(this).index();
            //console.log(index);
            i = index;
            move();
        });
        //点击
        $('.next').click(function(){
            i++;
            move();
        });
        $('.prev').click(function(){
            i--;
            move();
        })
        //移入box, 移出box
        $(".carouseSlider").hover(function(){
            //移入, 关闭定时器
            clearInterval(timer);
        },function(){
            //移出, 重新开启定时器
            timer = setInterval(function(){
                i++;
                move();
            }, 3000);
        })
        }
    }
    swiper();

    
    $('.news-nav li').eq(0).addClass('active');
    $('.news-nav li').mouseenter(function(){
        $(this).addClass('active').siblings('li').removeClass('active');
        let id = $(this).attr('id');
        $.get('/api/main/industrycase',{id:id},function(data){
            var str = '';
            for(let i=0;i<data.data.length;i++){
                let arr = data.data[i];
                str +=`<li class="col-md-4"><a href="javascript:;"><img src="${arr.caseimage}" alt="${arr.title}"></a></li>`;
            }
            $('.news-tu').html(str);
        })
    })

})