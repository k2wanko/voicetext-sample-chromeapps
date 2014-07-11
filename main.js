
(function($){

  $(function(){

    var appWindow = chrome.app.window.current();
    
    var api_key = null;

    chrome.storage.local.get("api_key", function(d){
      if(!d.hasOwnProperty("api_key")){

        $("#use_consent").modal({backdrop:'static',keyboard:false});
        $(".btn-close").click(function(){
          appWindow.close();
        });
        $("#use_consent_agree").prop("disabled", true);
        $("#use_consent_agree").click(function(){
          var val = api_key = $("#modal_api_key_form").val();
          if(!val) return;
          chrome.storage.local.set({api_key: val}, function(){
            $("#use_consent").modal('hide');
          });
        });
        $("#modal_api_key_form").keyup(function(e){
          var val = $(this).val();
          if(val){
            $("#use_consent_agree").prop("disabled", false);
          }else{
            $("#use_consent_agree").prop("disabled", true);
          }
        });
        
      } else {
        api_key = d.api_key;
      }
    });

    $("#edit_api_key_btn").click(function(){
      chrome.storage.local.get("api_key", function(d){
        $("#edit_api_key").modal();
        var $form= $("#edit_api_key_form");
        $form.val(d.api_key);
      });
      
    });

    $("#edit_api_key_save_btn").click(function(){
      var v = api_key = $("#edit_api_key_form").val();
      chrome.storage.local.set({api_key:v}, function(){
        $("#edit_api_key").modal("hide");
      });
    });

    $("#btn_display_front").click(function(e){
      appWindow.setAlwaysOnTop(!appWindow.isAlwaysOnTop());

      if(!appWindow.isAlwaysOnTop()){
        $("#display_icon").addClass("glyphicon-ok");
      }else{
        $("#display_icon").removeClass("glyphicon-ok");
      }
    });
    
    $("input.slider").slider({formater: function(value) {
      $("#"+this.id).removeAttr("data-val");
      $("#"+this.id).attr("data-val", value);
      return value;
    }});
    
    $("#speaker").change(function(e){

      $emotion = $("#emotion,#emotion_level");

      if($(this).val() === "show"){
        $emotion.prop("disabled", true);
      } else {
        $emotion.prop("disabled", false);
      }
    });

    $("#speaker").change();

    $("#play,#save").click(function(e){
      var self = this;

      var saveFrag = $(this).attr("id") === "save" ? true : false;

      var text = $("#text").val();

      if(!text) return;

      var data = {
        text: text,
        volume: $("#volume").attr("data-val"),
        pitch:$("#pitch").attr("data-val"),
        speed:$("#speed").attr("data-val"),
      };

      var speaker = $("#speaker").val();

      data['speaker'] = speaker;

      if(speaker !== 'show') {
        var emotion = $("#emotion").val();
        if(emotion){
          data['emotion'] = emotion;
          data['emotion_level'] = $("#emotion_level").val()
        }
      }

      var $container = $('<div class="col-xs-12 row"><div class="col-xs-4">'+speaker+':「'+text+'」</div><div cl\
ass="col-xs-6 player-container"></div><div class="col-xs-2"><a download="'+text+'" href="#" target="_blank" class="download btn btn-default">Save</a></div></div>');

      $("#history").prepend($container);
      
      voicetext(api_key, data, function(e, base64, mime){
        if(e){
          console.error(e);
          $container.find(".player-container").append('<p style="color:red;">'+e.message+'</p>');
          return;
        }
        var dataURI = 'data:audio/wav;base64,'+base64;
        var $audio = $("<audio controls>");
        $container.find(".player-container").append($audio);
        $audio.attr("src", dataURI);
        var $a = $container.find("a.download");
        $a.attr("href", dataURI);
        if(saveFrag){
          $a[0].click();
        }else{
          $audio[0].play();
        }
        $("#text").val("");
      });
        
    });
    
  });
}).call(this, jQuery);
