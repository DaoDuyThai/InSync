import * as Blockly from 'blockly';
import { toast } from 'sonner';

//Blockly block color
Blockly.utils.colour.setHsvSaturation(0.8) // 0 (inclusive) to 1 (exclusive), defaulting to 0.45
Blockly.utils.colour.setHsvValue(0.8) // 0 (inclusive) to 1 (exclusive), defaulting to 0.65

// Common block definitions
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        "type": "scenario",
        "message0": "Scenario %1",
        "args0": [
            {
                "type": "input_statement",
                "name": "ACTIONS"
            }
        ],
        "colour": 0,
        "tooltip": "Defines a sequence of actions in a scenario.",
        "helpUrl": ""
    },
    {
        "type": "open_app",
        "message0": "open app %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "APP_CHOICE",
                "options": [
                    ["Youtube", "com.google.android.youtube"],
                    ["Facebook", "com.facebook.katana"],
                    ["Instagram", "com.instagram.android"],
                    ["Twitter", "com.twitter.android"],
                    ["TikTok", "com.zhiliaoapp.musically"],
                    ["Zoom", "us.zoom.videomeetings"],
                    ["Google Meet", "com.google.android.apps.meetings"],
                    ["Other", "OTHER"]
                ]
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 35,
        "mutator": "open_app_mutator",
        "tooltip": "Opens a specified app.",
        "helpUrl": ""
    },
    {
        "type": "for",
        "message0": "repeat %1 times %2",
        "args0": [
            {
                "type": "field_number",
                "name": "TIMES",
                "value": 3,
                "min": 1,
                "precision": 1
            },
            {
                "type": "input_statement",
                "name": "ACTIONS"
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 70,
        "mutator": "for_mutator",
        "tooltip": "Repeats a sequence of actions a specified number of times.",
        "helpUrl": ""
    },
    {
        "type": "delay",
        "message0": "wait for %1 milliseconds",
        "args0": [
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 1000,
                "min": 0,
                "precision": 1
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 105,
        "mutator": "delay_mutator",
        "tooltip": "Pauses the scenario for a specified duration.",
        "helpUrl": ""
    },
    {
        "type": "click_smart",
        "message0": "click on %1\nfor %2 ms",
        "args0": [
            {
                "type": "field_image_drop",
                "name": "ON",
                "src": "/drop-image-here.png",
                "width": 50,
                "height": 50,
                "alt": "Drag image here"
            },
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 100,
                "min": 0,
                "precision": 1
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "mutator": "click_smart_mutator",
        "tooltip": "Clicks on the specified element for a set duration.",
        "helpUrl": ""
    },
    {
        "type": "click_xy",
        "message0": "click on position with\n X = %1\nand Y = %2\nfor %3 ms",
        "args0": [
            {
                "type": "field_number",
                "name": "X",
                "value": 0,
                "min": 0,
                "precision": 1
            },
            {
                "type": "field_number",
                "name": "Y",
                "value": 0,
                "min": 0,
                "precision": 1
            },
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 100,
                "min": 0,
                "precision": 1
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 175,
        "mutator": "click_xy_mutator",
        "tooltip": "Clicks at specific x and y coordinates.",
        "helpUrl": ""
    },
    {
        "type": "zoom",
        "message0": "zoom %1\nfor %2 ms",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["in", "IN"],
                    ["out", "OUT"]
                ]
            },
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 100,
                "min": 0,
                "precision": 1
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "mutator": "zoom_mutator",
        "tooltip": "Zooms in or out for a specified duration.",
        "helpUrl": ""
    },
    {
        "type": "swipe",
        "message0": "swipe %1\nfor %2 ms",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["left", "LEFT"],
                    ["right", "RIGHT"],
                    ["up", "UP"],
                    ["down", "DOWN"]
                ]
            },
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 100,
                "min": 0,
                "precision": 1
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 245,
        "mutator": "swipe_mutator",
        "tooltip": "Performs a swipe action in a specified direction for a set duration.",
        "helpUrl": ""
    },
    {
        "type": "rotate",
        "message0": "rotate %1\nfor %2 ms\nby %3 degrees",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["clockwise", "CLOCKWISE"],
                    ["counterclockwise", "COUNTERCLOCKWISE"]
                ]
            },
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 100,
                "min": 0,
                "precision": 1
            },
            {
                "type": "field_number",
                "name": "DEGREES",
                "value": 90,
                "min": 0,
                "max": 360,
                "precision": 1
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 280,
        "mutator": "rotate_mutator",
        "tooltip": "Rotates in the specified direction by a given number of degrees and duration.",
        "helpUrl": ""
    },
    {
        "type": "paste",
        "message0": "Input %1",
        "args0": [
            {
                "type": "field_input",
                "name": "PASTE_CONTENT",
                "text": "text"
            }
        ],
        "message1": "log %1",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "ISLOG",
                "options": [
                    ["false", "FALSE"],
                    ["true", "TRUE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 315,
        "mutator": "paste_mutator",
        "tooltip": "Inputs specified text content.",
        "helpUrl": ""
    },
    {
        "type": "log",
        "message0": "Log: %1",
        "args0": [
            {
                "type": "field_input",
                "name": "LOGCONTENT",
                "text": "Enter log content"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 350,
        "tooltip": "Logs a message with specified content.",
        "helpUrl": ""
    }
]);


/* ============================================================================================= */
/* =================================== OPEN APP ACTION START =================================== */
/* ============================================================================================= */
// Register open_app_mutator for dynamic log message field and custom app name input
Blockly.Extensions.registerMutator('open_app_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        const isOther = this.getFieldValue('APP_CHOICE') === 'OTHER';
        container.setAttribute('is_log', isLog.toString());
        container.setAttribute('is_other', isOther.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        const isOther = (xmlElement.getAttribute('is_other') === 'true');
        this.updateShape(isLog, isOther);
    },
    updateShape: function (isLog: boolean, isOther: boolean) {
        // Handle "Other" app input
        if (isOther) {
            if (!this.getInput('CUSTOM_APP')) {
                this.appendDummyInput('CUSTOM_APP')
                    .appendField('custom app name:')
                    .appendField(new Blockly.FieldTextInput(''), 'CUSTOM_APP_NAME');
            }
        } else {
            if (this.getInput('CUSTOM_APP')) {
                this.removeInput('CUSTOM_APP');
            }
        }

        // Handle logging
        // Handle logging
        const appName = isOther ? (this.getFieldValue('CUSTOM_APP_NAME') || "appName") : this.getFieldValue('APP_CHOICE');
        const defaultLogMessage = `Open app ${appName}`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                // Add log content input with the default message
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                // Only update log content if it matches the default, to preserve user-entered text
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === `Open app ${appName}` || currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        const isOther = this.getFieldValue('APP_CHOICE') === 'OTHER';
        this.updateShape(isLog, isOther);
    }
});
/* ============================================================================================= */
/* ==================================== OPEN APP ACTION END ==================================== */
/* ============================================================================================= */


/* ============================================================================================= */
/* ===================================== FOR ACTION START ====================================== */
/* ============================================================================================= */
// Register for_mutator for dynamic log message field
Blockly.Extensions.registerMutator('for_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const defaultLogContent = `Repeat ${this.getFieldValue('TIMES')} times`;
        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogContent), 'LOGCONTENT');
            } else {
                const currentLogContent = this.getFieldValue('LOGCONTENT');
                if (currentLogContent === defaultLogContent) {
                    this.setFieldValue(defaultLogContent, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
/* ============================================================================================= */
/* ====================================== FOR ACTION END ======================================= */
/* ============================================================================================= */

/* ============================================================================================= */
/* ==================================== DELAY ACTION START ===================================== */
/* ============================================================================================= */
// Register delay_mutator for dynamic log message field
Blockly.Extensions.registerMutator('delay_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const duration = this.getFieldValue('DURATION') || 1000;
        const defaultLogMessage = `Delay for ${duration} milliseconds`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                // Add the log content input if it doesn’t exist, using the default message
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                // Only update the log content if it’s currently set to the default message
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === `Delay for ${duration - 1} milliseconds` || currentLogMessage === `Delay for ${duration + 1} milliseconds` || currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
/* ============================================================================================= */
/* ===================================== DELAY ACTION END ====================================== */
/* ============================================================================================= */


/* ============================================================================================= */
/* ================================= SMART CLICK ACTION START ================================== */
/* ============================================================================================= */
// Update click_smart_mutator to ensure ON field is managed
Blockly.Extensions.registerMutator('click_smart_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());

        // Save ON field value in mutation
        const onFieldValue = this.getFieldValue('ON') || '';
        container.setAttribute('on_field', onFieldValue);

        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);

        // Restore ON field value from mutation
        const onFieldValue = xmlElement.getAttribute('on_field') || '';
        if (onFieldValue) {
            this.setFieldValue(onFieldValue, 'ON');
        }
    },
    updateShape: function (isLog: boolean) {
        const duration = this.getFieldValue('DURATION') || 100;
        const defaultLogMessage = `Click for ${duration} ms`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                // Add the log content input if it doesn’t exist, with the default message
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === `Click for ${duration - 1} ms` || currentLogMessage === `Click for ${duration + 1} ms` || currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function () {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
// Custom FieldImageDrop Class (from previous setup)
class FieldImageDrop extends Blockly.FieldImage {
    private imageUrl: string | null = null;

    constructor(url: string, width: number, height: number, alt: string) {
        super(url, width, height, alt);
        this.imageUrl = url || '';
    }

    initView() {
        super.initView();

        if (this.sourceBlock_ && this.fieldGroup_) {
            this.fieldGroup_.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = 'copy';
                }
            });

            this.fieldGroup_.addEventListener('drop', (e) => {
                e.preventDefault();
                const url = e.dataTransfer ? e.dataTransfer.getData('URL') : '';
                if (this.isValidImageUrl(url)) {
                    this.setValue(url);
                    // Ensure the ON field is set on the block
                    if (this.sourceBlock_) {
                        this.sourceBlock_.setFieldValue(url, 'ON');
                        if (this.sourceBlock_ && this.sourceBlock_.onchange) {
                            this.sourceBlock_.onchange(new Blockly.Events.BlockChange(this.sourceBlock_, 'field', 'ON', '', url));
                        }
                    }
                } else {
                    console.warn("Invalid URL format");
                }
            });
        }
    }

    private isValidImageUrl(url: string): boolean {
        return /\.(png|jpe?g|gif|svg)$/i.test(url);
    }

    setValue(url: string | null) {
        if (url && this.isValidImageUrl(url)) {
            this.imageUrl = url;
            super.setValue(url);
        }
    }
}

// Register the custom field
Blockly.fieldRegistry.register('field_image_drop', FieldImageDrop);
/* ============================================================================================= */
/* ================================== SMART CLICK ACTION END =================================== */
/* ============================================================================================= */

/* ============================================================================================= */
/* =================================== XY CLICK ACTION START =================================== */
/* ============================================================================================= */

Blockly.Extensions.registerMutator('click_xy_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const duration = this.getFieldValue('DURATION') || 1000;
        const defaultLogMessage = `Click at (${this.getFieldValue('X')}, ${this.getFieldValue('Y')}) for ${duration} ms`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});

/* ============================================================================================= */
/* ==================================== XY CLICK ACTION END ==================================== */
/* ============================================================================================= */

/* ============================================================================================= */
/* ===================================== ZOOM ACTION START ===================================== */
/* ============================================================================================= */
// Register zoom_mutator for dynamic log message field
Blockly.Extensions.registerMutator('zoom_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const direction = this.getFieldValue('DIRECTION') || "in";
        const duration = this.getFieldValue('DURATION') || 100;
        const defaultLogMessage = `Zoom ${direction} for ${duration} ms`;
        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
/* ============================================================================================= */
/* ===================================== ZOOM ACTION END ======================================= */
/* ============================================================================================= */

/* ============================================================================================= */
/* ==================================== SWIPE ACTION START ===================================== */
/* ============================================================================================= */
// Register swipe_mutator for dynamic log message field
Blockly.Extensions.registerMutator('swipe_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const direction = this.getFieldValue('DIRECTION') || "left";
        const duration = this.getFieldValue('DURATION') || 100;
        const defaultLogMessage = `Swipe ${direction} for ${duration} ms`;
        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
/* ============================================================================================= */
/* ===================================== SWIPE ACTION END ====================================== */
/* ============================================================================================= */

/* ============================================================================================= */
/* ==================================== ROTATE ACTION START ==================================== */
/* ============================================================================================= */
// Register rotate_mutator for dynamic log message field 
Blockly.Extensions.registerMutator('rotate_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const direction = this.getFieldValue('DIRECTION') || "CLOCKWISE";
        const duration = this.getFieldValue('DURATION') || 100;
        const degrees = this.getFieldValue('DEGREES') || 90;
        const defaultLogMessage = `Rotate ${direction} for ${duration} ms by ${degrees} degrees`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
/* ============================================================================================= */
/* ===================================== ROTATE ACTION END ===================================== */
/* ============================================================================================= */

/* ============================================================================================= */
/* ==================================== PASTE ACTION START ===================================== */
/* ============================================================================================= */
//Register paste_mutator for dynamic log message field
Blockly.Extensions.registerMutator('paste_mutator', {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        container.setAttribute('is_log', isLog.toString());
        return container;
    },
    domToMutation: function (xmlElement: Element) {
        const isLog = (xmlElement.getAttribute('is_log') === 'true');
        this.updateShape(isLog);
    },
    updateShape: function (isLog: boolean) {
        const pasteContent = this.getFieldValue('PASTE_CONTENT') || "text";
        const defaultLogMessage = `Input "${pasteContent}"`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogMessage), 'LOGCONTENT');
            } else {
                const currentLogMessage = this.getFieldValue('LOGCONTENT');
                if (currentLogMessage === defaultLogMessage) {
                    this.setFieldValue(defaultLogMessage, 'LOGCONTENT');
                }
            }
        } else {
            if (this.getInput('LOGCONTENT_INPUT')) {
                this.removeInput('LOGCONTENT_INPUT');
            }
        }
    },
    onchange: function (e: Blockly.Events.Abstract) {
        const isLog = this.getFieldValue('ISLOG') === 'TRUE';
        this.updateShape(isLog);
    }
});
/* ============================================================================================= */
/* ===================================== PASTE ACTION END ====================================== */
/* ============================================================================================= */


















