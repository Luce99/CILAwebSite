import React from "react";
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import { Link } from "@material-ui/core";
import { Icon } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer(){
    return (
        <footer>
          <Box
            px={{ xs: 3, sm: 10 }}
            py={{ xs: 5, sm: 10 }}
          >
            <Container maxWidth="lg">
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Box borderBottom={1} fontSize="20px" fontWeight="bold" marginBottom="1rem">Contacto</Box>
                  <Box>
                      {/* tengo que cambiar este WhatsAppWeb porque lleva a las colonias */}
                    <Link href="https://wa.me/message/OTCJZJCQNK2JO1" target="_blank" color= "inherit">
                    <Icon>
                    <WhatsAppIcon/>
                    </Icon>
                    +57 3125511227
                    </Link>
                  </Box>
                  <Box>
                    <Link href="mailto:cila.autenticas@gmail.com"  target="_blank" color="inherit">
                        <Icon style={{marginTop: "2px"}}>
                      <EmailIcon/>
                      </Icon>
                      cilaAutenticas@gmail.com
                    </Link>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box borderBottom={1} fontSize="20px" fontWeight="bold" marginBottom="1rem">Redes sociales</Box>
                  <Box>
                    <Link href="https://instagram.com/cila.autenticas?utm_medium=copy_link" target="_blank" color="inherit">
                        <Icon>
                            <InstagramIcon/>
                        </Icon>
                      Instagram
                    </Link>
                  </Box>
                  <Box>
                    <Link href="https://www.facebook.com/CILAutenticas/" target="_blank" color="inherit">
                        <Icon>
                        <FacebookIcon/>
                        </Icon>
                      Facebook
                    </Link>
                  </Box>
                </Grid>
              </Grid>
              <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
              CILA autenticas &reg; {new Date().getFullYear()}
              <br/>
              <br/>
              <span>Desarrollado por Lucero Mojica</span>
              </Box>
            </Container>
          </Box>
        </footer>
      );
}