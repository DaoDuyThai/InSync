import * as Blockly from 'blockly';

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
        "colour": 1,
        "tooltip": "Define a list of actions for the scenario",
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
        "colour": 150,
        "mutator": "delay_mutator"
    },
    {
        "type": "click",
        "message0": "click on %1",
        "args0": [
            {
                "type": "field_input",
                "name": "ON",
                "text": "element"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
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
        "colour": 60,
        "mutator": "open_app_mutator"
    },
    {
        "type": "for_block",
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
        "colour": 230,
        "mutator": "for_block_mutator"
    },
    {
        "type": "zoom",
        "message0": "zoom %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["in", "IN"],
                    ["out", "OUT"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
    },
    {
        "type": "swipe",
        "message0": "swipe %1 for %2 ms",
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
        "colour": 230,
        "mutator": "swipe_mutator"
    },
    {
        "type": "end_run",
        "message0": "end run",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
    },
    {
        "type": "object",
        "message0": "{ %1 %2 }",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "MEMBERS"
            }
        ],
        "output": null,
        "colour": 230
    },
    {
        "type": "member",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "field_input",
                "name": "MEMBER_NAME",
                "text": ""
            },
            {
                "type": "field_label",
                "name": "COLON",
                "text": ":"
            },
            {
                "type": "input_value",
                "name": "MEMBER_VALUE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
    }
]);

// Delay block mutator for showing/hiding log content field and setting default log content
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
              
              .appendField('Custom App Name:')
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


  Blockly.Extensions.registerMutator('for_block_mutator', {
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