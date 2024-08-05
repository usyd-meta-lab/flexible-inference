/**
 * jspsych-flexible-inference
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a button response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["flexible-inference"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('flexible-inference', 'stimulus', 'image');

  plugin.info = {
    name: 'flexible-inference',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: null,
        description: 'The image to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: ["A", "B", "C", "D"],
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="flexible-inference-btn"><img  width = "90px" height = "90px" src="%choice%"></button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '0px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      render_on_canvas: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Render on canvas',
        default: true,
        description: 'If true, the image will be drawn onto a canvas element (prevents blank screen between consecutive images in some browsers).'+
          'If false, the image will be shown via an img element.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var height, width;
    var html;
    if (trial.render_on_canvas) {
      var image_drawn = false;
      // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
      if (display_element.hasChildNodes()) {
        // can't loop through child list because the list will be modified by .removeChild()
        while (display_element.firstChild) {
          display_element.removeChild(display_element.firstChild);
        }
      }
      // create canvas element and image
      var canvas = document.createElement("canvas");
      canvas.id = "jspsych-flexible-inference-stimulus";
      canvas.style.margin = 0;
      canvas.style.padding = 0;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.onload = function() {
        // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
        if (!image_drawn) {
          getHeightWidth(); // only possible to get width/height after image loads
          ctx.drawImage(img,0,0,width,height);
        }
      };
      img.src = trial.stimulus;
      // get/set image height and width - this can only be done after image loads because uses image's naturalWidth/naturalHeight properties
      function getHeightWidth() {
        if (trial.stimulus_height !== null) {
          height = trial.stimulus_height;
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            width = img.naturalWidth * (trial.stimulus_height/img.naturalHeight);
          }
        } else {
          height = img.naturalHeight;
        }
        if (trial.stimulus_width !== null) {
          width = trial.stimulus_width;
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            height = img.naturalHeight * (trial.stimulus_width/img.naturalWidth);
          }
        } else if (!(trial.stimulus_height !== null & trial.maintain_aspect_ratio)) {
          // if stimulus width is null, only use the image's natural width if the width value wasn't set
          // in the if statement above, based on a specified height and maintain_aspect_ratio = true
          width = img.naturalWidth;
        }
        canvas.height = height;
        canvas.width = width;
      }
      getHeightWidth(); // call now, in case image loads immediately (is cached)
      // create buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in flexible-inference plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      var btngroup_div = document.createElement('div');
      btngroup_div.id = "jspsych-flexible-inference-btngroup";
      html = '';
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        html += '<div class="jspsych-flexible-inference-button" style=" display: inline-block; height: 4px; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-flexible-inference-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
      }
      html += '<img style = "position: absolute; width: 10%; left: 45%; top: 10%;" src="assets/'+ trial.set+'/prompt_1.png"></img>'
      html+= '<div id = matrices>'
      html+= '<div id = x_matrix>'
      html+= '<div id = "x1" class = "jspsych-flexible-inference-button square" style = "left: 34%; top: 40%;"></div>'
      html+= '<div id = "x2" class = "jspsych-flexible-inference-button square" style = "left: 40%; top: 40%;"></div>'
      html+= '<div id = "x3" class = "jspsych-flexible-inference-button square" style = "left: 34%; top: 52%;"></div>'
      html+= '<div id = "x4" class = "jspsych-flexible-inference-button square" style = "left: 40%; top: 52%;"></div>'

      html+= '</div>'
      html+= '<div id = y_matrix>'
      html+= '<div id = "y1" class = "jspsych-flexible-inference-button square" style = "left: 53%; top: 40%;"></div>'
      html+= '<div id = "y2" class = "jspsych-flexible-inference-button square" style = "left: 59%; top: 40%;"></div>'
      html+= '<div id = "y3" class = "jspsych-flexible-inference-button square" style = "left: 53%; top: 52%;"></div>'
      html+= '<div id = "y4" class = "jspsych-flexible-inference-button square" style = "left: 59%; top: 52%;"></div>'

      html+= '</div>'
      html+= '</div>'

      html+= '<div style = "position: absolute; width: 10%; left: 45%; top: 80%;" class = "jspsych-btn" id = "next-button">'+trial.button_text+'</div>'
      html+= '<div style = "position: absolute; width: 10%; left: 45%; top: 85%;" id = "feedback-message">'+trial.feedback_message+'</div>'
      html+= '<div style = "position: absolute; width: 50%; left: 26%; top: 30%;" id = "prompt-message">'+trial.prompt+'</div>'

      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[0]+'" id = "x1" src="assets/'+ trial.set+'/x1.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[1]+'" id = "x2" src="assets/'+ trial.set+'/x2.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[2]+'" id = "x3" src="assets/'+ trial.set+'/x3.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[3]+'" id = "x4" src="assets/'+ trial.set+'/x4.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[4]+'" id = "y1" src="assets/'+ trial.set+'/y1.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[5]+'" id = "y2" src="assets/'+ trial.set+'/y2.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[6]+'" id = "y3" src="assets/'+ trial.set+'/y3.png">'
      html+= '<img class = "jspsych-flexible-inference-button '+trial.movelist[7]+'" id = "y4" src="assets/'+ trial.set+'/y4.png">'





      // Matrix







      btngroup_div.innerHTML = html;


      // add buttons to screen
      display_element.insertBefore(btngroup_div, canvas.nextElementSibling);


    } else {

      // display stimulus as an image element
      html = '<img src="'+trial.stimulus+'" id="jspsych-flexible-inference-stimulus">';
      //display buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in flexible-inference plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      html += '<div id="jspsych-flexible-inference-btngroup">';

      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        html += '<div class="jspsych-flexible-inference-button" style="    border-style: solid; borderColor: red; display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-flexible-inference-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
      }
      html += '</div>';
      // add prompt
      if (trial.prompt !== null){
        html += trial.prompt;
      }
      // update the page content
      display_element.innerHTML = html;

      // set image dimensions after image has loaded (so that we have access to naturalHeight/naturalWidth)
      var img = display_element.querySelector('#jspsych-flexible-inference-stimulus');
      if (trial.stimulus_height !== null) {
        height = trial.stimulus_height;
        if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
          width = img.naturalWidth * (trial.stimulus_height/img.naturalHeight);
        }
      } else {
        height = img.naturalHeight;
      }
      if (trial.stimulus_width !== null) {
        width = trial.stimulus_width;
        if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
          height = img.naturalHeight * (trial.stimulus_width/img.naturalWidth);
        }
      } else if (!(trial.stimulus_height !== null & trial.maintain_aspect_ratio)) {
        // if stimulus width is null, only use the image's natural width if the width value wasn't set
        // in the if statement above, based on a specified height and maintain_aspect_ratio = true
        width = img.naturalWidth;
      }
      img.style.height = height.toString() + "px";
      img.style.width = width.toString() + "px";
    }

    // start timing
    var start_time = performance.now();


    var elements = document.getElementsByClassName("jspsych-flexible-inference-button");

    var myFunction = function(e) {
      var choice = e.currentTarget.getAttribute('id'); // don't use dataset for jsdom compatibility
      console.log(choice)
      if(trial.feedback == false){after_response(choice);}
      if(trial.feedback == true){

      if(trial.correct_response == 1){

        display_element.querySelector('#x1').style.borderColor = "green"
        display_element.querySelector('#x2').style.borderColor = "green"

                }

                if(trial.correct_response == 2){

                  display_element.querySelector('#x3').style.borderColor = "green"
                  display_element.querySelector('#x4').style.borderColor = "green"

                          }

                          if(trial.correct_response == 3){

                            display_element.querySelector('#y1').style.borderColor = "green"
                            display_element.querySelector('#y2').style.borderColor = "green"

                                    }

                                    if(trial.correct_response == 4){

                                      display_element.querySelector('#y3').style.borderColor = "green"
                                      display_element.querySelector('#y4').style.borderColor = "green"

                                              }

                                              var nb = document.querySelector("#next-button");
                                              nb.style.visibility='visible'
                                              var fb = document.querySelector("#feedback-message");
                                              fb.style.visibility='visible'

    };



}





    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', myFunction, false);
    }


    display_element.querySelector('#next-button').addEventListener('click', function(e){
      var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
      after_response(choice);
    });





    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = parseInt(choice);
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('.flexible-inference-btn').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-flexible-inference-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-flexible-inference-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    } else if (trial.response_ends_trial === false) {
      console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
    }
  };

  return plugin;
})();
