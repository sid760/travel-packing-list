import { useState } from "react";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [items, setItems] = useState([]);
  const notify = () => toast.error("The list is already empty!");

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleRemoveItems(itemId) {
    setItems((items) => items.filter((item) => item.id !== itemId));
  }

  function handleSelectItem(itemId) {
    setItems((item) =>
      items.map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    if (items.length === 0) {
      notify(); // if the list is empty show a toast
    } else {
      // if the list is not empty, show a confirm dialog
      let clear = window.confirm("Are you sure you want to clear the list?");
      if (clear) setItems((items) => []);
    }
  }

  return (
    <div className="app">
      {/* breaking down the app into smaller components: Logo, Form, PackingList, Stats */}
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onRemoveItem={handleRemoveItems}
        onSelectItem={handleSelectItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

// Logo component
function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}

// Form component
function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (description.length === 0) return; // if the input is empty, do nothing
    const newItem = {
      // create a new item
      description,
      quantity,
      id: Date.now(),
      packed: false,
    };

    onAddItems(newItem); // call the onAddItems function from the parent component
    setDescription(""); // reset the input
    setQuantity(1); // reset the quantity
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip? ✈️</h3>
      <select onChange={(e) => setQuantity(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item.."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button>Add</button>
    </form>
  );
}

// PackingList component
function PackingList({ items, onRemoveItem, onSelectItem, onClearList }) {
  const [sortBy, setSortBy] = useState("packed");

  let sortedItems;
  // sort the items based on the selected option
  if (sortBy === "input") sortedItems = items;
  // if the user selects "input", keep the items in the order they were added
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  // if the user selects "description", sort the items by description
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onRemoveItem={onRemoveItem}
            onSelectItem={onSelectItem}
          />
        ))}
      </ul>

      {/* the toast message when the list is already empty and user clears the list */}
      <ToastContainer
        type="warning"
        autoClose={4000}
        position="bottom-right"
        hideProgressBar={true}
        className="toast"
      />
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={() => onClearList()}>Clear List</button>
      </div>
    </div>
  );
}

// Stats component
function Stats({ items }) {
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );
  }

  return (
    <footer className="stats">
      {numPacked === numItems ? (
        <b style={{ textTransform: "uppercase" }}>
          🎉You have packed all the items, You are ready to roll! ✅
        </b>
      ) : (
        <em>
          🧳You have {numItems} items on your list, and you already packed{" "}
          {numPacked} ({((numPacked * 100) / numItems).toPrecision(3)}%)
        </em>
      )}
    </footer>
  );
}

// Item sub-component
function Item({ item, onRemoveItem, onSelectItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onSelectItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}{" "}
      </span>
      <button onClick={() => onRemoveItem(item.id)}>❌</button>
    </li>
  );
}
