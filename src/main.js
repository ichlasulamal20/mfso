import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import routerDev from './routes/index.js';  // Pastikan path benar


console.log("deployed : 201");


dotenv.config();  // Load environment variables

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

// Middleware
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// init
app.get('/', function (req, res) {
  console.log("route hit");
  res.send('Hello Main Route');
});
 
// route controller
app.use('/api', routerDev);

// Jalankan server untuk lokal development saja
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export untuk digunakan oleh Vercel
export default app;