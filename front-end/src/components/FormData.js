import React from "react";

export default function FormData() {
  return (
    <div className="container">
      <form action="http://localhost:5000/api/upload" method="POST">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
