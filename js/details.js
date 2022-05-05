class details {
    constructor () {
        this.getshop();
    }


    // 获取商品信息
    async getshop(){
        // 获取商品id
        let hash = location.hash
        let goodsId = hash.split('#')[1]
        // console.log(goodsId);
        let {data} = await axios.get('http://localhost:8888/goods/item?id='+goodsId)
        // console.log(data);
        let html = '';
            html+=`
                <div class="preview-wrap small">
                    <a href="javascript:;">
                        <img src="${data.info.img_big_logo}">
                        <div class="mask" id="mask"></div>
                    </a>
                </div>
                <div class="big">
                    <img src="${data.info.img_big_logo}">
                </div>

                <div class="itemInfo-wrap">
                <div class="itemInfo">
                    <div class="title">
                        <h4>${data.info.title}</h4>
                        <span><i class="layui-icon layui-icon-rate-solid"></i>收藏</span>
                    </div>
                    <div class="summary">
                        <p class="activity"><span>活动价</span><strong class="price"><i>￥</i>${data.info.price}</strong></p>
                        <p class="address-box"><span>送&nbsp;&nbsp;&nbsp;&nbsp;至</span><strong class="address">江西&nbsp;&nbsp;南昌&nbsp;&nbsp;东湖区</strong></p>
                    </div>
                    <div class="choose-attrs">
                        <div class="color layui-clear"><span class="title">颜&nbsp;&nbsp;&nbsp;&nbsp;色</span> <div class="color-cont"><span class="btn">白色</span> <span class="btn active">粉丝</span></div></div>
                        <div class="number layui-clear">
                            <span class="title">数&nbsp;&nbsp;&nbsp;&nbsp;量</span>
                            <div class="number-cont">
                                <span class="cut btn">-</span>
                                <input  class="num" value="1">
                                <span class="add btn">+</span>
                            </div>
                        </div>
                    </div>
                    <div class="choose-btns">
                        <button class="layui-btn layui-btn-primary purchase-btn">立刻购买</button>
                        <a class="layui-btn  layui-btn-danger car-btn">
                        <i class="layui-icon layui-icon-cart-simple"></i>
                        加入购物车
                        </a>  
                    </div>
                </div>
                </div>
            `

        // console.log(html);

        let box = this.$('.product-intro')
        // console.log(box);
        box.innerHTML += html

        this.pig();

        this.$('.car-btn').addEventListener('click',this.addCarFn.bind(this))

        this.$('.add').addEventListener('click',this.add.bind(this));

        this.$('.cut').addEventListener('click',this.less.bind(this));
    }


    // 加入购物车
    async addCarFn (eve) {
        // console.log(123);
        let token = localStorage.getItem('token') 
        if (!token) location.assign('./login.html?ReturnUrl=commodity.html ')

        // 如果登陆成功,就将信息加入到购物车
        // 获取用户id和goodsId

        // 判断是否点击的是a标签
        if(eve.target.classList.contains('car-btn')){
            // console.log(123);
            let hash = location.hash
            let goodsId = hash.split('#')[1]
            let userid = localStorage.getItem('user_id') 

            // console.log(goodsId);
            // console.log(userid);


            // 必须有两个id才可以发送请求
            if(!userid||!goodsId) throw new Error('缺少id值')


            // 设置内容的格式
            axios.defaults.headers.common['authorization'] = token;
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

            let param=`id=${userid}&goodsId=${goodsId}`
            let {data,status} = await axios.post('http://localhost:8888/cart/add',param)
            console.log(data,status);
            if(status == 200){
                if(data.code == 1){
                    this.transfer()
                    // console.log(111);
                    
                }
            }
        }             
    }




    // 数量传递
    async transfer () {
            let hash = location.hash
            let goodsId = hash.split('#')[1]
            let userid = localStorage.getItem('user_id')
            let num = this.$('.num').value
            // console.log(num);
            let cc = `id=${userid}&goodsId=${goodsId}&number=${num}`
            let {data,status} = await axios.post('http://localhost:8888/cart/number',cc)
            if(status==200){
                if(data.code==1){
                    layer.open({
                        content: '加入购物成功',
                        btn: ['去购物车结算', '留在当前页面']
                        , yes: function (index, layero) {
                          // 按钮【按钮一】的回调
                          location.assign('./shopcart.html')
                            
                        }
                        , btn2: function (index, layero) {
                          //按钮【按钮二】的回调
                          //return false 开启该代码可禁止点击该按钮关闭
                        }
                    })
                }
            }
            // console.log(res);
    }

    // 减号的使用
    less () {
        let inp  = this.$('.num');
        let num = inp.value;
        num--
        inp.value = num;

        if(num<1){
            num = 1;
            inp.value = num;
            return
        }

        
    }


    // 加法的使用
    add () {
        let inp  = this.$('.num');
        let num = inp.value;
        num++
        inp.value = num;
    }

    // 放大镜
    pig () {
        // 获取元素
        let box = this.$('.box');  
        let small = box.firstElementChild;
        let mask = box.firstElementChild.firstElementChild.firstElementChild.nextElementSibling
        let big = small.nextElementSibling
        let img = box.firstElementChild.nextElementSibling.firstElementChild
        // console.log(box,small,mask,big,img);
        // console.log(box,small,big);

        // 绑定鼠标移入事件
        // 鼠标移入到小盒子里,mask显现,大盒子也出现
        small.onmouseenter = function (){
            mask.style.display = 'block';
            big.style.display = 'block';
        }
        
        //绑定鼠标移出事件
        small.onmouseleave = function () {
            mask.style.display = 'none';
            big.style.display = 'none';
        }

        // 绑定鼠标移动事件
        small.onmousemove = function (e) {
            // 获取鼠标在可视区域的位置
            let x = e.clientX;
            let y = e.clientY;

            // 获取box相对于对于body的左上位置
            let offl = box.offsetLeft;
            let offt = box.offsetTop;

            // 计算鼠标在small里面的坐标
            // 可视区域坐标 - box的偏移量
            let targetX = x - offl;
            let targetY = y - offt;

            // 让鼠标到mask的中间
            targetX -= mask.offsetWidth/2;
            targetY -= mask.offsetHeight/2;

            // 限制mask的位置
            // 获取mask移动的最大最小距离
            let maxx = small.offsetWidth - mask.offsetWidth;
            let maxy = small.offsetHeight - mask.offsetHeight;

            // 判断鼠标是否超出边界
            targetX = targetX < 0? 0 : targetX;
            targetX = targetX > maxx ? maxx : targetX;
            targetY = targetY < 0 ? 0 : targetY;
            targetY = targetY >maxy ? maxy : targetY;


            // 给mask赋值渲染
            mask.style.left = targetX + 'px';
            mask.style.top = targetY +'px';

            // 计算img的移动距离
            let imgmaxX = img.offsetWidth - big.offsetWidth;
            let imgmaxY = img.offsetHeight - big.offsetHeight;

            //计算img移动的比例
            let imgX = targetX/maxx * imgmaxX ;
            let imgY = targetY/maxy * imgmaxY;

            // 给img赋值
            img.style.left = -imgX + 'px';
            img.style.top = -imgY + 'px';
        }
    }



    $ (tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1? res[0] : res
    }

}

new details()