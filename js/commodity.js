class commodity {
    constructor () {
        
    }

    // 获取数据
    async getData () {
        // 等待promise 对象解析完成
        let res = await axios.get('/user?ID=12345')
    }





}