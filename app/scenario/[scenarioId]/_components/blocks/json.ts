import * as Blockly from 'blockly';

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        "type": "scenario",
        "message0": "Scenario %1",
        "args0": [
            {
                "type": "input_statement",  // Allows multiple blocks (actions) to be nested inside
                "name": "ACTIONS"
            }
        ],
        "colour": 1,
        "tooltip": "Define a list of actions for the scenario",
        "helpUrl": "",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
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
                "type": "field_input",
                "name": "ON",
                "text": "appName"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
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
                "name": "ACTIONS" // This allows other action blocks to be snapped inside
            }
        ],
        "previousStatement": null,  // Allows the for_block to be part of a larger sequence
        "nextStatement": null,      // Allows other blocks to chain after the for_block
        "colour": 230
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
        "message0": "swipe %1",
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
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
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
        "colour": 230,
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
        "colour": 230,
    }
]);

