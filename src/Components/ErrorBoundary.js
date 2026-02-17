import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";

const ERROR_MESSAGES = {
  TITLE: "Algo salio mal",
  DESCRIPTION:
    "Ha ocurrido un error inesperado. Por favor, intenta recargar la pagina.",
  RELOAD_BUTTON: "Recargar pagina",
  DETAILS_LABEL: "Detalles del error:",
};

const STYLES = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    padding: "2rem",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  button: {
    marginTop: "1.5rem",
  },
  details: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    maxWidth: "600px",
    wordBreak: "break-word",
    textAlign: "left",
  },
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };

    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary capturo un error:", error, errorInfo);
  }

  handleReload() {
    window.location.reload();
  }

  renderErrorDetails() {
    const { error } = this.state;
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!isDevelopment || !error) {
      return null;
    }

    return (
      <Box style={STYLES.details}>
        <Typography variant="caption" color="textSecondary">
          {ERROR_MESSAGES.DETAILS_LABEL}
        </Typography>
        <Typography variant="body2" component="pre" style={{ fontSize: "0.75rem" }}>
          {error.toString()}
        </Typography>
      </Box>
    );
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Container style={STYLES.container}>
        <Typography style={STYLES.icon} role="img" aria-label="error">
          ⚠️
        </Typography>
        <Typography variant="h4" gutterBottom>
          {ERROR_MESSAGES.TITLE}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {ERROR_MESSAGES.DESCRIPTION}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleReload}
          style={STYLES.button}
        >
          {ERROR_MESSAGES.RELOAD_BUTTON}
        </Button>
        {this.renderErrorDetails()}
      </Container>
    );
  }
}

export default ErrorBoundary;
