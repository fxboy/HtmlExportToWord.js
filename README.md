# HtmlExportToWord.js

原生JS将HTML页面导出为word文档
Native JS exports HTML pages as word documents


下载文件方法 [this.file_save] 来源于 https://github.com/aadel112/googoose.git

[this.file_save] The method code for downloading files comes from https://github.com/aadel112/googoose.git)

# 使用 USE

```javascript

			let option = {
			"header": {
				"display": "Print",
				"Zoom": "75"
			},
			"page": {
				"className": "editor-content",
				"marginTop": "36.0079387581514pt",
				"marginBotton": "36.0079387581514pt",
				"marginLeft": "36.0079387581514pt",
				"marginRight": "36.0079387581514pt",
				"size": "595.3000pt 841.9000pt"
			},
			"elem": {
				"remove":["#id",".class","tagName"]
			}
		}
    
		let word = new WordExport("导出的块的ID选择器",option);
		word.export("文件名称", (body)=>{
     			 //对即将转为文件的内容做最后的处理，一定要 return
			return body.replaceAll("&nbsp;","");
		});
```
