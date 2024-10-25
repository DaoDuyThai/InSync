import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');

const Order = {
  ATOMIC: 0,
};


jsonGenerator.forBlock['logic_null'] = function (block) {
  return ['null', Order.ATOMIC];
};

jsonGenerator.forBlock['text'] = function (block) {
  const textValue = block.getFieldValue('TEXT');
  const code = `"${textValue}"`;
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['math_number'] = function (block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['logic_boolean'] = function (block) {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['member'] = function (block, generator) {
  const name = block.getFieldValue('MEMBER_NAME');
  const value = generator.valueToCode(
    block, 'MEMBER_VALUE', Order.ATOMIC);
  const code = `"${name}": ${value}`;
  return code;
};

jsonGenerator.forBlock['lists_create_with'] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.inputList.length; i++) {
    const valueCode = generator.valueToCode(block, 'ADD' + i,
      Order.ATOMIC);
    if (valueCode) {
      values.push(valueCode);
    }
  }
  const valueString = values.join(',\n');
  const indentedValueString =
    generator.prefixLines(valueString, generator.INDENT);
  const codeString = '[\n' + indentedValueString + '\n]';
  return [codeString, Order.ATOMIC];
};

jsonGenerator.forBlock['object'] = function (block, generator) {
  const statementMembers =
    generator.statementToCode(block, 'MEMBERS');
  const code = '{\n' + statementMembers + '\n}';
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['scenario'] = function (block, generator) {
  const actions = generator.statementToCode(block, 'ACTIONS');  // Get the actions inside
  const code = `[
    ${actions}
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
  const on = block.getFieldValue('ON');
  const code = `{
    "actionType": "CLICK",
    "on": "${on}",
    "logResult": true,
    "duration": 100,
    "tries": 1
  }`;
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


jsonGenerator.forBlock['for_block'] = function (block, generator) {
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
  const code = `{
    "actionType": "ZOOM",
    "on": "${direction}",
    "logResult": true,
    "duration": 100,
    "tries": 1
  }`;
  return code;
};

jsonGenerator.forBlock['swipe'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  const code = `{
    "actionType": "SWIPE",
    "on": "${direction}",
    "logResult": true,
    "duration": 500,
    "tries": 1
  }`;
  return code;
};

jsonGenerator.forBlock['end_run'] = function () {
  const code = `{
    "actionType": "END_RUN",
    "on": "",
    "logResult": true,
    "duration": 100,
    "tries": 1
  }`;
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