import express from 'express';
import cors from 'cors';

import dombaRouter from './domba.js';
import sensorRouter from './sensor.js';
import kameraRouter from './kamera.js';
import loadcellBadanRouter from './loadcellBadan.js';
import loadcellPakanRouter from './loadcellPakan.js';
import mpuRouter from './mpu.js';
import ahtRouter from './aht.js';
import rfidRouter from './rfid.js';

// import dataDombaRouter from './dataDomba.js';

const router = express.Router();

router.use('/rfid', cors(), rfidRouter);
router.use('/chip', cors(), dombaRouter);
router.use('/sensor', cors(), sensorRouter);
router.use('/kamera', cors(), kameraRouter);
router.use('/loadcellBadan', cors(), loadcellBadanRouter);
router.use('/loadcellPakan', cors(), loadcellPakanRouter);
router.use('/mpu', cors(), mpuRouter);
router.use('/aht', cors(), ahtRouter);

  

export default router;