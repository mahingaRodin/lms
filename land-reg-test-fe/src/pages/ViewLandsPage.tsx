import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
} from '@mui/material';
import LandPlotMap from "../components/LandPlotMap";

interface LandPlot {
  id: string;
  parcelNumber: string;
  areaHectares: number;
  boundary: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

export default function ViewLandsPage() {
  const [plots, setPlots] = useState<LandPlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axios.get('http://localhost:3000/land-plots', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlots(response.data);
      } catch (error) {
        console.error('Failed to fetch plots', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, [token]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Registered Land Plots
      </Typography>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <List>
            {plots.map((plot) => (
              <Card key={plot.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{plot.parcelNumber}</Typography>
                  <Typography>Area: {plot.areaHectares} hectares</Typography>
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 2, height: '500px' }}>
          <LandPlotMap plots={plots} />
        </Box>
      </Box>
    </Container>
  );
}
