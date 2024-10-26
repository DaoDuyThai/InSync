import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');

jsonGenerator.forBlock['scenario'] = function (block, generator) {
  const actions = generator.statementToCode(block, 'ACTIONS');  // Get the actions inside
  const code = `
  [
    {
      "actionType": "DELAY",
      "isLog": false,
      "logContent": "",
      "duration": 1000
    },
    ${actions},
    {
        "actionType": "END_RUN"
    }
  ]`;
  return code;
};

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
    const logContent = block.getFieldValue('LOGCONTENT') || 'Log Content';
    code = `{
    "actionType": "DELAY",
    "isLog": true,
    "logContent": "${logContent}",
    "duration": ${duration}
  }`;
  }

  return code;
};

jsonGenerator.forBlock['click'] = function (block) {
  const element = block.getFieldValue('ON');
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = `Click on ${element} for ${duration} ms`;

  let code = `
  {
    "actionType": "CLICK",
    "on": "${element}",
    "isLog": ${isLog},
    "logContent": "",
    "duration": ${duration}
  }`;

  if (isLog) {
    const logContent = block.getFieldValue('LOGCONTENT') || defaultLogContent;
    code = `
  {
    "actionType": "CLICK",
    "on": "${element}",
    "isLog": true,
    "logContent": "${logContent}",
    "duration": ${duration}
  }`;
  }

  return code;
};

jsonGenerator.forBlock['open_app'] = function (block) {
  const appChoice = block.getFieldValue('APP_CHOICE');  // Get the selected app or "Other"
  const isLog = block.getFieldValue('ISLOG');           // Get whether logging is enabled

  let appName = appChoice;
  if (appChoice === 'OTHER') {
    appName = block.getFieldValue('CUSTOM_APP_NAME'); // Fetch custom app name
    if (!appName) {
      appName = 'Custom App';  // Default to 'Custom App' if the field is empty
    }
  }

  // Default log content
  const defaultLogContent = `Open the app ${appName}`;
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
    const logContent = block.getFieldValue('LOGCONTENT') || defaultLogContent;
    code = `{
    "actionType": "OPEN_APP",
    "open": "${appName}",
    "isLog": true,
    "logContent": "${logContent}"
  }`;
  }

  return code;
};


jsonGenerator.forBlock['for'] = function (block, generator) {
  const times = block.getFieldValue('TIMES');           // Number of repetitions
  const isLog = block.getFieldValue('ISLOG');
  const actions = generator.statementToCode(block, 'ACTIONS'); // Collect actions inside the loop
  // Get isLog value

  // Default log content if not specified
  const defaultLogContent = `Repeat ${times} times`;
  let code = `
  {
    "actionType": "FOR",
    "executeActions": [${actions}], 
    "times": ${times},
    "isLog": ${isLog === 'TRUE' ? 'true' : 'false'},
    "logContent": ""
  }`;

  if (isLog === 'TRUE') {
    const logContent = block.getFieldValue('LOGCONTENT') || defaultLogContent;
    code = `
  {
    "actionType": "FOR",
    "executeActions": [${actions}], 
    "times": ${times},
    "isLog": true,
    "logContent": "${logContent}"
  }`;
  }
  return code;
};


jsonGenerator.forBlock['zoom'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = `Zoom ${direction} for ${duration} ms`;

  let code = `{
    "actionType": "ZOOM",
    "direction": "${direction}",
    "duration": ${duration},
    "isLog": ${isLog},
    "logContent": ""
  }`;

  if (isLog) {
    const logContent = block.getFieldValue('LOGCONTENT') || defaultLogContent;
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

jsonGenerator.forBlock['swipe'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  const duration = block.getFieldValue('DURATION');
  const isLog = block.getFieldValue('ISLOG') === 'TRUE';
  const defaultLogContent = `Swipe ${direction} for ${duration} ms`;

  let
    code = `
  {
    "actionType": "SWIPE",
    "direction": "${direction}",
    "duration": ${duration},
    "isLog": ${isLog},
    "logContent": ""
  }`;

  if (isLog) {
    const logContent = block.getFieldValue('LOGCONTENT') || defaultLogContent;
    code = `
  {
    "actionType": "SWIPE",
    "direction": "${direction}",
    "duration": ${duration},
    "isLog": true,
    "logContent": "${logContent}"
  }`;
  }

  return code;
};



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