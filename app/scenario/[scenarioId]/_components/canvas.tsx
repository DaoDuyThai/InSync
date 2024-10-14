"use client"

export default function Canvas() {
  return (
    <div>
      <h1>Blockly Example in Next.js</h1>
      <div id="pageContainer">
        <div id="outputPane">
          <pre id="generatedCode"><code></code></pre>
          <div id="output"></div>
        </div>
        <div id="blocklyDiv"></div>
      </div>
    </div>
  );
}
