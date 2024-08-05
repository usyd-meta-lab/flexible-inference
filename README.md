# Flexible-Inference
Flexible Inference Task

![alt text](http://cogflex.com.au/users/kit/demo/ID/FI-main/screenshot.png)


## Parameters

In addition to the parameters available in all plugins, this plugin accepts the following parameters. Parameters with a default value of undefined must be specified


| Parameter     | Type          | Default Value | Description
| ------------- | ------------- |------------- | ------------- |
| type          | string  | undefined        | Defines the trial type. Should be set to 'flexible-inference'|
| stimulus| string | undefined | The stimulus that needs to be categorised |
| correct_response | string | undefined | "arrowleft" or "arrowright" |
| feedback | boolean | false | If true feedback will be displayed |
| feedback_message | string | undefined | Text that can be shown as feedback |
| button_text | sting | undefined | Text shown on button
| set | string | undefined | Folder directory for the png files |
| movelist | array | undefined | An array of 12 moves in the format of start_finish e.g. 'x1_y4' would see an item move from the square x1 to y4 |


## Timeline Variables

Timeline variables are used to iterate across stimuli. The following timeline variables are included.

| Variable     |  Description | Example
| ------------- | ------------- |------------- |
| Setlist | Folder for pngs inputed to the set parameter | "Set1" |
| feedback | A message displayed as feedback. Set to " " if no message is to be displayed | "The correct answer is x because xyz" |
| correct_response | The correct response as a number, with numbers going down columns i.e. x1, x2, y1, y2 | 1 |
| movelist | An array of moves |["x1_x1", "x2_x2", "x3_x3", "x4_x4", "x5_x5", "x6_x6", "y1_y1", "y2_y2", "y3_y3", "y4_y4", "y5_y5", "y6_y6"] |


## Example


A working demonstration can be viewed at http://cogflex.com.au/users/kit/demo/ID/FI-main/exp-demo.html
```javascript
var FI_trial = {
    type: 'flexible-inference',
    correct_response: jsPsych.timelineVariable('correct_response'),
    feedback: true,
    feedback_message: jsPsych.timelineVariable('feedback'),
    button_text: "Next",
    set: jsPsych.timelineVariable('Setlist'),
    movelist: jsPsych.timelineVariable('movelist'),
};


var test_block = {
timeline: [FI_trial],
timeline_variables: [
{ Setlist: "Set1", movelist: ["x1_x1", "x2_x2", "x3_x3", "x4_x4",  "y1_y1", "y2_y2",  "y3_y3", "y4_y4"], correct_response: 1, feedback: "The correct answer is x because xyz"},
{ Setlist: "Set1", movelist: ["x1_y4", "x2_y1", "x3_x3", "x4_x4", "y1_x2", "y2_y2",  "y3_y3", "y4_x1"], correct_response: 2, feedback: "The correct answer is y because xyz"}
]

}


// List of images to be preloaded
var images = ['assets/Set1/choice_1.png','assets/Set1/choice_2.png','assets/Set1/choice_3.png','assets/Set1/x1.png','assets/Set1/x2.png','assets/Set1/x3.png','assets/Set1/x4.png','assets/Set1/x5.png','assets/Set1/x6.png','assets/Set1/y1.png','assets/Set1/y2.png','assets/Set1/y3.png','assets/Set1/y4.png','assets/Set1/y5.png','assets/Set1/y6.png',];
  var preload = {
      type: 'jsPsych-preload',
      images: images
  }

```
