import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const navigate = useNavigate();
    
  return (
    <Paper className={styles.footer}
      component="footer"
      square
      variant="outlined"
      sx={{backgroundColor:'#D3D3D3'}}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Box mb={2}>
              <Typography 
                component="a"
                href="/contacts"
                variant="caption"
                color="inherit"
              >
                Контакты
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box mb={2}>
              <Typography variant="caption" color="inherit">
                © 2025 Perfect rent
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}