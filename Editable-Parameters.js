// Flexible Inference

var FI_trial = {
    type: 'flexible-inference',
    correct_response: jsPsych.timelineVariable('correct_response'),
    feedback: true,
    feedback_message: jsPsych.timelineVariable('feedback'),
    button_text: "Next",
    set: jsPsych.timelineVariable('Setlist'),
    movelist: jsPsych.timelineVariable('movelist'),
    prompt: "Select the pair of answer choices that is the best match to the given item, based on their common properties"
};


var test_block = {
timeline: [FI_trial],
timeline_variables: [
{ Setlist: "Set1", movelist: ["x1_x1", "x2_x2", "x3_x3", "x4_x4",  "y1_y1", "y2_y2",  "y3_y3", "y4_y4"], correct_response: 1, feedback: "The correct answer is x because xyz"},
{ Setlist: "Set1", movelist: ["x1_y4", "x2_y1", "x3_x3", "x4_x4", "y1_x2", "y2_y2",  "y3_y3", "y4_x1"], correct_response: 2, feedback: "The correct answer is y because xyz"}
]

}


// List of images to be preloaded
var images = ['assets/Set1/prompt_1.png','assets/Set1/x1.png','assets/Set1/x2.png','assets/Set1/x3.png','assets/Set1/x4.png','assets/Set1/y1.png','assets/Set1/y2.png','assets/Set1/y3.png','assets/Set1/y4.png'];
var preload = {
    type: 'preload',
    images: images
}
