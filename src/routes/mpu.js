import express from 'express';
import mpuController from '../controllers/mpu.js';

const router = express.Router();

// V2

/**
 * @api {post} /api/v2/mpu Create MPU Entry
 * @apiVersion 0.2.0
 * @apiName Add-MPU-Data
 * @apiGroup MPU
 * @apiDescription Menambahkan data mpu.
 * @apiBody {Number} acc_x Data MPU.
 * @apiBody {Number} acc_y Data MPU.
 * @apiBody {Number} acc_z Data MPU.
 * @apiBody {Number} tinggi Data MPU.
 * @apiBody {Boolean} kondisi Data MPU.
 * @apiBody {Number} chip_id ID chip domba.
 * @apiParamExample {json} Request-Example:
 * {
 *  "acc_x": 123.12,
 *  "acc_y": 456.12,
 *  "acc_z": 789.12,
 *  "tinggi": 21.12,
 *  "kondisi": true,
 *  "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2"
 * }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *    "acc_x": 123.12,
 *   "acc_y": 456.12,
 *   "acc_z": 789.12,
 *   "tinggi": 21.12,
 *   "kondisi": true,
 *   "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2"
 * }
 */
router.post('/', function (req, res, next) { mpuController.create(req, res, next) });

/**
 * @api {get} /api/v2/mpu Get All MPU Data
 * @apiVersion 0.2.0
 * @apiName Get-All-MPU
 * @apiGroup MPU
 * @apiDescription Mengambil semua data MPU.
 * @apiQuery {Number} page Halaman paginasi
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "pagination": {
 *          "totalPages": 5,
 *          "currentPage": 1
 *      },
 *      "data": {
 *          "count": 25,
 *          "rows": [
 *              {
 *                  "id": 25,
 *                  "acc_x": 123.12,
 *                  "acc_y": 456.12,
 *                  "acc_z": 789.12,
 *                  "tinggi": 21.22,
 *                  "kondisi": true,
 *                  "createdAt": "2024-09-11T18:11:10.280Z",
 *                  "updatedAt": "2024-09-11T18:11:10.280Z",
 *                  "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *                  "nama_domba": "Jane",
 *                  "jenis_kelamin": "Betina"
 *              },
 *              {
 *                  "id": 24,
 *                  "acc_x": 123.12,
 *                  "acc_y": 456.12,
 *                  "acc_z": 789.12,
 *                  "tinggi": 21.22,
 *                  "kondisi": true,
 *                  "createdAt": "2024-09-11T18:11:08.629Z",
 *                  "updatedAt": "2024-09-11T18:11:08.629Z",
 *                  "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *                  "nama_domba": "Jane",
 *                  "jenis_kelamin": "Betina"
 *              },
 *              ...
 *          ]
 *      }
 *  }
 */
router.get('/', function (req, res, next) { mpuController.index(req, res, next) });

/**
 * @api {get} /api/v2/mpu/graph Get Data Graph Entry
 * @apiVersion 0.2.0
 * @apiName Get-Graph-MPU
 * @apiGroup MPU
 * @apiDescription Mengambil data dari tabel MPU sesuai dengan chip_id.
 * @apiQuery {String} chip_id ID chip domba.
 * @apiQuery {Number} page Halaman paginasi.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "pagination": {
 *          "totalPages": 1,
 *          "currentPage": 1
 *      },
 *      "data": {
 *          "count": 5,
 *          "rows": [
 *              {
 *                  "id": 5,
 *                  "acc_x": 102.12,
 *                  "acc_y": 20.12,
 *                  "acc_z": 50.12,
 *                  "tinggi": 10.12,
 *                  "kondisi": false,
 *                  "createdAt": "2024-07-17T14:30:00.000Z",
 *                  "updatedAt": "2024-07-17T14:30:00.000Z"
 *              },
 *              {
 *                  "id": 4,
 *                  "acc_x": 102.12,
 *                  "acc_y": 20.12,
 *                  "acc_z": 50.12,
 *                  "tinggi": 10.12,
 *                  "kondisi": false,
 *                  "createdAt": "2024-07-24T14:30:00.000Z",
 *                  "updatedAt": "2024-07-24T14:30:00.000Z"
 *              },
 *              ...
 *          ]
 *      }
 *  }
 */
router.get('/graph', function (req, res, next) { mpuController.graph(req, res, next) });

/**
 * @api {post} /mpu/edit/:id Edit MPU data
 * @apiVersion 0.2.0
 * @apiName Edit-MPU
 * @apiGroup MPU
 * @apiDescription Mengubah data MPU.
 * @apiParam {String} id MPU data ID.
 * @apiBody {Number} acc_x Data MPU.
 * @apiBody {Number} acc_y Data MPU.
 * @apiBody {Number} acc_z Data MPU.
 * @apiBody {Number} tinggi Data MPU.
 * @apiBody {Boolean} kondisi Data MPU.
 * @apiBody {Number} chip_id ID chip domba.
 * @apiParamExample {json} Request-Example:
 * {
 *  "acc_x": 123.12,
 *  "acc_y": 456.12,
 *  "acc_z": 789.12,
 *  "tinggi": 21.12,
 *  "kondisi": true,
 *  "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2"
 * }
 * @apiSuccess {Object} data Updated MPU data.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "data": {
 *          "id": 1,
 *          "acc_x": "123.12",
 *          "acc_y": "456.12",
 *          "acc_z": "789.12",
 *          "tinggi": "21.12",
 *          "kondisi": false,
 *          "createdAt": "2024-09-12T01:16:58.080Z",
 *          "updatedAt": "2024-09-12T01:16:58.080Z",
 *          "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *          "sensor_id": 5
 *      }
 *  }
 */
router.post('/edit/:id', function (req, res, next) { mpuController.update(req, res, next) });

/**
 * @api {post} /mpu/delete/:id Delete MPU data
 * @apiVersion 0.2.0
 * @apiName Delete-MPU
 * @apiGroup MPU
 * @apiParam {Number} id ID data MPU.
 * @apiDescription Menghapus data MPU.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "MPU data deleted successfully"
 * }
 */
router.post('/delete/:id', function (req, res, next) { mpuController.destroy(req, res, next) });

/**
 * @api {get} /mpu/:id Get MPU data by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-MPU
 * @apiGroup MPU
 * @apiDescription Mengambil data mpu.
 * @apiParam {String} id ID data MPU.
 * @apiSuccess {Object} data Data MPU.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "data": {
 *          "id": 1,
 *          "acc_x": 123.12,
 *          "acc_y": 456.12,
 *          "acc_z": 789.12,
 *          "tinggi": 21.12,
 *          "kondisi": false,
 *          "createdAt": "2024-09-12T01:16:58.080Z",
 *          "updatedAt": "2024-09-12T01:16:58.080Z",
 *          "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *          "nama_domba": "Jane",
 *          "jenis_kelamin": "Betina"
 *      }
 *  }
 */
router.get('/:id', function (req, res, next) { mpuController.show(req, res, next) });

export default router;
