import express from 'express';
import sensorController from '../controllers/sensor.js';

const router = express.Router();

// v2

/**
 * @api {get} /api/v2/sensor Get All Sensors
 * @apiVersion 0.2.0
 * @apiName Get-All-Sensor
 * @apiGroup Sensor
 * @apiDescription Ambil semua daftar sensor.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "success",
 *   "pagination": {
 *     "totalPages": 1,
 *     "currentPage": 1
 *   },
 *   "data": {
 *     "count": 2,
 *     "rows": [
 *       {
 *         "id": 1,
 *         "nama_sensor": "Kamera",
 *         "createdAt": "2024-01-10T20:14:00.000Z",
 *         "updatedAt": "2024-01-10T20:14:00.000Z"
 *       },
 *       {
 *         "id": 2,
 *         "nama_sensor": "Loadcell Badan",
 *         "createdAt": "2024-01-10T20:14:00.000Z",
 *         "updatedAt": "2024-01-10T20:14:00.000Z"
 *       }
 *     ]
 *   }
 * }
 */
router.get('/', function (req, res, next) { sensorController.index(req, res, next) });

/**
 * @api {post} /api/v2/sensor Create Sensor
 * @apiVersion 0.2.0
 * @apiName Create-Sensor
 * @apiGroup Sensor
 * @apiDescription Menambahkan sensor baru.
 * @apiParamExample {json} Example Body:
 * {
 *  "nama_sensor": "mpu"
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "message": "Sensor created successfully",
 *   "data": {
 *     "id": 1,
 *     "nama_sensor": "Sensor 1",
 *     "createdAt": "2024-01-10T20:14:00.000Z",
 *     "updatedAt": "2024-01-10T20:14:00.000Z"
 *   }
 * }
 */
router.post('/', function (req, res, next) { sensorController.create(req, res, next) });

/**
 * @api {post} /api/v2/sensor/edit/:id Edit Sensor
 * @apiVersion 0.2.0
 * @apiName Edit-Sensor
 * @apiGroup Sensor
 * @apiParam {Number} id ID data sensor.
 * @apiDescription Mengubah nama sensor.
 * @apiParamExample {json} Example Body:
 * {
 *  "nama_sensor": "aht"
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Sensor updated successfully",
 *   "data": {
 *     "id": 1,
 *     "nama_sensor": "Updated Sensor",
 *     "createdAt": "2024-01-10T20:14:00.000Z",
 *     "updatedAt": "2024-01-10T20:14:00.000Z"
 *   }
 * }
 */
router.post('/edit/:id', function (req, res, next) { sensorController.update(req, res, next) });

/**
 * @api {post} /api/v2/sensor/delete/:id Delete Sensor
 * @apiVersion 0.2.0
 * @apiName Delete-Sensor
 * @apiGroup Sensor
 * @apiParam {Number} id ID data sensor.
 * @apiDescription Menghapus item sensor.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Sensor deleted successfully"
 * }
 */
router.post('/delete/:id', function (req, res, next) { sensorController.destroy(req, res, next) });

/**
 * @api {get} /api/v2/sensor/:id Get Sensor by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-Sensor
 * @apiGroup Sensor
 * @apiParam {Number}id ID data sensor.
 * @apiDescription Get a specific sensor entry by ID.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "success",
 *   "data": {
 *     "id": 1,
 *     "nama_sensor": "Sensor 1",
 *     "createdAt": "2024-01-10T20:14:00.000Z",
 *     "updatedAt": "2024-01-10T20:14:00.000Z"
 *   }
 * }
 */
router.get('/:id', function (req, res, next) { sensorController.show(req, res, next) });

export default router;