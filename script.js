// Variables
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const formButton = document.querySelector('.btn');
const clearButton = document.getElementById('clear');
const filterInput = document.getElementById('filter');
let isEditMode = false;

function displayItems() {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach(item => {
    addItemToDOM(item);
  });

  setUI();
}

function onSubmit(e) {
  e.preventDefault();

  // Getting the new item value
  const newItem = itemInput.value.trim();

  // Making sure the user has intered an item
  if (newItem === '') {
    alert('Please Enter an Item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else if (isExisting(newItem)) {
    alert('That item already exists!');
    return;
  }

  addItemToDOM(newItem);
  addItemToLocalStorage(newItem);
  itemInput.value = '';
  setUI();
}

function addItemToDOM(item) {
  // Creating the newItem element and appending it to the itemList
  const li = document.createElement('li');

  li.appendChild(document.createTextNode(item));
  li.appendChild(createButton('remove-item btn-link text-red'));
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');

  button.className = classes;
  button.appendChild(createIcon('fa-solid fa-xmark'));
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');

  icon.className = classes;
  return icon;
}

function addItemToLocalStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // add item to the array and update localStorage
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (!localStorage.getItem('items')) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onItemClick(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
    setUI();
  } else if (e.target.tagName === 'LI') {
    setToEdit(e.target);
  }
}

function isExisting(item) {
  let itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formButton.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formButton.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  // Remove the item from the DOM
  item.remove();
  // Remove the item from localStorage
  let itemName = item.innerText;
  removeItemFromStorage(itemName);
}

function removeItemFromStorage(item) {
  // Filter out the item to be removed
  let itemsFromStorage = getItemsFromStorage().filter(name => name !== item);
  // Update localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Clear all items
function clearItems() {
  // clearing the DOM
  while (itemList.firstElementChild) {
    itemList.firstElementChild.remove();
  }
  // clearing localStorage
  localStorage.removeItem('items');
  setUI();
}

function filterItems(e) {
  const items = document.querySelectorAll('li');
  const value = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.innerText.toLowerCase();

    if (itemName.includes(value)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function setUI() {
  if (itemList.firstElementChild) {
    clearButton.style.display = 'block';
    filterInput.style.display = 'block';
  } else {
    clearButton.style.display = 'none';
    filterInput.style.display = 'none';
  }

  formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formButton.style.backgroundColor = '#333';

  isEditMode = false;
}

function init() {
  setUI();

  // Event Listeners
  itemForm.addEventListener('submit', onSubmit);
  itemList.addEventListener('click', onItemClick);
  clearButton.addEventListener('click', clearItems);
  filterInput.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
}

init();
