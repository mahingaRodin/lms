import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import MapDrawer from "../components/MapDrawer";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
  parcelNumber: Yup.string().required('Parcel number is required'),
  areaHectares: Yup.number()
    .positive('Must be positive')
    .required('Area is required'),
  boundary: Yup.object()
    .shape({
      type: Yup.string().oneOf(['Polygon']).required(),
      coordinates: Yup.array()
        .of(
          Yup.array()
            .of(Yup.array().of(Yup.number().required()).length(2))
            .min(4)
        )
        .required(),
    })
    .test(
      'is-valid-polygon',
      'Invalid polygon',
      (value: any) => {
        if (!value || value.type !== 'Polygon' || !value.coordinates) return false;
        const coords = value.coordinates[0];
        return (
          coords.length >= 4 &&
          coords[0][0] === coords[coords.length - 1][0] &&
          coords[0][1] === coords[coords.length - 1][1]
        );
      },
    ),
});

export default function RegisterLandPage() {
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      parcelNumber: '',
      areaHectares: 0,
      boundary: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3000/land-plots/register', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess(true);
        formik.resetForm();
      } catch (error) {
        formik.setStatus('Registration failed');
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Register New Land Plot
      </Typography>

      {success && (
        <Typography color="success.main" gutterBottom>
          Land plot registered successfully!
        </Typography>
      )}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="parcelNumber"
          name="parcelNumber"
          label="Parcel Number"
          value={formik.values.parcelNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.parcelNumber && Boolean(formik.errors.parcelNumber)
          }
          helperText={formik.touched.parcelNumber && formik.errors.parcelNumber}
          margin="normal"
        />

        <TextField
          fullWidth
          id="areaHectares"
          name="areaHectares"
          label="Area (hectares)"
          type="number"
          value={formik.values.areaHectares}
          onChange={formik.handleChange}
          error={
            formik.touched.areaHectares && Boolean(formik.errors.areaHectares)
          }
          helperText={formik.touched.areaHectares && formik.errors.areaHectares}
          margin="normal"
        />

        <Box sx={{ mt: 2, height: '400px' }}>
          <Typography variant="subtitle1" gutterBottom>
            Draw Plot Boundary
          </Typography>
          <MapDrawer
            onPolygonComplete={(polygon) =>
              formik.setFieldValue('boundary', polygon)
            }
          />
          {formik.errors.boundary && (
            <Typography color="error">{formik.errors.boundary}</Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Register Land
        </Button>
      </form>
    </Container>
  );
}
