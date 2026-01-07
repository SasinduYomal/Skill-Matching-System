import React, { useState } from "react";
import PersonnelList from "../components/personnel/PersonnelList";
import PersonnelForm from "../components/personnel/PersonnelForm";
import personnelApi from "../api/personnelApi";
import toast from "react-hot-toast";

const PersonnelPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmit = async (data) => {
    try {
      if (editingPersonnel) {
        await personnelApi.update(editingPersonnel.id, data);
        toast.success("Personnel updated");
      } else {
        await personnelApi.create(data);
        toast.success("Personnel created");
      }
      setRefreshTrigger(p => p + 1);
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-6">
      <PersonnelList
        onAdd={() => {
          setEditingPersonnel(null);
          setShowForm(true);
        }}
        onEdit={(p) => {
          setEditingPersonnel(p);
          setShowForm(true);
        }}
        refreshTrigger={refreshTrigger}
      />

      {showForm && (
        <PersonnelForm
          personnel={editingPersonnel}
          onClose={() => {
            setShowForm(false);
            setEditingPersonnel(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default PersonnelPage;
