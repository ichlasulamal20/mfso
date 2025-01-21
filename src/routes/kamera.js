import express from 'express';
import kameraController from '../controllers/kamera.js';

const router = express.Router();

// v2


/**
 * @api {post} /api/v2/kamera Create Camera Measurement
 * @apiVersion 0.2.0
 * @apiName Add-Dimension-Data
 * @apiGroup Kamera
 * @apiDescription Menambahkan data dimensi baru.
 * @apiBody {Number} panjang Dimensi panjang domba.
 * @apiBody {Number} tinggi Dimensi tinggi domba.
 * @apiParamExample {json} Example Body:
 * {
 *  "panjang": 102,
 *  "tinggi": 90
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *  "message": "success",
 *  "data": {
 *      "newKamera": {
 *          "id": 12,
 *          "panjang": "90",
 *          "tinggi": "80",
 *          "createdAt": "2024-09-10T16:31:07.257Z",
 *          "updatedAt": "2024-09-10T16:31:07.257Z",
 *          "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *          "sensor_id": 1,
 *          "STRING": null,
 *          "DECIMAL": null,
 *          "paired": false
 *      },
 *      "newDatadomba": {
 *          "id": 12,
 *          "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *          "kamera_id": 12,
 *          "loadcell_badan_id": null,
 *          "createdAt": "2024-09-10T16:31:07.257Z",
 *          "updatedAt": "2024-09-10T16:31:07.257Z",
 *          "STRING": null,
 *          "DECIMAL": null
 *          }
 *       }
 *  }
 */
router.post('/', function (req, res, next) { kameraController.create(req, res, next) });


/**
 * @api {get} /api/v2/kamera Get All Camera Measurements
 * @apiVersion 0.2.0
 * @apiName Get-All-Didmension
 * @apiGroup Kamera
 * @apiDescription Mengambil data dari tabel kamera.
 * @apiQuery {Number} page Halaman paginasi.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "pagination": {
 *      "totalPages": 3,
 *      "currentPage": 2
 *  },
 *  "data": {
 *      "count": 11,
 *      "rows": [
 *          {
 *              "id": 6,
 *              "panjang": "104.5",
 *              "tinggi": "71.63",
 *              "createdAt": "2024-08-28T14:30:00.000Z",
 *              "updatedAt": "2024-08-28T14:30:00.000Z",
 *              "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *              "nama_domba": "Jane",
 *              "jenis_kelamin": "Betina"
 *          },
 *          {
 *              "id": 5,
 *              "panjang": "59.85",
 *              "tinggi": "66.93",
 *              "createdAt": "2024-07-17T14:30:00.000Z",
 *              "updatedAt": "2024-07-17T14:30:00.000Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *              "nama_domba": "John",
 *              "jenis_kelamin": "Jantan"
 *          },
 *          ...
 *          ]
 *      }
 *  }
 */
router.get('/', function (req, res, next) { kameraController.index(req, res, next) });

/**
 * @api {get} /api/v2/kamera Get Data Graph Entry
 * @apiVersion 0.2.0
 * @apiName Get-Graph-Dimension
 * @apiGroup Kamera
 * @apiDescription Mengambil data dari tabel AHT sesuai dengan chip_id.
 * @apiQuery {String} chip_id ID chip domba
 * @apiQuery {Number} page Halaman paginasi
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "pagination": {
 *      "totalPages": 2,
 *      "currentPage": 1
 *  },
 *  "data": {
 *      "count": 6,
 *      "rows": [
 *          {
 *              "id": 11,
 *              "panjang": 90,
 *              "tinggi": 80,
 *              "createdAt": "2024-09-10T15:38:30.922Z",
 *              "updatedAt": "2024-09-10T15:38:30.922Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f"
 *          },
 *          {
 *              "id": 5,
 *              "panjang": 59.85,
 *              "tinggi": 66.93,
 *              "createdAt": "2024-07-17T14:30:00.000Z",
 *              "updatedAt": "2024-07-17T14:30:00.000Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f"
 *          },
 *          ...
 *          ]
 *      }
 *  }
 */
router.get('/graph', function (req, res, next) { kameraController.graph(req, res, next) });

/**
 * @api {post} /api/v2/kamera/edit/:id Edit Camera Entry
 * @apiVersion 0.2.0
 * @apiName Edit-Dimension
 * @apiGroup Kamera
 * @apiParam {Number} id ID Data Kamera.
 * @apiDescription Mengubah data dimensi domba.
 * @apiBody {Number} panjang Dimensi panjang domba.
 * @apiBody {Number} tinggi Dimendi tinggi domba.
 * @apiParamExample {json} Example Body:
 * {
 *  "panjang": 100,
 *  "tinggi": 95
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Camera measurement updated successfully",
 *   "data": {
 *     "id": 1,
 *     "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *     "sensor_id": 1,
 *     "createdAt": "2024-09-03T01:23:39.070Z",
 *     "updatedAt": "2024-09-03T01:23:39.070Z",
 *     "panjang": 90,
 *     "tinggi": 80
 *   }
 * }
 */
router.post('/edit/:id', function (req, res, next) { kameraController.update(req, res, next) });

/**
 * @api {post} /api/v2/kamera/delete/:id Delete Camera Measurement
 * @apiVersion 0.2.0
 * @apiName Delete-Dimension
 * @apiGroup Kamera
 * @apiParam {Number} id ID data dimensi domba.
 * @apiDescription Hapus data domba.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Camera measurement deleted successfully"
 * }
 */
router.post('/delete/:id', function (req, res, next) { kameraController.destroy(req, res, next) });

/**
 * @api {get} /api/v2/kamera/:id Get Camera Entry by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-Dimension-Data
 * @apiGroup Kamera
 * @apiParam {Number} id ID data dimensi domba.
 * @apiDescription Mengambil satu data domba.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 1,
 *      "panjang": 22,
 *      "tinggi": 22,
 *      "createdAt": "2024-08-28T14:30:00.000Z",
 *      "updatedAt": "2024-09-10T16:21:11.488Z",
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "nama_domba": "Doe",
 *      "jenis_kelamin": "Jantan"
 *      }
 *  }
 */
router.get('/:id', function (req, res, next) { kameraController.show(req, res, next) });

export default router;