# 请仔细阅读以下要点：
* 创建扇形图的函数，返回一个扇形图对象，并在相应的canvas上绘制扇形图
* 参数以对象形式传入（只允许一个）

## 必传参数：
* canvas: 进行描绘的canvas对象(object)
* data: 用于描述不同份数的数据(array)
* centerX: 圆心x轴坐标(number) 单位：px
* centerY: 圆心y轴坐标(number) 单位：px
* radius: 扇形图半径(number) 单位：px
## 可选参数:
* stroke: 是否对扇形外沿进行描边(boolean)
* lineWidth: 描边的线宽(number)
* lineColor: 描边的颜色(string)
* sign: 是否添加扇形图标记(boolean)
* textPosition: 标记文字的位置(number) 单位：px
* fontSize: 标记文字的大小(number) 单位：px
* fontColor: 标记文字的颜色(string)
* fontFamily: 标记文字的字体(string)
## 重新初始化方法
* init:
* 参数一：需要修改的参数值
* 参数二：是否把未添加的可选参数重置为默认值
* 如果没有输入参数，默认重置所有可选参数