class Login {

    constructor () {
        // 给登录按钮绑定事件
        this.$('.form-box .btn').addEventListener('click',this.clickFn.bind(this))
    }

    //登录 点击事件
    clickFn () {

        let forms = document.forms[1].elements
        let username = forms.phone.value;
        let password = forms.pnum.value;
        // console.log(username);
        // console.log(forms);
        // 判断是否为空
        if(!forms.phone.value.trim()||!forms.pnum.value.trim()){
            throw new Error ('输入不能为空');
        };
        // console.log(username,password);
        // 发送post请求
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    
        let data = `username=${username}&password=${password}`;

        axios.post('http://localhost:8888/users/login',data).then(res => {
            // console.log(res);
            let {data,status} = res;
            if( status == 200){
                if(data.code == 1){
                    localStorage.setItem('token',data.token);
                    localStorage.setItem('user_id',data.user.id);
    
                    location.assign(location.search.split('=')[1])
                }else{
                    layer.open({
                        title: '登录提示'
                        , content: '用户名或者密码输入错误'
                      });
                }
               
            }
            
        })

    }


    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1? res[0] : res
    }
}

new Login