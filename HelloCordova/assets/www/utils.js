	var myUrl = document.location;
	document.$_GET = [];
	var urlHalves = String(document.location).split('?');
	if(urlHalves[1]){
	  var urlVars = urlHalves[1].split('&');
	  for(var i=0; i<=(urlVars.length); i++){
	     if(urlVars[i]){
	        var urlVarPair = urlVars[i].split('=');
	        document.$_GET[urlVarPair[0]] = urlVarPair[1];
	     }
	  }
	}

	var my_media = null;
//	alert("myUrl=" + myUrl);
	var myPath = String(myUrl).substring(0, String(myUrl).lastIndexOf("/")+1);
	var itemPath;
	//var itemPath = "file:///D:/tony.huang/tony/learn/dropbox/Dropbox/Public/html5/korrnelabc/science/";
	var itemPath = "file:///storage/sdcard0/Download/review/science/";
	var correctNum = 0;
	var wrongNum = 0;		
	var qNo = 0;
	var QNum = 0;
	var qAry = new Array();
	var testMode = 0;	//0: review
						//1: input text and auto-check
						//2: show anwser and check by self
	var pageName;
	var rvAry = new Array();
	if (document.$_GET['testMode'] != undefined) testMode = parseInt(document.$_GET['testMode']);

	function getQAry_lc(myQues)
	{
//		alert("myQues.length=" + myQues.length);		
		var rvAryIdx = 0;

		for (var i=0; i < myQues.length; i++)
		{
			// check review list			
			if (rvAry.length > 0) {
//				alert("rvAry.length=" + rvAry.length);
				if (isExistInReviewList(myQues[i][0]) != 1) continue;
			}

			var word = new Object;			
			if (myQues[i][0] && myQues[i][1]) 
			{				
				word.no		   = QNum + 1;
				word.answer    = myQues[i][0];
				word.item1Type = myQues[i][1];
				word.item1	   = myQues[i][2];
				if (myQues[i][3]) {
					word.item2Type = myQues[i][3];
					word.item2	   = myQues[i][4];
				}
				if (myQues[i][5]) {
					word.item3Type = myQues[i][5];
					word.item3	   = myQues[i][6];
				}
				if (myQues[i][7]) {
					word.item4Type = myQues[i][7];
					word.item4	   = myQues[i][8];
				}
				word.score = 0;

				qAry[QNum++] = word;
//				alert("Q[" + i + "]" + "answer:" + qAry[i].answer);
			}
		}
	}

	function showItem_lc(html, type, value, path) 
	{
		if (type == 'snd') {
//			alert("audio:" + path + value);
//			html.push('<audio id="', value, '"><source src="', path+value, '" type="audio/mp3"></audio>');
//			html.push('<button type="button" onclick="playAudio(\'', value, '\')">audio</button><br>');
			html.push('<a href="#" class="btn large" onclick="playAudio(\'', path + value, '\');">Listen</a><br>');
		} else if (type == 'img')
			html.push('<center><img src="', path+value, '" width="720"></center><br>');
		else if (type == 'txt')
			html.push(value, '<br>');		
	}
	
	function gotoReview_lc()
	{		
//		alert("qAry.length=" + qAry.length);
		var html = ['<table border="1">'];
		for (i=0; i < qAry.length; i++) {
			html.push('<tr>');
			html.push('<td>', i+1, '</td>');
			html.push('<td>', qAry[i].answer, '</td>');
			html.push('<td>');
			if (qAry[i].item1Type && qAry[i].item1) {
				showItem_lc(html, qAry[i].item1Type, qAry[i].item1, itemPath);				
			}
			html.push('</td>');
			html.push('<td>');
			if (qAry[i].item2Type && qAry[i].item2) {
				showItem_lc(html, qAry[i].item2Type, qAry[i].item2, itemPath);					
			}
			html.push('</td>');
			html.push('<td>');
			if (qAry[i].item3Type && qAry[i].item3) {
				showItem_lc(html, qAry[i].item3Type, qAry[i].item3, itemPath);					
			}
			html.push('</td>');
			html.push('<td>');
			if (qAry[i].item4Type && qAry[i].item4) {
				showItem_lc(html, qAry[i].item4Type, qAry[i].item4, itemPath);					
			}
			html.push('</td>');
			html.push('</tr>');	
//			alert("html=" + html);		
		}
		html.push('</table><br>');
		
		// randomize the question list
		arrayShuffle(qAry);		
		
		html.push('<form action=""><input type="button" name="start" value="start" onClick="gotoInputText_lc()"></form>');
		
		document.getElementById("question").innerHTML = html.join('');
	}	
	
	function findNextQuestion_lc()
	{
		var findQNum = 0;
		var newQNo = qNo;
		do {			
			newQNo = (newQNo + 1) % qAry.length;
			if (findQNum >= qAry.length) {
				newQNo = -1;
				break;
			}
			findQNum++;
		} while (qAry[newQNo].score >= 1);
//		alert("newQNo:" + newQNo);
		return newQNo;
	}	
	
	function showScore_lc() 
	{
		var score = ['<br>'];
		score.push('correct: ', correctNum, '  wrong: ', wrongNum, '  score: ', localStorage.score, ' questions: ', QNum);
		document.getElementById("score").innerHTML = score.join('');			
	}	
	
	function nextButton_lc(partHtml)
	{
		var html = [''];
		
//		alert("html:"+partHtml+"qNo:"+qNo);
		if (partHtml != null)
			html = partHtml;
			
		qNo = findNextQuestion_lc();
		if (qNo >= 0) {
			html.push('<br>');
			html.push('<input type="button" name="next" value="next" onClick="gotoInputText_lc()">');
		} else {
			showScore_lc();
			html.push('complete the exam<br>');
			html.push('<font color="red">');

			var newUrl = document.location;
//			alert("newUrl:" + newUrl);
			html.push('<p><p><font size="+2"><a href="', newUrl, '">Great!! Call Dad and do the next page</a></font>');	
		}
		document.getElementById("status").innerHTML = html.join('');	
	}	
	
	function isExistInReviewList(answer)
	{
		for (var i=0; i < rvAry.length; i++) {
			if (rvAry[i] == answer) return 1;
		}
		return 0;
	}
	
	function updateReviewList(op, qNo)
	{
		if (op == 1) {	// insert
			rvAry[rvAry.length] = qAry[qNo].answer;
		} else {		// remove
			for (var i=0; i < rvAry.length; i++) {
				if (rvAry[i] == qAry[qNo].answer) {
					rvAry.splice(i, 1);
					break;
				}
			}
		}
		
		if (rvAry.length == 0) {
			if (op == 0) localStorage.removeItem(pageName+"review");
		} else {
			localStorage[pageName+"review"] = rvAry[0];
			for (var i=1; i < rvAry.length; i++) {
				localStorage[pageName+"review"] += "|" + rvAry[i];
			}
		}
	}

	function removeReviewList(qNo)
	{
		var ret = isExistInReviewList(qAry[qNo].answer);
		if (ret == 1) updateReviewList(0, qNo);
	}
	
	function insertReviewList(qNo)
	{
		var ret = isExistInReviewList(qAry[qNo].answer);
		if (ret == 0) updateReviewList(1, qNo);
	}

	function checkAnswer_lc(word)
	{
		if (confirm("Are you sure?"+"    ["+word+"]") == false) return;
				
		document.getElementById("question").innerHTML = '';
		
//		alert("word=" + word + " answer=" + qAry[qNo].answer);
		var html = ['<br><br><br>'];
		if (word == qAry[qNo].answer) {
//			alert("correct");
			html.push('<font color="blue">correct</font>', '<br>');
			correctNum++;
			QNum--;
			qAry[qNo].result = 1;
			qAry[qNo].score += 1;
			
			
			if (qAry[qNo].score >= 1) {				
     localStorage.score = Number(localStorage.score) + 1;
				removeReviewList(qNo);
			}
		} else {
			html.push('<font color="red">');
			html.push('Wrong answer: [', word, ']</font><br>');
			html.push('<font color="blue">Right answer: [', qAry[qNo].answer, ']</font><br>');
			wrongNum++;
			QNum++;
			qAry[qNo].result = -1;
			qAry[qNo].score -= 1;
//			localStorage.score = Number(localStorage.score) - 1;
            if (qAry[qNo].score < -2) qAry[qNo].fail = 1;
            
            insertReviewList(qNo);
		}		

		nextButton_lc(html);			
	}	
	
	function noenter_lc(form) 
	{
		if (window.event.keyCode == 13) 
			checkAnswer_lc(form.word.value);
		return !(window.event && window.event.keyCode == 13); 
	}	
	
	function gotoInputText_lc()
	{
//		alert("gotoInputText_lc()");
		document.getElementById("status").innerHTML = '';
		showScore_lc();
		
		var html = ['<center>'];	//['<table frame="void" width=800 height=500><tr><td><center>'];
		html.push('<br><form name="quiz" action="" method="get">');
		if (qAry[qNo].item1Type && qAry[qNo].item1) {
			showItem_lc(html, qAry[qNo].item1Type, qAry[qNo].item1, itemPath);
		}			
		if (qAry[qNo].item2Type && qAry[qNo].item2) {
			showItem_lc(html, qAry[qNo].item2Type, qAry[qNo].item2, itemPath);
		}				
		if (qAry[qNo].item3Type && qAry[qNo].item3) {
			showItem_lc(html, qAry[qNo].item3Type, qAry[qNo].item3, itemPath);
		}
		if (qAry[qNo].item4Type && qAry[qNo].item4) {
			showItem_lc(html, qAry[qNo].item4Type, qAry[qNo].item4, itemPath);
		}

		html.push('[Q', qAry[qNo].no, ']');
		html.push('<input type="text" name="word" onkeypress="return noenter_lc(this.form)"><br>');
		html.push('</form>');	
		html.push('</center>');	//html.push('</center></td></tr></table>');
		document.getElementById("question").innerHTML = html.join('');
	}	

	
	function arrayShuffle(theArray) {
		var len = theArray.length;
		var i = len;
		 while (i--) {
		 	var p = parseInt(Math.random()*len);
			var t = theArray[i];
				theArray[i] = theArray[p];
		  	theArray[p] = t;
		}
	}
	
	function clearLocalStorage(key) {
		if (document.$_GET['clr_ls'] != undefined) {
			// clear local storage
			alert("clar local storage:"+key);
			localStorage.removeItem(key);
		}
	}
	
	function clipImage(file, clipX, clipY, clipW, clipH)
	{
	    var html = [''];
	    var myWidth=clipW, myHeight=clipH;
	
	    imgStr = '<img id="'+file+'" src="'+file+'" width="0" height="0"/>';
	    canvasStr = '<canvas id="myCan1" width="'+myWidth+'"    height="'+myHeight+'"/>';
	    html.push(imgStr);
	    html.push(canvasStr);
	    document.getElementById("test").innerHTML = html.join('');
	    var img1=document.getElementById(file);
	    var c1=document.getElementById("myCan1");
	    var ctx1=c1.getContext("2d");
	    ctx1.drawImage(img1,clipX,clipY,clipW,clipH,0,0,clipW,clipH);
	}
	
	function main_lc(quesAry, selectPageName)
	{
//		alert("main_lc()");		

		// test new function...
		//test_localStorage();
   		//var lesson = "sc21review";
		//alert(localStorage[lesson]);
   		//localStorage.removeItem(lesson);
		//return;

		// init.
		document.getElementById('select_page').style.visibility = 'hidden'; 
		document.getElementById('review_list').style.visibility = 'hidden'; 
		itemPath = getPhoneGapPath() + subPath;
		pageName = selectPageName;		
		if (localStorage[pageName+"review"]) {
			rvAry = localStorage[pageName+"review"].split("|");
		}
//		alert("pageName=" + pageName);
		
		// create the question array
		getQAry_lc(quesAry);
		
		// start test
		gotoReview_lc();

	}

	function getPhoneGapPath() {
		var path = window.location.pathname;
//		alert(path);
		path = path.substr( path, path.length - 10 );
		return 'file://' + path;		
	}

	// for phonegap version
    function playAudio(src) {
    	//alert("#playAudio:" + src);

        // Create Media object from src
        my_media = new Media(src, onAudioSuccess, onAudioError);

        // Play audio
        my_media.play();
    }	
    
    // onSuccess Callback
    //
    function onAudioSuccess() {
        console.log("playAudio():Audio Success");
        my_media.release();
    }

    // onError Callback 
    //
    function onAudioError(error) {
        alert('code: '    + error.code    + '\n' + 
              'message: ' + error.message + '\n');
        my_media.release();
    }     
/*  // old version for web browser
	function playAudio(id)
	{
	    alert("id:" + id);
	    var audio = document.getElementById(id);
	    audio.play();
	}	
*/	