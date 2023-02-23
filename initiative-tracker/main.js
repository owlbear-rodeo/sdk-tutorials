import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";
import { setupInitiativeList } from "./initiativeList";

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Initiative Tracker</h1>
    <ul id="initiative-list"></ul>
  </div>
`;

OBR.onReady(() => {
  setupContextMenu();
  setupInitiativeList(document.querySelector("#initiative-list"));
});
