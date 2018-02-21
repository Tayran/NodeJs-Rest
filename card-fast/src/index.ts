import app from './config/Express';

const port = 3001 || process.env.PORT;

app.listen(port, () => {
    console.log(`server on listening port ${port}`);
});