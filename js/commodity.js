class commodity {
    constructor () {
        this.getData()

        this.$('#list-cont').addEventListener('click',this.addCarFn.bind(this));

        this.$('.cont-list').addEventListener('click',this.postId.bind(this))
        
    }

    // 获取数据
    async getData () {
        // 等待promise 对象解析完成
        let {data , status}= await axios.get('http://localhost:8888/goods/list?current=1');
        // console.log(data,status);

        if(status==200){
            // console.log(data);
            let html = '';
            data.list.forEach(goods => {
                // console.log(goods);
                html += ` 
            <div class="item" data-id = "${goods.goods_id}">
                <div class="img"> 
                    <img src="${goods.img_big_logo}" class = "xx">
                </div>
                <div class="text">
                    <p class="title">${goods.title}</p>
                    <p class="price">
                    <span class="pri">￥${goods.price}</span>
                    <span class="nub">${goods.goods_number}人付款</span>
                    </p>
                </div>
                <a href="#none"  id="aaa" class="aaa">立即购买</a>
            </div>
            `
               
            });

            this.$('#list-cont').innerHTML += html;
        }

        
    }

    
    // 传递商品id
    postId ({target}) {
        if(target.classList.contains('xx')){
            let goodsId = target.parentNode.parentNode.dataset.id
            // console.log(div);
            location.assign('./details.html#'+goodsId)
        }
    }

    // 加入购物车
    async addCarFn (eve) {
        let token = localStorage.getItem('token') 
        if (!token) location.assign('./login.html?ReturnUrl=commodity.html ')

        // 如果登陆成功,就将信息加入到购物车
        // 获取用户id和goodsId

        // 判断是否点击的是a标签
        if(eve.target.classList.contains('aaa')){
            // console.log(123);
            let liObj = eve.target.parentNode; 
            let goodsId = liObj.dataset.id;
            let userid = localStorage.getItem('user_id') 

            // console.log(goodsId);
            // console.log(userid);


            // 必须有两个id才可以发送请求
            if(!userid||!goodsId) throw new Error('缺少id值')


            // 设置内容的格式
            axios.defaults.headers.common['authorization'] = token;
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

            let param=`id=${userid}&goodsId=${goodsId}`
            let {data,status} =await axios.post('http://localhost:8888/cart/add',param)
            console.log(data,status);
            if(status == 200){
                if(data.code == 1){
                    console.log(111);
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
        }   
        
            
    }

    $ (tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1? res[0] : res
    }



}
new commodity