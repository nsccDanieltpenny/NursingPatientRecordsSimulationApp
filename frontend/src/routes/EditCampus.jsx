import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function EditCampus() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campusInfo, setCampusInfo] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [loading, setLoading] = useState(null);

    // Load campus info on mount
    useEffect(() => {

        const fetchCampus = async () => {
            try {
                const campusRes = await axios.get(`/api/campus/${id}`);
                const campusData = campusRes.data;
                console.log(campusData)

                setCampusInfo(campusData);

                setEditForm({
                    campusId: campusData.campusId,
                    name: campusData.name,
                    address: campusData.address
                });

            } catch (err) {
                console.error("Error loading class:", err);
            } finally {
                setLoading(false);
            }
            };

        fetchCampus();
    }, [id]);

    if (loading) return <div>Loading campus...</div>;
    if (!campusInfo) return <div>Campus not found.</div>;

  // Update handler
    const handleSave = async () => {

        const payload = {
            campusId: editForm.campusId,
            name: editForm.name,
            address: editForm.address
        };

        try {
            console.log("payload : ", payload)
            await axios.put(`/api/campus/${payload.campusId}`, payload);
            navigate(`/admin/campuses`);
        } catch (err) {
            console.error("Error updating campus:", err);
            if (err.response) {
                console.log("Backend error:", err.response.data);
            }

        }

    };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit {campusInfo.name}
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
          label="Address"
          fullWidth
          margin="normal"
          value={editForm?.address}
          onChange={(e) =>
            setEditForm({ ...editForm, address: e.target.value })
          }
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