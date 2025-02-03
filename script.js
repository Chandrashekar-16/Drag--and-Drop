
let draggedBox = null;
let sourceCell = null;

const tableBody = document.querySelector('table tbody');
const addRowBtn = document.getElementById('addRowBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

let actionStack = [];
let redoStack = [];
let boxNumber = 900;
const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#a133ff', '#33f0ff', '#ffd433', '#ff8f33', '#75ff33'];

// Command Pattern setup
class Command {
  execute() {}
  undo() {}
  redo() {}
}

class AddRowCommand extends Command {
  constructor() {
    super();
    this.rowElement = null;
  }

  execute() {
    this.rowElement = document.createElement('tr');
    for (let i = 0; i < 3; i++) {
      const cell = document.createElement('td');
      const box = document.createElement('div');
      boxNumber += 100;
      box.textContent =boxNumber;
      box.classList.add('box');
      box.style.backgroundColor = colors[boxNumber % colors.length];
      box.setAttribute('draggable', 'true');
      cell.appendChild(box);
      this.rowElement.appendChild(cell);
    }

    tableBody.appendChild(this.rowElement);

    // Apply transition effect
    setTimeout(() => {
      this.rowElement.style.transition = 'opacity 0.5s ease';
      this.rowElement.style.opacity = '1';
    }, 0);

    registerDragEvents();
  }

  undo() {
    if (this.rowElement) {
      // Apply smooth transition when removing
      this.rowElement.style.transition = 'opacity 0.3s ease';
      this.rowElement.style.opacity = '0';
      setTimeout(() => {
        tableBody.removeChild(this.rowElement);
      }, 20);
    }
  }

  redo() {
    tableBody.appendChild(this.rowElement);

    // Apply smooth transition on redo
    setTimeout(() => {
      this.rowElement.style.transition = 'opacity 0.3s ease';
      this.rowElement.style.opacity = '1';
    }, 0);

    registerDragEvents();
  }
}

class SwapingCommand extends Command {
  constructor(sourceCell, targetCell) {
    super();
    this.sourceCell = sourceCell;
    this.targetCell = targetCell;
    this.sourceBoxValue = sourceCell.querySelector('.box').textContent;
    this.targetBoxValue = targetCell.querySelector('.box').textContent;
  }
// for swapping of values
  execute() {
    this.swapValues();
  }

  undo() {
    this.swapValues(); 
  }

  redo() {
    this.swapValues(); 
  }

  swapValues() {
    const sourceBox = this.sourceCell.querySelector('.box');
    const destinationBox = this.targetCell.querySelector('.box');
 //smooth transition by adding animation to boxes
    if (sourceBox && destinationBox) {
     
      sourceBox.style.transition = 'transform 1.2s ease';
      destinationBox.style.transition = 'transform 1.2s ease';

      const tempValue = sourceBox.textContent;
      sourceBox.textContent = destinationBox.textContent;
      destinationBox.textContent = tempValue;

      // Swapping of colors
      const tempColor = sourceBox.style.backgroundColor;
      sourceBox.style.backgroundColor = destinationBox.style.backgroundColor;
      destinationBox.style.backgroundColor = tempColor;
    }
  }
}

function executeCommand(command) {
  command.execute();
  actionStack.push(command);
  redoStack = [];
}

function registerDragEvents() {
  document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('dragstart', event => {
      draggedBox = event.target;
      sourceCell = draggedBox.parentElement;
      setTimeout(() => {
        draggedBox.style.visibility = 'hidden'; 
      }, 0);
    });

    box.addEventListener('dragend', () => {
      setTimeout(() => {
        draggedBox.style.visibility = 'visible'; 
        draggedBox = null;
        sourceCell = null;
      }, 0);
    });
  });

  document.querySelectorAll('td').forEach(cell => {
    cell.addEventListener('dragover', event => {
      event.preventDefault();
    });

    cell.addEventListener('drop', event => {
      event.preventDefault();
      const targetCell = event.target.tagName === 'TD' ? event.target : event.target.parentElement;

      if (draggedBox && targetCell !== sourceCell) {
        const destinationBox = targetCell.querySelector('.box');

        if (destinationBox) {
          // smooth transition when moving the objectss
          const command = new SwapingCommand(sourceCell, targetCell);
          executeCommand(command);

          // transition effect after swap has done 
          destinationBox.style.transition = 'transform 2.5s ease';
          draggedBox.style.transition = 'transform 2.5s ease';
        }
      }
    });
  });
}

// handling buttons when we click
addRowBtn.addEventListener('click', () => {
  executeCommand(new AddRowCommand());
});

undoBtn.addEventListener('click', () => {
  if (actionStack.length > 0) {
    const command = actionStack.pop();
    command.undo();
    redoStack.push(command);
  }
});

redoBtn.addEventListener('click', () => {
  if (redoStack.length > 0) {
    const command = redoStack.pop();
    command.redo();
    actionStack.push(command);
  }
});


registerDragEvents();
