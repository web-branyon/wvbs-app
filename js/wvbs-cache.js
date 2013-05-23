	  var DATADIR;
	  var knownfiles = []; 	  
	  //Loaded my file system, now let's get a directory entry
	  function onFSSuccess(fileSystem) {
		  fileSystem.root.getDirectory("Android/data/org.wvbs.videos",{create:true},gotDir,onError);
	  }
	  //The directory entry callback
	  function gotDir(d){
		  console.log("got dir");
		  DATADIR = d;
		  var reader = DATADIR.createReader();
		  reader.readEntries(function(d){ gotFiles(d); appReady(); }, onError);
	  }
	  //Result of reading my directory
	  function gotFiles(entries) {
		  console.log("The dir has "+entries.length+" entries.");
		  for (var i=0; i<entries.length; i++) {
			  console.log(entries[i].name+' dir? '+entries[i].isDirectory);
			  knownfiles.push(entries[i].name);
		  }
	  }
	  function appReady(){
		  $.get("http://www.raymondcamden.com/demos/2012/jan/17/imagelister.cfc?method=listimages", {}, function(res) {
			  if (res.length > 0) {
				  $("#status").html("Going to sync some images...");
				  for (var i = 0; i < res.length; i++) {
					  if (knownfiles.indexOf(res[i]) == -1) {
						  console.log("need to download " + res[i]);
						  var ft = new FileTransfer();
						  var dlPath = DATADIR.fullPath + "/" + res[i];
						  console.log("downloading to " + dlPath);
						  ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(e){
							  console.log("Successful download of"+e.fullPath);
						  }, onError);
					  }
				  }
			  }
			  $("#status").html("");
		  }, "json");
	  }
	  function onError(e){
		  console.log("ERROR");
		  console.log(JSON.stringify(e));
	  }