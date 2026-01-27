import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/onboarding");
      return;
    }

    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, ...form })
    );

    alert("User details updated");
    navigate("/settings");
  };

  return (
    <div className="container py-4" style={{ maxWidth: "420px" }}>
      <div className="card p-4">
        <h4 className="mb-3">User Details</h4>

        <input
          className="form-control mb-2"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          className="form-control mb-2"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          className="form-control mb-3"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <button className="btn btn-primary w-100" onClick={save}>
          Save
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
