const canvas = new fabric.Canvas("canvas");
const colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
];

function changeTab(tab) {
  const tabContent = document.getElementById("tabContent");
  let content = "";

  switch (tab) {
    case "elements":
      content = `
                <h2 class="text-lg font-semibold mb-4">Elements</h2>
                <div class="grid grid-cols-3 gap-2">
                    <div class="w-20 h-20 bg-gray-300 flex items-center justify-center cursor-pointer" onclick="addShape('rect')">
                        <div class="w-16 h-16 bg-white"></div>
                    </div>
                    <div class="w-20 h-20 bg-gray-300 flex items-center justify-center cursor-pointer" onclick="addShape('circle')">
                        <div class="w-16 h-16 bg-white rounded-full"></div>
                    </div>
                    <div class="w-20 h-20 bg-gray-300 flex items-center justify-center cursor-pointer" onclick="addShape('triangle')">
                        <div class="w-0 h-0 border-l-[28px] border-r-[28px] border-b-[48px] border-l-transparent border-r-transparent border-b-white"></div>
                    </div>
                    <div class="w-20 h-20 bg-gray-300 flex items-center justify-center cursor-pointer" onclick="addShape('hexagon')">
                        <div class="w-16 h-14 bg-white" style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);"></div>
                    </div>
                    <div class="w-20 h-20 bg-gray-300 flex items-center justify-center cursor-pointer" onclick="addShape('star')">
                        <div class="w-16 h-16 bg-white" style="clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);"></div>
                    </div>
                    <div class="w-20 h-20 bg-gray-300 flex items-center justify-center cursor-pointer" onclick="addShape('flower')">
                        <div class="w-16 h-16 bg-white" style="clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%);"></div>
                    </div>
                </div>
            `;
      break;
    case "background":
      content = `
                <h2 class="text-lg font-semibold mb-4">Background Color</h2>
                <div class="grid grid-cols-5 gap-2">
                    ${colors
                      .map(
                        (color) => `
                        <div class="w-8 h-8 rounded cursor-pointer" style="background-color: ${color};" onclick="setBackgroundColor('${color}')"></div>
                    `
                      )
                      .join("")}
                </div>
            `;
      break;
    case "text":
      content = `
                <h2 class="text-xl font-bold mb-4">Add Text</h2>
                <div class="space-y-2">
                    <div class="cursor-pointer p-2 rounded bg-gray-100" onclick="addText('h1')">
                        <h3 class="font-semibold">Add H1</h3>
                    </div>
                    <div class="cursor-pointer p-2 rounded bg-gray-100" onclick="addText('h6')">
                        <h4>Add H6</h4>
                    </div>
                    <div class="cursor-pointer p-2 rounded bg-gray-100" onclick="addText('p')">
                        <p>Add Paragraph</p>
                    </div>
                </div>
            `;
      break;
    case "images":
      content = `
                <h2 class="text-xl font-bold mb-4">Select an Image</h2>
                <div id="imageList" class="space-y-2">
                    Loading images...
                </div>
            `;
      loadImages();
      break;
  }

  tabContent.innerHTML = content;
}

function loadImages() {
  fetch("https://picsum.photos/v2/list?limit=10")
    .then((response) => response.json())
    .then((data) => {
      const imageList = document.getElementById("imageList");
      imageList.innerHTML = "";
      data.forEach((image) => {
        const img = document.createElement("img");
        img.src = image.download_url;
        img.alt = image.author;
        img.className = "w-full h-32 object-cover mb-2 cursor-pointer";
        img.onclick = () => addImageToCanvas(image.download_url);
        imageList.appendChild(img);
      });
    })
    .catch((error) => console.error("Error loading images:", error));
}

function setBackgroundColor(color) {
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
}

function addText(type) {
  let text, fontSize;
  switch (type) {
    case "h1":
      text = "Heading 1";
      fontSize = 32;
      break;
    case "h6":
      text = "Heading 6";
      fontSize = 18;
      break;
    case "p":
      text = "Paragraph text";
      fontSize = 16;
      break;
  }

  const textObject = new fabric.IText(text, {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fontSize: fontSize,
    originX: "center",
    originY: "center",
  });

  canvas.add(textObject);
  canvas.setActiveObject(textObject);
  canvas.renderAll();
}

function addImageToCanvas(imageUrl) {
  fabric.Image.fromURL(imageUrl, (img) => {
    img.scaleToWidth(200);
    img.set({
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: "center",
      originY: "center",
    });
    canvas.add(img);
    canvas.renderAll();
  });
}

