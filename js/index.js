class index {
    constructor () {
        this.carouse();
        this.autoPlay();
        this.shijan
    }

    // 轮播图 
    carouse () {
        // 获取节点
        let box = document.getElementsByClassName('carousel-item');
        let item1 = document.querySelectorAll('.lunbo1');
        let next = document.querySelector('#next')

        // console.log(box,item1,next);
        let times = '';
        let index = 0;
        let lastindex = 0;
        
        // 点击span标签显示下一页
        next.onclick = function (){
            
            lastindex = index;
            index++;
            if (index > item1.length - 1){
                index = 0 ;
            }
            item1[lastindex].className = '';
            item1[index].className = 'ac';
        }

        this.autoPlay()

    }

    autoPlay(){
       // 轮播图的实现
       times = setInterval(()=>{
        next.onclick()
        },5000) 
    }


}
new index