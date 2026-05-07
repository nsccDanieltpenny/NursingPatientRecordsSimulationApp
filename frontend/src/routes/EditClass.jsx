import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function EditClass() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [loading, setLoading] = useState(null);

    // Load class info on mount
    useEffect(() => {
        const fetchClass = async () => {
        try {
            const classRes = await axios.get(`/api/classes/${id}`);
            const classData = classRes.data;
            console.log(classData)

            // fetch instructor
            const instructorRes = await axios.get(`/api/Instructor/${classData.instructorId}`);
            console.log("instructor info: ", instructorRes.data)
            setClassInfo(classData);
            setEditForm({
            ...classData,
            instructor: instructorRes.data
            });

        } catch (err) {
            console.error("Error loading class:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchClass();
    }, [id]);

    if (loading) return <div>Loading class...</div>;
    if (!classInfo) return <div>Class not found.</div>;

  // Update handler
    const handleSave = async () => {
        const payload = {
            ...editForm,
            instructor: editForm.instructor, // full nurse object
        };


        try {
            console.log(payload)
            await axios.put(`/api/classes/${payload.classId}`, payload);
            navigate(`/admin`);
        } catch (err) {
            console.error("Error updating class:", err);
            if (err.response) {
                console.log("Backend error:", err.response.data);
            }

        }

    };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit {classInfo.name}
        </Typography>

        {/* Editable fields */}
        <TextField
          label="Class Name"
          fullWidth
          margin="normal"
          value={editForm?.name}
          onChange={(e) =>
            setEditForm({ ...editForm, name: e.target.value })
          }
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={editForm?.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
        />

        <TextField
          label="Start Date"
          type="date"
          fullWidth
          margin="normal"
          value={editForm?.startDate}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="End Date"
          type="date"
          fullWidth
          margin="normal"
          value={classInfo.endDate}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
        />

        {/* Read‑only fields */}
        <TextField
          label="Join Code"
          fullWidth
          margin="normal"
          value={editForm.joinCode}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Class ID"
          fullWidth
          margin="normal"
          value={editForm.classId}
          InputProps={{ readOnly: true }}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Paper>
    </Box>
  );



}