function addShape(shape) {
  let fabricObject;
  const commonProps = {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fill: "gray",
    originX: "center",
    originY: "center",
  };

  switch (shape) {
    case "rect":
      fabricObject = new fabric.Rect({
        ...commonProps,
        width: 100,
        height: 100,
      });
      break;
    case "circle":
      fabricObject = new fabric.Circle({
        ...commonProps,
        radius: 50,
      });
      break;
    case "triangle":
      fabricObject = new fabric.Triangle({
        ...commonProps,
        width: 100,
        height: 100,
      });
      break;
    case "hexagon":
      fabricObject = new fabric.Polygon(
        [
          { x: 25, y: 0 },
          { x: 75, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
          { x: 0, y: 50 },
        ],
        {
          ...commonProps,
          width: 100,
          height: 100,
        }
      );
      break;
    case "star":
      fabricObject = new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 61, y: 35 },
          { x: 98, y: 35 },
          { x: 68, y: 57 },
          { x: 79, y: 91 },
          { x: 50, y: 70 },
          { x: 21, y: 91 },
          { x: 32, y: 57 },
          { x: 2, y: 35 },
          { x: 39, y: 35 },
        ],
        {
          ...commonProps,
          width: 100,
          height: 100,
        }
      );
      break;
    case "flower":
      fabricObject = new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 80, y: 10 },
          { x: 100, y: 35 },
          { x: 100, y: 70 },
          { x: 80, y: 90 },
          { x: 50, y: 100 },
          { x: 20, y: 90 },
          { x: 0, y: 70 },
          { x: 0, y: 35 },
          { x: 20, y: 10 },
        ],
        {
          ...commonProps,
          width: 100,
          height: 100,
        }
      );
      break;
  }

  if (fabricObject) {
    canvas.add(fabricObject);
    canvas.setActiveObject(fabricObject);
    canvas.renderAll();
  }
}

function deleteSelectedElement() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
    canvas.renderAll();
    document.getElementById("deleteBtn").classList.add("hidden");
  }
}

// Modify the existing event listeners section
document
  .getElementById("elementsTab")
  .addEventListener("click", () => changeTab("elements"));
document
  .getElementById("backgroundTab")
  .addEventListener("click", () => changeTab("background"));
document
  .getElementById("textTab")
  .addEventListener("click", () => changeTab("text"));
document
  .getElementById("imagesTab")
  .addEventListener("click", () => changeTab("images"));

document.getElementById("downloadBtn").addEventListener("click", () => {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
  });
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document
  .getElementById("deleteBtn")
  .addEventListener("click", deleteSelectedElement);

changeTab("background");

canvas.on("selection:created", function (e) {
  document.getElementById("deleteBtn").classList.remove("hidden");
  if (e.target && e.target.type === "i-text") {
    const fontSize = e.target.fontSize;
    const deleteIcon = document.createElement("div");
    deleteIcon.innerHTML = "🗑️";
    deleteIcon.className = "delete-btn";
    deleteIcon.style.position = "absolute";
    deleteIcon.style.right = "10px";
    deleteIcon.style.top = "10px";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.onclick = function () {
      canvas.remove(e.target);
      canvas.renderAll();
    };

    const fontSizeSelect = document.createElement("select");
    fontSizeSelect.className = "font-size-select";
    fontSizeSelect.style.position = "absolute";
    fontSizeSelect.style.left = "10px";
    fontSizeSelect.style.top = "10px";
    for (let i = 8; i <= 72; i += 2) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      if (i === fontSize) option.selected = true;
      fontSizeSelect.appendChild(option);
    }
    fontSizeSelect.onchange = function () {
      e.target.set("fontSize", parseInt(this.value, 10));
      canvas.renderAll();
    };

    document.body.appendChild(deleteIcon);
    document.body.appendChild(fontSizeSelect);
  }
});

canvas.on("selection:cleared", function () {
  document.getElementById("deleteBtn").classList.add("hidden");
  const deleteBtn = document.querySelector(".delete-btn");
  const fontSizeSelect = document.querySelector(".font-size-select");
  if (deleteBtn) deleteBtn.remove();
  if (fontSizeSelect) fontSizeSelect.remove();
});

canvas.on("selection:updated", function () {
  document.getElementById("deleteBtn").classList.remove("hidden");
});
