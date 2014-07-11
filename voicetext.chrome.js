

(function($){

  if(chrome.app === null) {
    console.error("Chrome Apps only library.");
    return;
  }

  var voicetext = window.voicetext = function(api_key, options, callback){
    
    var url = "https://api.voicetext.jp/v1/tts";
    if(!api_key){
      if(typeof callback === 'function'){callback(new Error("undefined api key."));}
      return;
    }

    var data = options;

    var postData = function( data ){
      var params = [];
      for( var k in data ) {
        var v = data[k];
        var param = encodeURIComponent(k).replace(/%20/g,'+')
          + '=' + encodeURIComponent(v).replace(/%20/g,'+');
        
        params.push( param );
      }

      return params.join( '&' );
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4 && xhr.status === 200){
        var bytes = new Uint8Array(xhr.response);
        var binaryData = "";
        for (var i = 0, len = bytes.byteLength; i < len; i++) {
          binaryData += String.fromCharCode(bytes[i]);
        }
        if(typeof callback === "function"){
          return callback.call(window, null, btoa(binaryData), xhr.getResponseHeader('content-type'), xhr);
        }
      } else {
        if(xhr.readyState === 4){
          if(typeof callback === "function"){
            return callback.call(window, new Error(xhr.statusText));
          }
        }
      }
    };
    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr.setRequestHeader("Authorization", "Basic " + btoa(api_key + ":"));
    xhr.send( postData( data ) );    
  };
  
  

}).call(this, jQuery);
