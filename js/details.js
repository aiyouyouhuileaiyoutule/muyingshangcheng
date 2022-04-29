class details {
    constructor () {
        this.pig()
    }

    // 放大镜
    pig () {
        // 获取元素
        let box = document.querySelector('.box')
        let small = document.querySelector('.small')
        let big = document.querySelector('.big')
        let mask = document.querySelector('.mask')
        let img = document.querySelector('#img')

        // 绑定鼠标移入事件
        // 鼠标移入到小盒子里,mask显现,大盒子也出现
        small.onmouseenter = function (){
            mask.style.display = 'block';
            big.style.display = 'block';
        }
        
        //绑定鼠标移出事件
        small.onmouseleave = function () {
            mask.style.display = 'none';
            big.style.display = 'none'
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





}

new details()