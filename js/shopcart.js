class shopcart {
    constructor () {
        this.checklogin();
        this.getData();
        this.bindEve();
    }

    $ (tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1? res[0] : res;
    }

    //事件绑定(事件委托给"#list-cont") 
    bindEve () {
        // 绑定事件
        this.$('#list-cont').addEventListener('click',this.dis.bind(this))

        // 给全选按钮绑定事件
        this.$('.check-all').addEventListener('click',this.all.bind(this))

        // 结算
        this.$('.jiesuan').addEventListener('click',this.pay.bind(this))
    }

    // 判断是否登录
    async  checklogin (){
        const TOKEN = localStorage.getItem('token');
        // 如果没有登录就跳到登录页面
        axios.defaults.headers.common['authorization'] = TOKEN;
        let userId = localStorage.getItem('user_id')
        let {data,status} = await axios.get('http://localhost:8888/users/info/' + userId);

        if(!TOKEN||data.code ==401){
            location.assign('./login.html?ReturnUrl=./shopcart.html')
        }
    }


    // 获取购物车列表数据
    async getData () {
        const TOKEN = localStorage.getItem('token');
        let userId = localStorage.getItem('user_id')
        axios.defaults.headers.common['authorization'] = TOKEN;
        let {data , status} = await axios.get('http://localhost:8888/cart/list?id='+userId)
        // console.log(data , status);

        if(status==200){

            if(data.code==1){
                let html = '';
                // 循环遍历渲染到页面列表上
                data.cart.forEach(goods => {
                    html+=`<ul class="item-content layui-clear" data-id="${goods.goods_id}">
                    <li class="th th-chk">
                      <div class="select-all">
                        <div class="cart-checkbox">
                          <input class="CheckBoxShop check" id="" type="checkbox" num="all" name="select-all" value="true">
                        </div>
                      </div>
                    </li>
                    <li class="th th-item">
                      <div class="item-cont">
                        <a href="./details.html"><img src="${goods.img_small_logo}"></a>
                        <div class="text">
                          <div class="title">${goods.title}</div>
                        </div>
                      </div>
                    </li>
                    <li class="th th-price">
                      <span class="th-su">${goods.price}</span>
                    </li>
                    <li class="th th-amount">
                      <div class="box-btn layui-clear">
                        <div class="less layui-btn">-</div>
                        <input class="Quantity-input" type="" name="" value="${goods.cart_number}" disabled="disabled">
                        <div class="add layui-btn">+</div>
                      </div>
                    </li>
                    <li class="th th-sum">
                      <span class="sum">${goods.price*goods.cart_number}</span>
                    </li>
                    <li class="th th-op">
                      <span class="dele-btn">删除</span>
                    </li>
                  </ul>`
                });

                let div = this.$('#list-cont')
                div.innerHTML+=html
            }



        }
    }

    
    dis ({target}) {
        if(target.classList.contains('dele-btn')){
            this.del(target)
        }

        if (target.classList.contains('CheckBoxShop')){
            this.onegoods(target)
            // 统计
            this.getprice();
        }

        if(target.classList.contains('add')){
            this.addEven(target)

            this.getprice()
        }

        if(target.classList.contains('less')){
            this.lessEven(target)

            this.getprice()
        }

    }

    // 删除
    del (target) {
        let that = this;
        // 是否删除
        let layerIndex = layer.confirm('是否删除',
        {
            title:'删除提示'
        },function () {
            // 获取商品id
            let ulObj = target.parentNode.parentNode
            // console.log(ulObj);
            let id = ulObj.dataset.id
            // 获取用户id
            let userId = localStorage.getItem('user_id')
            // 发送ajax删除商品数据
            axios.get('http://localhost:8888/cart/remove?id=' + userId + '&goodsId=' + id)
            .then(res => {
                // console.log(res);
                let {data,status} = res;
                if (data.code==1){
                    // 删除成功
                    // 关闭确认框
                    layer.close(layerIndex);
                    // 提示删除成功
                    layer.msg('删除成功')
                    // 在页面删除节点
                    ulObj.remove();
                    // 重新统计商品数量和价格总和
                    that.getprice()                }
            })
        });

    }



    // 单个商品的实现
    onegoods(target) {
        if(!target.checked){
            // 如果取消,直接让全选取消
            this.$('.check-all').checked = false;
            return;
        }

        if(target.checked){
            let res = Array.from(this.$('.CheckBoxShop')).find(checkbox=>{
                return !checkbox.checked
            });
            // console.log(res);

        if(!res) this.$('.check-all').checked = true;
        }
        
    }
    // 全选的实现
    all(eve){
        let checked = eve.target.checked;
        //单个商品跟全选状态一样
        this.one(checked);
        // 统计数量和价格
        this.getprice();
    }

    // 单个商品的选中状态
    one (onestatus) {
        let goodsList = this.$('.CheckBoxShop');
        
        goodsList.forEach(inp => {
            inp.checked = onestatus;

        })
    }

    // 获取商品的总量和总价
    getprice (){
        let goods = document.querySelectorAll('.item-content')
        // 保存数量和价格
        let totalNum = 0;
        let totalPrice = 0;
         
        goods.forEach(i => {
            if(i.firstElementChild.firstElementChild.firstElementChild.firstElementChild.checked){
                totalNum = i.querySelector('.Quantity-input').value - 0 + totalNum;
                totalPrice = i.querySelector('.sum').innerHTML - 0 + totalPrice;
            }
        });

        this.$('.Selected-pieces').innerHTML = totalNum;
        this.$('.pieces-total').innerHTML = totalPrice + '元';
    }


    // 加号使用
    async addEven (target) {
        // 获取商品数量的数据
        //  if(target.classList.contains('add')){
        //       console.log(target.previousElementSibling.value);
        //  }
        // console.log(target);
        let inp = target.previousElementSibling
        let ul =target.parentNode.parentNode.parentNode
        let num = inp.value;
        // console.log(inp);
        num++
        inp.value =num

        // console.log(inp,ul);

        // 获取span
        let number = num
        let sum = target.parentNode.parentNode.nextElementSibling.firstElementChild
        // console.log(sum);
        let pri = target.parentNode.parentNode.previousElementSibling.firstElementChild
        // console.log(pri);
        let p = pri.innerHTML
        let aa = (num*p).toFixed(2);
        sum.innerHTML = aa;

        // 修改商品的数据
        let userId = localStorage.getItem('user_id')
        let goodsId = ul.dataset.id
        
        let res = await axios.post('http://localhost:8888/cart/number','id='+userId+'&goodsId='+goodsId+'&number='+number)
        // console.log(res);
      

    }



    // 减号的使用
    async lessEven (target) {
        let inp = target.nextElementSibling
        // console.log(inp);
        let ul =target.parentNode.parentNode.parentNode 
        let num = inp.value
        // console.log(num);

        num--
        if(num<1){
            num = 1;
            inp.value;
            return
        }
        inp.value =num


        let number = num
        let sum = target.parentNode.parentNode.nextElementSibling.firstElementChild
        // console.log(sum);
        let pri = target.parentNode.parentNode.previousElementSibling.firstElementChild
        // console.log(pri);
        let p = pri.innerHTML;
        let aa = (num*p).toFixed(2);
        sum.innerHTML = aa;

        let userId = localStorage.getItem('user_id')
        let goodsId = ul.dataset.id
        
        let res = await axios.post('http://localhost:8888/cart/number','id='+userId+'&goodsId='+goodsId+'&number='+number)
        // console.log(res);

        
    }


    // 结算支付
    pay () {
        let that = this
        let userid = localStorage.getItem('user_id')
        let id = `id=${userid}`
        axios.post('http://localhost:8888/cart/pay',id).then(
            res => {
                console.log(res);
               let {data,status}= res
               if(status==200){
                   if(data.code==1){
                       let inp = document.querySelectorAll('.CheckBoxShop')
                       inp.forEach(goods =>{
                           if(goods.checked){
                               let ul = goods.parentNode.parentNode.parentNode.parentNode
                                // console.log(ul);
                                let ulid = ul.dataset.id
                                console.log(ulid);
                                axios.get('http://localhost:8888/cart/remove?id=' + userid + '&goodsId=' + ulid).then(
                                    ll=>{
                                        let {data,status} = ll;
                                        if(status==200){
                                            if(data.code==1){
                                                let aa =layer.open({
                                                    content: '成功',
                                                    btn: ['确定']
                                                    
                                                    , yes: function (index, layero) {
                                                      // 按钮【按钮一】的回调
                                                      ul.remove()
                                                      that.getprice () 
                                                        location.reload()
                                                      
                                                    }
                                                    , btn2: function (index, layero) {
                                                      //按钮【按钮二】的回调
                                                      //return false 开启该代码可禁止点击该按钮关闭
                                                    }
                                                  })
                                                  
                                                

                                                
                                            }
                                        }
                                         
                                    }
                                )
                                
                           }
                       })
                   }
               }
            }
        )
        
    }

}
new shopcart()