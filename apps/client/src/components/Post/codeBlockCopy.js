function addCopyButtons() {
  const codeBlocks = document.querySelectorAll(".md-content pre");

  codeBlocks.forEach((codeBlock, index) => {
    const container = document.createElement("div");
    container.className = "code-block-container";
    codeBlock.parentNode.insertBefore(container, codeBlock);
    container.appendChild(codeBlock);

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.className = "copy-button";
    container.appendChild(copyButton);

    copyButton.addEventListener("click", () => {
      const code = codeBlock.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    });
  });
}

document.addEventListener("DOMContentLoaded", addCopyButtons);
