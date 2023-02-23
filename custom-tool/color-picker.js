import OBR from "@owlbear-rodeo/sdk";

const ID = "com.tutorial.custom-tool";

const colors = ["red", "green", "blue"];

/** Create the select element */
function createSelect(defaultValue) {
  document.querySelector("#app").innerHTML = `
    <div>
      <select name="colors" id="colors">
        ${
          // Map colors and apply selected option to the default value
          colors
            .map((color) => {
              const selected = color === defaultValue;
              return `<option value="${color}" ${
                selected ? "selected" : ""
              }>${color}</option>`;
            })
            .join("")
        }
      </select>
    </div>
  `;
}

/** Setup a listener to the selects `change` event */
function setupSelect(element) {
  const updateColor = (event) => {
    const color = event.target.value;
    OBR.tool.setMetadata(`${ID}/tool`, { strokeColor: color });
  };
  element.addEventListener("change", updateColor);
}

OBR.onReady(async () => {
  // Get the current stroke color as the default value for the select
  const metadata = await OBR.tool.getMetadata(`${ID}/tool`);
  let strokeColor = "red";
  if (typeof metadata.strokeColor === "string") {
    strokeColor = metadata.strokeColor;
  }
  createSelect(strokeColor);
  setupSelect(document.querySelector("#colors"));
});
