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
        "tooltip": "Container for scenario actions",
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
        "colour": 50,
        "mutator": "delay_mutator",
    },
    {
        "type": "click",
        "message0": "click on %1 for %2 ms",
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
        "colour": 100,
        "mutator": "click_mutator",
        "tooltip": "Clicks on the specified element and optionally logs a message.",
        "helpUrl": "",
    },
    {
        "type": "open_app",
        "message0": "open app %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "APP_CHOICE",
                "options": [
                    ["App 1", "com.example.app1"],
                    ["App 2", "com.example.app2"],
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
        "colour": 150,
        "mutator": "open_app_mutator",
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
        "colour": 200,
        "mutator": "for_mutator",
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
        "colour": 250,
        "mutator": "zoom_mutator",
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
        "colour": 300,
        "mutator": "swipe_mutator",
    }
]);


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
        const logMessage = `Delay for ${duration} milliseconds`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(logMessage), 'LOGCONTENT');
            } else {
                // Update the default log content when the delay is updated
                this.setFieldValue(logMessage, 'LOGCONTENT');
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

// Register click_mutator for dynamic log message field
Blockly.Extensions.registerMutator('click_mutator', {
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
        const logMessage = `Click for ${duration} ms`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(logMessage), 'LOGCONTENT');
            } else {
                this.setFieldValue(logMessage, 'LOGCONTENT');
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
                    .appendField('Custom app name:')
                    .appendField(new Blockly.FieldTextInput(''), 'CUSTOM_APP_NAME');
            }
        } else {
            if (this.getInput('CUSTOM_APP')) {
                this.removeInput('CUSTOM_APP');
            }
        }

        // Handle logging
        const appName = isOther ? this.getFieldValue('CUSTOM_APP_NAME') || "appName" : this.getFieldValue('APP_CHOICE');
        const logMessage = `Open app ${appName}`;
        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(logMessage), 'LOGCONTENT');
            } else {
                this.setFieldValue(logMessage, 'LOGCONTENT');
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
        // Default log content for for_block
        const defaultLogContent = `Repeat ${this.getFieldValue('TIMES')} times`;

        // Add or remove log content field based on isLog value
        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(defaultLogContent), 'LOGCONTENT');
            } else {
                this.setFieldValue(defaultLogContent, 'LOGCONTENT');
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
        const duration = this.getFieldValue('DURATION') || 1000;
        const logMessage = `Zoom ${direction} for ${duration} ms`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(logMessage), 'LOGCONTENT');
            } else {
                this.setFieldValue(logMessage, 'LOGCONTENT');
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
        const duration = this.getFieldValue('DURATION') || 1000;
        const logMessage = `Swipe ${direction} for ${duration} ms`;

        if (isLog) {
            if (!this.getInput('LOGCONTENT_INPUT')) {
                this.appendDummyInput('LOGCONTENT_INPUT')
                    .appendField('with content')
                    .appendField(new Blockly.FieldTextInput(logMessage), 'LOGCONTENT');
            } else {
                this.setFieldValue(logMessage, 'LOGCONTENT');
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