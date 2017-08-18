function pie(opt) {
	// 检测传入参数
	if (arguments.length != 1) throw new Error('传入参数的长度必须为1');
	if (!(typeof opt === 'function' || (typeof opt === 'object' && opt !== null))) throw new Error('传入的参数类型必须为object');
	// 创建一个必传参数的数组
	var optArr = 'canvas data centerX centerY radius'.split(' ');
	optArr.forEach(function (val) {
		if (!(val in opt)) throw new Error('缺少参数' + val);
	});
	// 检测data是否是个数组
	if (!isArray(opt.data)) throw new Error('data属性的类型必须为array');

	/**
	 * 检测是否是数组
	 */
	function isArray(obj) {
		return ({}).toString.call(obj).slice(8, -1) === 'Array';
	}

	/**
	 * 得到随机的rgb色值
	 */
	function getRandomColor() {
		return 'rgb(' + getRandomNumber(0, 255) + ',' + getRandomNumber(0, 255) + ',' + getRandomNumber(0, 255) + ')';
	}

	/**
	 * 混入继承函数封装
	 */
	function extend(target) {
		var arr = [].slice.call(arguments, 1);
		arr.forEach(function (val, i) {
			for (var key in val) {
				target[key] = val[key];
			}
		})
	}

	/**
	 * 得到一定范围整数的函数
	 */
	function getRandomNumber(min, max) {
		if (arguments.length !== 2) throw new Error('参数个数必须为2');
		if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) throw new Error('参数类型错误');
		if (min > max) throw new Error('第一个参数必须为较小值,第二个参数必须为较大值');
		min = Math.ceil(min);
		return min + Math.floor(Math.floor(max - min + 1) * Math.random());
	}

	/**
	 * 计算饼图各个扇区的比例
	 */
	function getRate(arr) {
		var sum = 0;
		arr.forEach(function (val) {
			sum += val;
		});
		return arr.map(function (val) {
			return val / sum;
		});
	}

	/**
	 * 计算饼图各个扇区的百分比
	 */
	function getPercent(arr) {
		return arr.map(function (val) {
			return Math.round(val * 10000) / 100 + '%';
		});
	}

	/**
	 * 计算饼图各个扇区的弧度值
	 */
	function getRadian(arr) {
		return arr.map(function (val) {
			return 2 * Math.PI * val;
		});
	}

	/**
	 * 运行方法
	 */
	function runMethods(method) {
		var methods = [];
		isArray(method) ? methods = method : methods.push(method);
		methods.forEach(function (val) {
			val();
		});
	}

	// 保存一些常用变量
	var canvas = opt.canvas,
		ctx = canvas.getContext('2d');
	var rate = getRate(opt.data),
		radian = getRadian(rate),
		percent = getPercent(rate);
	var startRadian = [];
	var optRun = [];

	// 可选参数默认值设置
	var defaultOpt = {
		stroke: false,
		lineWidth: 1,
		lineColor: 'black',
		sign: false,
		textPosition: 1.2 * opt.radius,
		fontSize: 16,
		fontColor: 'black',
		fontFamily: 'Microsoft Yahei'
	}

	// 初始化运行参数
	extend(optRun, defaultOpt, opt);

	// 创建饼图的构造函数
	function Pie() {
		// 循环遍历可选参数与传入的参数值并添加到构造函数中
		extend(this, defaultOpt, opt);
		this.rate = rate;
		this.radian = radian;
		this.percent = percent;
		this.drawSector(optRun);
	}

	// 置换Pie原型
	Pie.prototype = {
		construtor: Pie,
		/**
		 * 描绘扇形图
		 */
		drawSector: function (optRun) {
			// 定义暂时保存结尾弧度值的变量
			var endRadian = -0.5 * Math.PI;

			// 描边方法
			function stroke() {
				ctx.lineWidth = optRun.lineWidth;
				ctx.strokeStyle = optRun.lineColor;
				ctx.stroke();
			}

			// 增加标记方法
			function sign() {
				// 预定义变量
				var textRadian;

				// 重新定义路径
				ctx.beginPath();
				ctx.font = optRun.fontSize + 'px ' + optRun.fontFamily;
				ctx.fillStyle = optRun.fontColor;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				// 遍历添加标记
				radian.forEach(function (val, i) {
					// 计算文字所在位置的弧度角
					textRadian = startRadian[i] + val / 2;

					// 开始增加标记
					ctx.fillText(percent[i], optRun.centerX + optRun.textPosition * Math.cos(textRadian), optRun.centerY + optRun.textPosition *
						Math.sin(
							textRadian));
				});
			}

			// 生成填充扇形图的颜色数组
			var sectorColor = [],
				tempColor;
			for (var i = 0; i < radian.length; i++) {
				(function () {
					tempColor = getRandomColor();
					// 遍历数组，如果没有重复值，则加入数组，如果存在重复值，则重新生成
					sectorColor.every(function (val) {
						return tempColor !== val;
					}) ? sectorColor.push(tempColor) : arguments.callee();
				}());
			}

			// 循环遍历保存弧度值的数组
			radian.forEach(function (val, i) {
				startRadian[i] = endRadian;
				endRadian = startRadian[i] + val;

				// 开始描绘路径
				ctx.beginPath();
				ctx.moveTo(optRun.centerX, optRun.centerY);
				ctx.arc(optRun.centerX, optRun.centerY, optRun.radius, startRadian[i], endRadian);
				ctx.fillStyle = sectorColor[i];
				ctx.fill();

				// 判断是否运行描边方法
				if (optRun.stroke) runMethods(stroke);
			});

			// 消除最开始的描边被覆盖的情况
			if (optRun.stroke) {
				ctx.moveTo(optRun.centerX, optRun.centerY);
				ctx.lineTo(optRun.centerX, optRun.centerY - optRun.radius);
				stroke();
			}

			// 判断是否运行扇形图标记方法
			if (optRun.sign) runMethods(sign);
		},

		/**
		 * 用于重新初始化条件的方法，待完善
		 */
		init: function (option, flag) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (option === undefined || flag) {
				extend(optRun, defaultOpt, option);
			} else {
				extend(optRun, option);
			}
			for (var key in optRun) {
				pie[key] = optRun[key];
			}
			this.drawSector(optRun);
		}
	}

	var pie = new Pie(opt);
	return pie;
}