import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');

/* ===================================== SCENARIO START ======================================== */
jsonGenerator.forBlock['scenario'] = function (block, generator) {
  const actions = generator.statementToCode(block, 'ACTIONS');  // Get the actions inside
  const code = `[
    {
        "actionType": "DELAY",
        "isLog": true,
        "logContent": "Starting up",
        "duration": 1000
    },${actions},
    {
        "actionType": "END_RUN"
    }
]`;
  return code;
};
/* ======================================= SCENARIO END ======================================== */

/* =================================== OPEN APP ACTION START =================================== */
jsonGenerator.forBlock['open_app'] = function (block) {
  const appChoice = block.getFieldValue('APP_CHOICE');  // Get the selected app or "Other"
  const isLog = block.getFieldValue('ISLOG');           // Get whether logging is enabled

  let appName = appChoice;
  if (appChoice === 'OTHER') {
    appName = JSON.stringify(block.getFieldValue('CUSTOM_APP_NAME')).slice(1, -1); // Fetch custom app name
    if (!appName) {
      appName = 'Custom App';  // Default to 'Custom App' if the field is empty
    }
  }

  // Default log content
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Open the app ${appName}`)).slice(1, -1);
  // Generate base JSON for the open app
  let
    code = `{
        "actionType": "OPEN_APP",
        "open": "${appName}",
        "isLog": ${isLog === 'TRUE' ? 'true' : 'false'},
        "logContent": ""
    }`;

  // If logging is enabled, add log content
  if (isLog === 'TRUE') {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "OPEN_APP",
        "open": "${appName}",
        "isLog": true,
        "logContent": "${logContent}"
    }`;
  }

  return code;
};
/* ==================================== OPEN APP ACTION END ==================================== */

/* ====================================== IF ACTION START ====================================== */
jsonGenerator.forBlock['if'] = function (block, generator) {
  const imageExist = JSON.stringify(block.getFieldValue(block.getFieldValue('IMAGE'))).slice(1, -1);
  const tries = block.getFieldValue('TRIES');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const trueActions = generator.statementToCode(block, 'TRUEACTIONS');
  const falseActions = generator.statementToCode(block, 'FALSEACTIONS');

  const defaultLogContent = JSON.stringify(block.getFieldValue(`Checking image existence`)).slice(1, -1);
  let code = `{
        "actionType": "IF",
        "imageExist": "${imageExist}",
        "isLog": ${isLog},
        "tries": ${tries},
        "logContent": "",
        "trueActions": [${trueActions}],
        "falseActions": [${falseActions}],
        "duration": 100
    }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "IF",
        "imageExist": "${imageExist}",
        "isLog": true,
        "tries": ${tries},
        "logContent": "${logContent}",
        "trueActions": [${trueActions}],
        "falseActions": [${falseActions}],
        "duration": 100
    }`;
  }

  return code;
};
/* ====================================== IF ACTION END ======================================== */


/* ===================================== FOR ACTION START ====================================== */
jsonGenerator.forBlock['for'] = function (block, generator) {
  const times = block.getFieldValue('TIMES');           // Number of repetitions
  const isLog = block.getFieldValue('ISLOG');
  const actions = generator.statementToCode(block, 'ACTIONS'); // Collect actions inside the loop
  // Get isLog value

  // Default log content if not specified
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Repeat ${times} times`)).slice(1, -1);
  let code = `{
        "actionType": "FOR",
        "executeActions": [${actions}], 
        "times": ${times},
        "isLog": ${isLog === 'TRUE' ? 'true' : 'false'},
        "logContent": ""
    }`;

  if (isLog === 'TRUE') {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "FOR",
        "executeActions": [${actions}], 
        "times": ${times},
        "isLog": true,
        "logContent": "${logContent}"
    }`;
  }
  return code;
};
/* ====================================== FOR ACTION END ======================================= */

/* ==================================== DELAY ACTION START ===================================== */
jsonGenerator.forBlock['delay'] = function (block) {
  const duration = block.getFieldValue('DURATION');  // Get the delay duration
  const isLog = block.getFieldValue('ISLOG');  // Get whether logging is enabled

  // Generate base JSON for the delay
  let
    code = `{
        "actionType": "DELAY",
        "isLog": ${isLog === 'TRUE' ? 'true' : 'false'}, 
        "logContent": "",
        "duration": ${duration}
    }`;

  // If logging is enabled, add log content
  if (isLog === 'TRUE') {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || 'Log Content';
    code = `{
        "actionType": "DELAY",
        "isLog": true,
        "logContent": "${logContent}",
        "duration": ${duration}
    }`;
  }

  return code;
};
/* ===================================== DELAY ACTION END ====================================== */

