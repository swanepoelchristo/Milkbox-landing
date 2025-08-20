"use client";
import { useState } from "react";

export default function CVForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    skills: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">✅ CV Submitted!</h1>
        <p>Thank you. You can view your formatted CV <a href="/cv/thanks">here</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">CV Builder</h1>

      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded"/>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded"/>
      <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded"/>

      <textarea name="experience" placeholder="Work Experience" onChange={handleChange} rows={4} className="w-full p-2 border rounded"></textarea>
      <textarea name="education" placeholder="Education" onChange={handleChange} rows={3} className="w-full p-2 border rounded"></textarea>
      <textarea name="skills" placeholder="Skills" onChange={handleChange} rows={2} className="w-full p-2 border rounded"></textarea>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
