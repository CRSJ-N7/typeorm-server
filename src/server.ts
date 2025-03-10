import app from './app';

const PORT = 5000;
app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
