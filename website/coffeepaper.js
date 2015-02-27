	//Global variables:
	var login = 0;
	var visible = 0;
	var editing=0;
	var numPages = 291;
	
	//Initial calls:
	zoomDef();
	createMenu();
	resize_page();
	pop_up();
	toTranscription();
	
	//Global style
	var widthF = document.getElementById("image").style.width;
	var widthI = document.getElementById("textView").style.height;
	var widthE = document.getElementById("editMode").style.height;
	
	//Functions:
	function placeHolder(num) {
		document.getElementById("pagen_l").placeholder = num;
		document.getElementById("pagen_r").placeholder = num;
	}
	
	function createMenu() {
		for (var i = 0;i<numPages+1;i++) {
			var x = document.createElement("IMG");
			var num = i+"";
			while (num.length<3) num = "0" + num;
			
			x.src = "icons/"+num+".jpg";
			x.id = "icon";
			var al = i;
			x.alt = al;
			
			x.style.width = "16%";
			x.style.position = "relative";
			x.style.left = ((i*5+5)%30) + "px";
			if (i%6==5) {
				x.style.left = "30px";
			}
			x.onclick = function() {goToNum(this.alt);pop_up();};
			var y = document.getElementById("menu");
			y.appendChild(x);
		}
	}
	
	function searchText(){
		if(document.getElementById("searchMenu").style.visibility=="visible"){
			document.getElementById("searchMenu").style.visibility = "hidden";
			document.getElementById("searchMenu").removeChild(document.getElementById("searchBody"));
		}
		else if(document.getElementById("searchInput").value.length>1){
			document.getElementById("searchMenu").style.visibility = "visible";
			var searchBody=document.createElement("div");
			searchBody.id="searchBody";
			document.getElementById("searchMenu").appendChild(searchBody)
			var searchText = document.getElementById("searchInput").value;
			searchText = searchText.toLowerCase();
			var list = [];
			var i;
			for(i=0;i<numPages+1;i++){
				var string;
				var stringOriginal;
				var src =document.getElementById("textView").src;
				src = src.substring(0,src.length-7);
				var num = i+"";
				while (num.length<3) num = "0"+ num;
				src = src + num + ".txt";
				$.ajax({
					type: 'POST',
					url: src,
					async: false,
					dataType: 'text',
					success: function(data){
						stringOriginal = data;
						string = stringOriginal.toLowerCase();
					}
				});
				var plc =string.search(searchText); 
				var plc2 = plc;
				var string2 = string;
				while ( plc >-1) {
					var temp = stringOriginal.substring(Math.max(0,plc2-20),Math.min(string.length,plc2+20));
					string2 = string.substring(plc2 + searchText.length);
					list.push([i,temp]);
					plc = string2.search(searchText);
					plc2 = plc + string.length - string2.length;
				}
				
			}
			if (list.length>0){
				var j=0;
				for(j=0;j<list.length;j++){
					var sr=document.createElement("p");
					var txt=document.createTextNode("Page " + list[j][0] + ": ..." + list[j][1] + "...");
					sr.appendChild(txt);
					sr.className="searchResult";
					sr.alt=list[j][0];
					sr.onclick=function() {goToNum(this.alt);searchText();};
					document.getElementById("searchBody").appendChild(sr);
				}
			}
			else {
				var sr = document.createElement("p");
				var txt = document.createTextNode("No Search Results.");
				sr.appendChild(txt);
				document.getElementById("searchBody").appendChild(sr);
			}
			
		}
		else ;
	}	
	
	
	function saveText(){
		var s = document.getElementById("textView").src;
		var pos=s.search("website");
		pos+=8;
		$.ajax({
			type: 'POST',
			url: "php.php",
			data: {data: document.getElementById("editMode").value,
				   url: s.substring(pos)},
			success: reloadPage()
		});
	}
	
	function loadText(){
		$.ajax({
			type: 'POST',
			url: document.getElementById("textView").src,
			dataType: 'text',
			success: function(data){
				document.getElementById("editMode").value = data;
			}
		});
	}
	
	function reloadPage(){
		document.getElementById("textView").src=document.getElementById("textView").src;
		document.getElementById("modify").value="Edit";
		document.getElementById("textView").style.width="100%";
		document.getElementById("editMode").style.height="0%";
		document.getElementById("editMode").style.width="0%";
		document.getElementById("editMode").style.visibility="hidden";
		document.getElementById("editMode").style.position="absolute";
		visible = 0;
	}
	
	var hashedPassword = "aieaoicmqyysoaecuismosugwkassuumqqcaogkaoouqoqgkimkoaqecckqcyiqsuaigwsieykgouuaykcuscaqyiouaakqywakuqgouagkuowksisauuaiwiiwogioomwaeqigusuasgmsamiwwmyyciwmgamyysecsewwmcamkgssakkmgmeakaqsiqkysimwaseieyameaimmakywgqsuwcimoaammicecccimuamqmywuauaimwacimusueeccwaamsuiwecscoycaoegwoooycyicasosoaysyckmcaioksqcescewiacommqucwccukamkosmyiwcgqiaosaiwkqwcaqmauaikgoqwciqcaumeekaiwccegauwkecykgcokgaegqakokmcqskasiooqikecqcsagsecsikkcqqyaoaisyokucwamamoimkkkgcywgakaucakkicwckaygqyekkscaowaqkmoekkwcqkwauyakakkgcuswaoyyc";
	
	function password(){
		var pw = prompt("Enter Passcode:");
		if(hash(pw) == hashedPassword){
			login = 1;
			edit();
			alert("Your changes may not appear immediatly.\n If your changes don't appear upon saving, toggle between your current view and Transcription/Translation/Notes.");
		}
	}
	
	function hash(input){
		var len = input.length;
		if(len>=512){
			return input.substring(0,512);
		}
		else{
			var hashed = "";
			var i = 0;
			while(i<len*2){
				var c = input.charCodeAt(i%len);				
				c = (c*i)%26+97;
				var s = String.fromCharCode(c);
				hashed += s;
				i++;
			}
			return hash(hashed);
		}
	}
	
	function cancelEdit(){
		document.getElementById("cancel").style.visibility="hidden";
		reloadPage();
		editing = 0;
	}
	
	function edit(){
		if(document.getElementById("modify").value=="Save"){
			saveText();
			document.getElementById("cancel").style.visibility="hidden";
			editing = 0;
		}
		else if(document.getElementById("modify").value=="Edit"){
			if(login==0){
				password();
			}
			else if(login==1){
				document.getElementById("modify").value="Save";
				document.getElementById("textView").style.width="0%";
				document.getElementById("editMode").style.position="relative";
				document.getElementById("editMode").style.width="95%";
				document.getElementById("editMode").style.height=document.getElementById("textView").style.height;
				document.getElementById("editMode").style.visibility="visible";	
				document.getElementById("cancel").style.visibility="visible";
				visible = 1;
				loadText();
				editing = 1;
			}
		}		
	}
	
	function resize_page(){
		document.getElementById("left").style.height = String(window.innerHeight-100) + "px";
		document.getElementById("right").style.height = String(window.innerHeight-100) + "px";
		if(document.getElementById("textView").style.height!="0%"){
			document.getElementById("textView").style.height = String(window.innerHeight-160) + "px";
			document.getElementById("editMode").style.height=document.getElementById("textView").style.height;			
		}
	}
	
	function toggle(){
		var full = "94%";
		var half = "47.5%";
		var none = "1%";
		
		if(document.getElementById("left").style.width == full){
			document.getElementById("toggle").src = "left.gif";
			document.getElementById("left").style.width = half;
			document.getElementById("right").style.width = half;
			document.getElementById("image").style.width=widthF;
			document.getElementById("textView").style.height=widthI;
			document.getElementById("editMode").style.height=widthE;
			document.getElementById("image").style.visibility = "visible";
			document.getElementById("buttonsL").style.visibility = "visible";
			document.getElementById("buttonsR").style.visibility = "visible";
			document.getElementById("textButtons").style.visibility = "visible";
			document.getElementById("textView").style.visibility = "visible";
			if(visible == 1){
				document.getElementById("editMode").style.visibility = "visible";
			}
		}
		else if(document.getElementById("right").style.width == full){
			document.getElementById("toggle").src = "mid.gif";
			document.getElementById("left").style.width = full;
			document.getElementById("right").style.width = none;
			document.getElementById("image").style.width=widthF;
			document.getElementById("textView").style.height="0%";
			document.getElementById("editMode").style.height="0%";
			document.getElementById("image").style.visibility = "visible";
			document.getElementById("buttonsL").style.visibility = "visible";
			document.getElementById("buttonsR").style.visibility = "hidden";
			document.getElementById("textButtons").style.visibility = "hidden";
			document.getElementById("textView").style.visibility = "hidden";
			document.getElementById("editMode").style.visibility = "hidden";
		}
		else{
			document.getElementById("toggle").src = "right.gif";
			document.getElementById("right").style.width = full;
			document.getElementById("left").style.width = none;
			widthF=document.getElementById("image").style.width;
			document.getElementById("image").style.width = "0%";
			document.getElementById("textView").style.height=widthI;
			document.getElementById("editMode").style.height=widthE;
			document.getElementById("image").style.visibility = "hidden";
			document.getElementById("buttonsL").style.visibility = "hidden";
			document.getElementById("buttonsR").style.visibility = "visible";
			document.getElementById("textButtons").style.visibility = "visible";
			document.getElementById("textView").style.visibility = "visible";
			if(visibile == 1){
				document.getElementById("editMode").style.visibility = "visible";
			}
		}
		resize_page();
	}
	
	function pop_up(){
		if(document.getElementById("menu").style.visibility == "hidden"){
			document.getElementById("menu").style.visibility = "visible";
		}
		else{
			document.getElementById("menu").style.visibility = "hidden";
		}
	}
	
	function nextImage() {
		if(editing == 1){
			saveText();
		}
		//store the element in var image
		var image = document.getElementById('page');
		//get directory and extension of files
		var dir="img/";
		var ext=".jpg";
      
		//imgdata is the alt text. We set that.
		var imgData=image.alt;
		var position=parseFloat(imgData);
		var mid=""+position;
		//add the padding zeroes to mid part 1
		while(mid.length<3)mid="0"+mid;
		var position2=position+1;
		var mid2=""+position2;
		//add the padding zeroes to mid part 2
		while(mid2.length<3)mid2="0"+mid2;
      
		if (image.src.match(String(dir+mid+ext))) {
			image.src = String(dir+mid2+ext);
			image.alt = mid2;
			nextText();
			zoomDef();
			var num = parseInt(document.getElementById("pagen_l").placeholder);
			num +=1;
			placeHolder(num);
			//image=document.getElementByID('page');
		} else {
			image.src = String(dir+mid+ext);
		}
	}
	
	function prevImage() {
		if(editing == 1){
			saveText();
		}
		//store the element in var image
		var image = document.getElementById('page');
		//get directory and extension of files
		var dir="img/";
		var ext=".jpg";
      
		//imgdata is the alt text. We set that.
		var imgData=image.alt;
		var position=parseFloat(imgData);
		var mid=""+position;
		//add the padding zeroes to mid part 1
		while(mid.length<3)mid="0"+mid;
		var position2=position-1;
		var mid2=""+position2;
		//add the padding zeroes to mid part 2
		while(mid2.length<3)mid2="0"+mid2;
      
		if (image.src.match(String(dir+mid+ext))&&position2>=0) {
			image.src = String(dir+mid2+ext);
			image.alt = mid2;
			nextText();
			zoomDef();
			var num = parseInt(document.getElementById("pagen_l").placeholder);
			num -=1;
			placeHolder(num);
			//image=document.getElementByID('page');
		} else {
			image.src = String(dir+mid+ext);
		}
	}
	
	function toTranscription(){
		var image=document.getElementById('page');
		var dir="transcription/trsc_";
		var ext=".txt";
		//get the image's alt text which is the "page number" we want
		var imgData=image.alt;
		//parse a float to remove padding zeroes
		var position=parseFloat(imgData);
		//make a string
		var mid=""+position;
		//add the padding zeroes to mid
		while(mid.length<3)mid="0"+mid;
		var textView=document.getElementById('textView');
		var txtSrc=textView.src;
		var item=String(dir+mid+ext);
		textView.setAttribute('src',item);
		document.getElementById("searchInput").placeholder="Search Transcription";
	}
	
	function toTranslation(){
		var image=document.getElementById('page');
		var dir="translation/trns_";
		var ext=".txt";
		//get the image's alt text which is the "page number" we want
		var imgData=image.alt;
		//parse a float to remove padding zeroes
		var position=parseFloat(imgData);
		//make a string
		var mid=""+position;
		//add the padding zeroes to mid
		while(mid.length<3)mid="0"+mid;
		var textView=document.getElementById('textView');
		var txtSrc=textView.src;
		var item=String(dir+mid+ext);
		textView.setAttribute('src',item);
		document.getElementById("searchInput").placeholder="Search Translation";
	}
	
	function toNotes(){
		var image=document.getElementById('page');
		var dir="note/note_";
		var ext=".txt";
		//get the image's alt text which is the "page number" we want
		var imgData=image.alt;
		//parse a float to remove padding zeroes
		var position=parseFloat(imgData);
		//make a string
		var mid=""+position;
		//add the padding zeroes to mid
		while(mid.length<3)mid="0"+mid;
		var textView=document.getElementById('textView');
		var txtSrc=textView.src;
		var item=String(dir+mid+ext);
		textView.setAttribute('src',item);
		document.getElementById("searchInput").placeholder="Search Notes";
	}
	
	function nextText(){
		var frame=document.getElementById('textView');
		var tsrc=frame.src;
		var note=tsrc.search("note");
		var trsc=tsrc.search("trsc");
		var trns=tsrc.search("trns");
		if(note>0){
			toNotes();
		}
		else if(trsc>0){
			toTranscription();
		}
		else if(trns>0){
			toTranslation();
		}
	}
    
	//DEPRECIATED FUNCTION
	//DO NOT USE
	//Use "goToNum(arg)" instead.
	//leaving it in... just in case we need it.
	//For some reason.
	function goToPage(){
		var image=document.getElementById('page');
		var text=document.getElementById('pagen_l');
		var dir="img/";
		var ext=".jpg";
		var data=String(text.value);
		if(!(parseFloat(data)<0)&&!(parseFloat(data)>900)){
			while(data.length<3)data="0"+data;
			image.src=String(dir+data+ext);
			image.alt=data;
			nextText();
			zoomDef();
		}
	}
	
	//HIGHLY ADAPTED from goToPage()
	//expects "num" to be a string with just the page number.
	//	typically: document.getElementById('pagen_l').value
	//	or id='pagen_r'.
	function goToNum(num){
		var image=document.getElementById('page');
		var dir="img/";
		var ext=".jpg";
		var data=String(num);
		if(parseFloat(data)>=0&&parseFloat(data)<=numPages){
			while(data.length<3)data="0"+data;
			image.src=String(dir+data+ext);
			image.alt=data;
			nextText();
			zoomDef();
			document.getElementById('pagen_l').value="";
			document.getElementById('pagen_r').value="";
			placeHolder(num);
		}
		
	}
    
	function zoomIn(){
		var image=document.getElementById('page');
		var imgStyle=image.style;
		var width=imgStyle["width"];
		var num=parseFloat(width.substring(0,width.indexOf("%")))+10;
		if(num<1001){
			imgStyle["width"]=num+"%";
		}
	}
	
	function zoomOut(){
		var image=document.getElementById('page');
		var imgStyle=image.style;
		var width=imgStyle["width"];
		var num=parseFloat(width.substring(0,width.indexOf("%")))-10;
		if(num>39){
			imgStyle["width"]=num+"%";
		}
	}
	
	function zoomDef(){
		var image=document.getElementById('page');
		var imgStyle=image.style;
		imgStyle["width"]="100%";
	}