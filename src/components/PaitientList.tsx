import React, { useEffect, useState, type FormEvent } from "react";
import {
  fetchPatients,
  createPatient,
  deletePatient,
  type Patient,
  type CreatePatientPayload,
} from "../api/dorra";

const initialFormState: CreatePatientPayload = {
  first_name: "",
  last_name: "",
  gender: "Male",
  date_of_birth: "",
  phone_number: "",
  address: "",
  allergies: [],
  age: "",
};

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreatePatientPayload>(initialFormState);
  const [creating, setCreating] = useState<boolean>(false);

  // --------- Fetch patients on mount ---------
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPatients();
        setPatients(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // --------- Handlers ---------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleCreatePatient = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError(null);

      // Basic validation (frontend only)
      if (!form.first_name || !form.last_name || !form.gender) {
        setError("Please fill in first name, last name and gender.");
        return;
      }

      await createPatient(form);

      // Refetch patients to get the new one
      const updatedPatients = await fetchPatients();
      setPatients(updatedPatients);

      // Reset the form
      setForm(initialFormState);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create patient.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePatient = async (id: number) => {
    try {
      setError(null);
      await deletePatient(id);

      // Remove from list
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete patient.");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>
        MedSight – Patients
      </h1>

      {/* Status messages */}
      {loading && <p>Loading patients...</p>}
      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      {/* Create patient form */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          Create New Patient
        </h2>
        <form
          onSubmit={handleCreatePatient}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
          }}
        >
          <input
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleInputChange}
            required
          />
          <input
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleInputChange}
            required
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleInputChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="age"
            placeholder="Age (optional)"
            value={form.age || ""}
            onChange={handleInputChange}
          />
          <input
            name="date_of_birth"
            type="date"
            placeholder="Date of birth (optional)"
            value={form.date_of_birth || ""}
            onChange={handleInputChange}
          />
          <input
            name="phone_number"
            placeholder="Phone (optional)"
            value={form.phone_number || ""}
            onChange={handleInputChange}
          />
          <input
            name="address"
            placeholder="Address (optional)"
            value={form.address || ""}
            onChange={handleInputChange}
          />

          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              fontWeight: 600,
              cursor: creating ? "not-allowed" : "pointer",
              backgroundColor: creating ? "#ccc" : "#0ea5e9",
              color: "white",
            }}
          >
            {creating ? "Creating..." : "Create Patient"}
          </button>
        </form>
      </section>

      {/* Patients list */}
      <section>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          Patients ({patients.length})
        </h2>

        {patients.length === 0 && !loading && (
          <p>No patients found yet.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {patients.map((patient) => (
            <article
              key={patient.id}
              style={{
                padding: "1rem",
                borderRadius: "0.75rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
                {patient.full_name || `${patient.first_name} ${patient.last_name}`}
              </h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                ID: {patient.unique_id || patient.id}
              </p>
              <p style={{ margin: "0.25rem 0 0" }}>
                {patient.age && `Age: ${patient.age} • `}{patient.gender}
              </p>
              {patient.phone_number && (
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
                  📞 {patient.phone_number}
                </p>
              )}
              {patient.address && (
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
                  📍 {patient.address}
                </p>
              )}
              <button
                onClick={() => handleDeletePatient(patient.id)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #ef4444",
                  backgroundColor: "white",
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PatientsPage;