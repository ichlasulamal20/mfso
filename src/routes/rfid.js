import express from 'express';
import rfidController from '../controllers/rfid.js';

const router = express.Router();

// v2

/**
 * @api {get} /api/v2/rfid/scan/:chip_id Add RFID Scan Entry
 * @apiVersion 0.2.0
 * @apiName Scan-RFID
 * @apiGroup RFID
 * @apiParam {String} chip_id RFID chip ID.
 * @apiDescription Menyimpan hasil scan RFID.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 2,
 *      "is_paired": false,
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "createdAt": "2024-09-10T11:39:35.241Z",
 *      "updatedAt": "2024-09-10T11:39:35.241Z"
 *      }
 *  }
 */
router.get('/scan/:chip_id', function (req, res, next) { rfidController.create(req, res, next) });


/**
 * @api {get} /api/v2/rfid/get Get latest scan
 * @apiVersion 0.2.0
 * @apiName Get-Latest-RFID
 * @apiGroup RFID
 * @apiDescription Menyimpan hasil scan RFID.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 3,
 *      "is_paired": false,
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "createdAt": "2024-09-10T11:43:25.783Z",
 *      "updatedAt": "2024-09-10T11:43:25.783Z"
 *      }
 *  }
 */
router.get('/get', function (req, res, next) { rfidController.get(req, res, next) });

export default router;