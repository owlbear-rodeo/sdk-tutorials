import OBR, { buildLine } from "@owlbear-rodeo/sdk";

const ID = "com.tutorial.custom-tool";

function createTool() {
  OBR.tool.create({
    id: `${ID}/tool`,
    icons: [
      {
        icon: "/line.svg",
        label: "Custom Tool",
      },
    ],
    defaultMetadata: {
      strokeColor: "red",
    },
  });
}

function createMode() {
  let interaction = null;
  OBR.tool.createMode({
    id: `${ID}/mode`,
    icons: [
      {
        icon: "/line.svg",
        label: "Line",
        filter: {
          activeTools: [`${ID}/tool`],
        },
      },
    ],
    async onToolDragStart(context, event) {
      // Get the stroke color from the tools metadata
      let strokeColor = "red";
      if (typeof context.metadata.strokeColor === "string") {
        strokeColor = context.metadata.strokeColor;
      }
      // Build a line with the start and end position of our pointer
      const line = buildLine()
        .startPosition(event.pointerPosition)
        .endPosition(event.pointerPosition)
        .strokeColor(strokeColor)
        .build();
      // Start an interaction with the new line
      interaction = await OBR.interaction.startItemInteraction(line);
    },
    onToolDragMove(_, event) {
      // Update the end position of the interaction when the tool drags
      if (interaction) {
        const [update] = interaction;
        update((line) => {
          line.endPosition = event.pointerPosition;
        });
      }
    },
    onToolDragEnd(_, event) {
      if (interaction) {
        const [update, stop] = interaction;
        // Perform a final update when the drag ends
        // This gets us the final line item
        const line = update((line) => {
          line.endPosition = event.pointerPosition;
        });
        // Add the line to the scene
        OBR.scene.items.addItems([line]);
        // Make sure we stop the interaction so others
        // can interact with our new line
        stop();
      }
      interaction = null;
    },
    onToolDragCancel() {
      // Stop the interaction early if we cancel the drag
      // This can happen if the user presses `esc` in the middle
      // of a drag operation
      if (interaction) {
        const [_, stop] = interaction;
        stop();
      }
      interaction = null;
    },
  });
}

function createAction() {
  OBR.tool.createAction({
    id: `${ID}/action`,
    icons: [
      {
        icon: "/icon.svg",
        label: "Color",
        filter: {
          activeTools: [`${ID}/tool`],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/color-picker`,
        height: 40,
        width: 80,
        url: "/color-picker.html",
        anchorElementId: elementId,
        anchorOrigin: {
          horizontal: "CENTER",
          vertical: "BOTTOM",
        },
        transformOrigin: {
          horizontal: "CENTER",
          vertical: "TOP",
        },
      });
    },
  });
}

OBR.onReady(() => {
  createTool();
  createMode();
  createAction();
});
