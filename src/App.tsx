import {
    AppBar,
    Box,
    Container,
    Toolbar,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

function App() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        NeuroTutor MVP
                    </Typography>
                    <Button color="inherit">Courses</Button>
                    <Button color="inherit">Profile</Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Добро пожаловать в NeuroTutor
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Это заготовка фронтенда React + MUI под интеграцию с FastAPI.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Ближайшие шаги:
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText primary="Сделать список курсов" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Сделать страницу одного урока" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Подключить запросы к FastAPI" />
                        </ListItem>
                    </List>
                </Paper>
            </Container>

            <Box component="footer" sx={{ py: 2, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                    NeuroTutor · React + FastAPI · {new Date().getFullYear()}
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