/* ================================= SMART CLICK ACTION START ================================== */
jsonGenerator.forBlock['click_smart'] = function (block) {
  const element = JSON.stringify(block.getFieldValue(block.getFieldValue('IMAGE'))).slice(1, -1);
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Click on ${element} for ${duration} ms`)).slice(1, -1);

  let code = `{
        "actionType": "CLICK_SMART",
        "on": "${element}",
        "isLog": ${isLog},
        "logContent": "",
        "duration": ${duration}
    }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "CLICK",
        "on": "${element}",
        "isLog": true,
        "logContent": "${logContent}",
        "duration": ${duration}
    }`;
  }

  return code;
};
/* ================================== SMART CLICK ACTION END =================================== */

/* =================================== XY CLICK ACTION START =================================== */
jsonGenerator.forBlock['click_xy'] = function (block) {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Click at (${x}, ${y}) for ${duration} ms`)).slice(1, -1);

  let code = `{
        "actionType": "CLICK_XY",
        "x": ${x},
        "y": ${y},
        "isLog": ${isLog},
        "logContent": "",
        "duration": ${duration}
    }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "CLICK_XY",
        "x": ${x},
        "y": ${y},
        "isLog": true,
        "logContent": "${logContent}",
        "duration": ${duration}
    }`;
  }

  return code;
};
/* =================================== XY CLICK ACTION END ===================================== */

/* ===================================== ZOOM ACTION START ===================================== */
jsonGenerator.forBlock['zoom'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Zoom ${direction} for ${duration} ms`)).slice(1, -1);

  let code = `{
        "actionType": "ZOOM",
        "direction": "${direction}",
        "duration": ${duration},
        "isLog": ${isLog},
        "logContent": ""
    }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
          "actionType": "ZOOM",
          "direction": "${direction}",
          "duration": ${duration},
          "isLog": true,
          "logContent": "${logContent}"
      }`;
  }

  return code;
};
/* ===================================== ZOOM ACTION END ======================================= */

/* ==================================== SWIPE ACTION START ===================================== */
jsonGenerator.forBlock['swipe'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Swipe ${direction} for ${duration} ms`)).slice(1, -1);

  let
    code = `{
        "actionType": "SWIPE",
        "direction": "${direction}",
        "duration": ${duration},
        "isLog": ${isLog},
        "logContent": ""
    }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "SWIPE",
        "direction": "${direction}",
        "duration": ${duration},
        "isLog": true,
        "logContent": "${logContent}"
    }`;
  }

  return code;
};
/* ===================================== SWIPE ACTION END ====================================== */

/* ==================================== ROTATE ACTION START ==================================== */
jsonGenerator.forBlock['rotate'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  const duration = block.getFieldValue('DURATION');
  const degrees = block.getFieldValue('DEGREES');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Rotate ${direction} for ${duration} ms by ${degrees} degrees`)).slice(1, -1);

  let code = `{
        "actionType": "ROTATE",
        "direction": "${direction}",
        "duration": ${duration},
        "degrees": ${degrees},
        "isLog": ${isLog},
        "logContent": ""
    }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
        "actionType": "ROTATE",
        "direction": "${direction}",
        "duration": ${duration},
        "degrees": ${degrees},
        "isLog": true,
        "logContent": "${logContent}"
    }`;
  }

  return code;
};
/* ===================================== ROTATE ACTION END ===================================== */

/* ==================================== PASTE ACTION START ===================================== */
jsonGenerator.forBlock['paste'] = function (block) {
  const pasteContent = JSON.stringify(block.getFieldValue(block.getFieldValue('PASTE_CONTENT'))).slice(1, -1);
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = JSON.stringify(block.getFieldValue(`Input '${pasteContent}'`)).slice(1, -1);

  let code = `{
        "actionType": "PASTE",
        "pasteContent": "${pasteContent}",
        "isLog": ${isLog},
        "logContent": ""
  }`;

  if (isLog) {
    const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || defaultLogContent;
    code = `{
          "actionType": "PASTE",
          "pasteContent": "${pasteContent}",
          "isLog": true,
          "logContent": "${logContent}"
      }`;
  }

  return code;
};
/* ===================================== PASTE ACTION END ====================================== */
jsonGenerator.forBlock['log'] = function (block) {
  const logContent = JSON.stringify(block.getFieldValue('LOGCONTENT')).slice(1, -1) || 'Enter log content';

  // Generate the JSON structure for the log action
  const code = `{
        "actionType": "LOG",
        "isLog": true,
        "logContent": "${logContent}"
    }`;

  return code;
};
/* ===================================== LOG ACTION START ====================================== */

/* ====================================== LOG ACTION END ======================================= */

jsonGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock =
    block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    // Recursively generate code for the next block in the chain
    const nextCode = jsonGenerator.blockToCode(nextBlock);
    // Concatenate the current block's code with the next block's code
    return code + ', ' + nextCode;  // This will ensure each action is separated by a comma in the JSON array
  }
  return code;
};