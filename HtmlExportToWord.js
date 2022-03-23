let pageOptions = {
	"header": {
		"display": "Print",
		"Zoom": "75"
	},
	"page": {
		"className": "",
		"marginTop": "36.0079387581514pt",
		"marginBotton": "36.0079387581514pt",
		"marginLeft": "36.0079387581514pt",
		"marginRight": "36.0079387581514pt",
		"size": "595.3000pt 841.9000pt",
		"headerMargin": "",
		"footerMargin": "",
		"headerContext": "",
		"footerContext": "",
	}
}


function WordExport(element,option) {
	let _this = this;
	// 获取当前节点的html
	let opt = option;
	let elemObject = document.getElementById(element);
	this.text_pageCss = function() {
		let page = {}
		if (opt.page.marginTop != undefined) page["margin-top"] =           opt.page.marginTop;
		if (opt.page.marginBottom != undefined) page["margin-bottom"] =     opt.page.marginBotton;
		if (opt.page.marginLeft != undefined) page["margin-left"] =         opt.page.marginLeft;
		if (opt.page.marginRight != undefined) page["margin-right"] =       opt.page.marginRight;
		if (opt.page.size != undefined) page["size"] =                      opt.page.size;
		if (opt.page.headerMargin != undefined) page["mso-header-margin"] = opt.page.headerMargin;
		if (opt.page.footerMargin != undefined) page["mso-footer-margin"] = opt.page.footerMargin;
		if (opt.page.headerContext != undefined) page["mso-header"] =       opt.page.headerContext;
		if (opt.page.footerContext != undefined) page["mso-footer"] =       opt.page.footerContext;
		let div = {
			"page": opt.page.className
		}
		let pageName = "@page " + opt.page.className;
		let divName = "div." + opt.page.className;

		if (opt.css == undefined) {
			let cjson = '{"' + pageName + '":' + JSON.stringify(page) + ',"' + divName + '":' + JSON.stringify(
				div) + '}';
			opt.css = JSON.parse(cjson);
		} else {
			opt.css[pageName] = page;
			opt.css[divName] = div;
		}
	}
	
	this.obj_proElement = function(){
		if(opt.elem === undefined) return;
		if(opt.elem.maxWidth != undefined){
			// 获取所有的组件，判断当前的width，是否超过了
			for(let cobj of elemObject.childNodes){
				_this.obj_eachCasWidth(cobj,opt.elem.maxWidth);
			}
		}
		if(opt.elem.remove != undefined){
			for(let obj of opt.elem.remove){
				if(obj.indexOf("#") == 0){
					_this.public_removeNode(obj.replace("#",""));
					continue;
				}
				if(obj.indexOf(".") == 0){
					_this.public_removeNodes(obj.replace(".",""));
					continue;
				}
				_this.public_removeTag(obj)
			}
		}
		if(opt.elem.replace != undefined){
			for(let key in opt.elem.replace){
				_this.public_replaceText(key, opt.elem.replace[key])
			}
		}
	}
	
	/**
	 *  对比传入的节点，当前宽度是否超过最大宽度，如果超过，则替换成 max （单位pt）
	 */
	this.obj_eachCasWidth = function(obj,max){
		if(obj.offsetWidth * 0.75 > max){
			obj.width = max + "pt";
		}
		if(obj.childNodes.length === 0) return 1;
		for(let cobj of obj.childNodes){
		   _this.obj_eachCasWidth(cobj,opt.elem.maxWidth);
		}
	}
	
	/**
	 *  向文档内添加CSS
	 */
	this.text_createStyle = function(className) {
		let css = "";
		for (let key in opt.css[className]) {
			css += key + ":" + '"' + opt.css[className][key] + '";\n';
		}
		return className + "{\n " + css + "}\n";
	}
	
	/**
	 *  处理img对象，将图片转为base64位
	 *  Forget the source, Baidu or CSDN，Search for many of the same answers
	 */
	this.obj_proPictures = function() {
		let mateType = "";
		let canvas = document.createElement("canvas");
		let imgs = elemObject.getElementsByTagName("img");
		for(let img of imgs){
			try{
				let w = Math.min(img.width, 600);
				let h = img.height * (w / img.width);
				// Create canvas for converting image to data URL
				let canvas = document.createElement("CANVAS");
				canvas.width = w;
				canvas.height = h;
				// Draw image to canvas
				let context = canvas.getContext('2d');
				context.drawImage(img, 0, 0, w, h);
				// Get data URL encoding of image
				let uri = canvas.toDataURL("image/png");
				img.width = w;
				img.height = h;
				mateType += "--NEXT.ITEM-BOUNDARY\n"
				mateType += "Content-Location:" + img.src + "\n";
				mateType += "Content-Type:" +  uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")) + "\n";
				mateType += "Content-Transfer-Encoding:" +  uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")) + "\n";
				mateType +=  uri.substring(uri.indexOf(",") + 1) + "\n";
				img.src = uri;
			}catch(e){
				console.warn("Picture conversion failed")
			}
		}
		if(mateType != ""){
			mateType += "--NEXT.ITEM-BOUNDARY--\n"
		}
		
		return mateType;
	}

	/**
	 * 将输入框修改为SPAN格式，并新增className 为 props_input，可自行添加css样式
	 */
	this.obj_proInputs = function() {
		let allInputs = elemObject.getElementsByTagName("INPUT");
		for(let i=0;i<  allInputs.length; i = 0){
			let span = document.createElement("SPAN");
			span.className = "props_input";
			span.innerText = allInputs[i].value;
			allInputs[i].parentNode.appendChild(span);
			allInputs[i].remove();
		}
	}
	/**
	 * 将指定节点下的文本内容替换成指定的文本内容
	 */
	this.public_replaceText = function(elm,ot){
		if(elm.indexOf("#") == 0){
			for(let o of ot){
				elemObject.getElementById(elm.replace("#","")).textContent = elemObject.getElementById(elm.replace("#","")).textContent.replaceAll(o.f,o.t);
			}
			return;
		}
		let t = 1;
		if(elm.indexOf(".") == 0){
			t = 0;
		}else{
			t = 1;
		}
		
		let objs = t === 1 ? elemObject.getElementsByTagName(elm):elemObject.getElementsByClassName(elm.replcae(".",""));
		for(let s of objs){
			//s.innerText = s.innerText.replaceAll(regx,to); 
			for(let o of ot){
				s.textContent = s.textContent.replaceAll(o.f,o.t)
			}
		}
	}
	
	/**
	 *  将节点HTML替换成指定的内容
	 */
	this.public_removeText = function(id,regx,to){
		elemObject.getElementById(id).innerHTML = elemObject.getElementById(id).innerHTML.replaceAll(regx,to);
	}

	/**
	 *  删除指定节点
	 */
	this.public_removeNode = function(id){
		elemObject.getElementById(id).remove();
	}
	
	/**
	 *  删除指定类名的节点
	 */
	this.public_removeNodes = function(className){
		let o = elemObject.getElementsByClassName(className);
		for(let s of o){
			s.remove();
		}
	}
	/**
	 *  删除指定标签名的节点
	 */
	this.public_removeTag = function(tagName){
		let o = elemObject.getElementsByTagName(tagName);
		for(let s of o){
			s.remove();
		}
	}

	/**
	 *  创建文档的头部信息
	 */
	this.text_createWordHeader = function(css) {
		let display = "Print";
		let zoom = 75;
		if (opt != undefined) {
			display = opt.display != undefined ? opt.display : display;
			zoom = opt.zoom != undefined ? opt.zoom : zoom;
		}
		if (css === undefined) {
			css = "";
		}
		let x =
			'<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns=\'http://www.w3.org/TR/REC-html40\'>\n';
		x += "<head>\n"
		x += "<meta charset='utf-8'>\n"
		x += "<style>\n" + css + "\n</style>"
		x += '<!--[if gte mso 9]>\n';
		x += '<xml>\n';
		x += '<w:WordDocument>\n';
		x += ('<w:View>' + display + '</w:View>\n');
		x += ('<w:Zoom>' + zoom + '</w:Zoom>\n');
		x += '<w:DoNotOptimizeForBrowser/>\n';
		x += '</w:WordDocument>\n';
		x += '<o:OfficeDocumentSettings>\n';
		x += '<o:AllowPNG/>\n';
		x += '</o:OfficeDocumentSettings>\n';
		x += '</xml>\n';
		x += '<![endif]-->\n';
		x += '</head><body>';
		return x;
	}


	/**
	 *  将html保存成文件并下载
	 *  The method code for downloading files comes from https://github.com/aadel112/googoose.git
	 */
	this.file_save = function(
		fileNameToSaveAs, textToWrite
	) {
		/* Saves a text string as a blob file*/
		var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
			ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
			ieEDGE = navigator.userAgent.match(/Edge/g),
			ieVer = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));
		if (ie && ieVer < 10) {
			console.log("No blobs on IE ver<10");
			return;
		}
		var textFileAsBlob = new Blob([textToWrite], {
			type: 'application/msword'
		});
		if (ieVer > -1) {
			window.navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);
		} else {
			var downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSaveAs;
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = function(e) {
				document.body.removeChild(e.target);
			};
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
			downloadLink.click();
		}
	}

	/**
	 *  导出文件主方法
	 *  filename:导出的文件名
	 *  call: 在导出之前且获取到最终文档的内容后，进行处理的方法
	 */
	this.export = function(fileName,call) {
		_this.obj_proElement();
		let css = "";
		_this.text_pageCss();
		// 根据传过来的css对象进行创建style
		for (let name in opt.css) {
			css += _this.text_createStyle(name, opt.css[name]);
		}
		// 处理INPUT
		_this.obj_proInputs();
		// 创建头部信息
		let body =  _this.obj_proPictures();
		body += _this.text_createWordHeader(css, opt.header);
		let htm =elemObject.innerHTML;
		body += htm;
		body += "</body></html>"
		if(call != undefined){
			body = call(body);
		}
		// 创建下载内容
		_this.file_save(fileName, body);
	}
}
