import express from 'express';
import ahtController from '../controllers/aht.js';

const router = express.Router();

// v2

/**
 * @api {post} /api/v2/aht Create AHT Entry
 * @apiVersion 0.2.0
 * @apiName Add-AHT-Data
 * @apiGroup AHT
 * @apiDescription Menambahkan data suhu.
 * @apiBody {Number} suhu Suhu ruang.
 * @apiBody {Number} kelembapan Kelembapan ruang.
 * @apiParamExample {json} Example-Body:
 * {
 *      "suhu" : 29.12,
 *      "kelembapan" : 60.12,
 *      "chip_id" : "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2"
 * }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *      "message": "success",
 *      "data": {
 *          "id": 6,
 *          "suhu": "28.12",
 *          "kelembapan": "60.12",
 *          "createdAt": "2024-09-20T09:36:54.432Z",
 *          "updatedAt": "2024-09-20T09:36:54.432Z",
 *          "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *          "sensor_id": 4
 *      }
 *  }
 */
router.post('/', function (req, res, next) { ahtController.create(req, res, next) });


/**
 * @api {get} /api/v2/aht Get All AHT Entry
 * @apiVersion 0.2.0
 * @apiName Get-All-AHT
 * @apiGroup AHT
 * @apiDescription Mengambil data dari tabel AHT.
 * @apiQuery {Number} page Halaman paginasi.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
        "message": "success",
        "pagination": {
            "totalPages": 1,
            "currentPage": 1
        },
        "data": {
            "count": 5,
            "rows": [
                {
                    "id": 5,
                    "suhu": 30.12,
                    "kelembaban": 70.12,
                    "createdAt": "2024-07-17T14:30:00.000Z",
                    "updatedAt": "2024-07-17T14:30:00.000Z",
                    "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
                    "nama_domba": "John",
                    "jenis_kelamin": "Jantan"
                },
                {
                    "id": 4,
                    "suhu": 29.12,
                    "kelembaban": 69.12,
                    "createdAt": "2024-07-24T14:30:00.000Z",
                    "updatedAt": "2024-07-24T14:30:00.000Z",
                    "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
                    "nama_domba": "John",
                    "jenis_kelamin": "Jantan"
                },
                ...
            ]
        }
    }
 */
router.get('/', function (req, res, next) { ahtController.index(req, res, next) });

/**
 * @api {get} /api/v2/aht Get Data Graph Entry
 * @apiVersion 0.2.0
 * @apiName Get-Graph-AHT
 * @apiGroup AHT
 * @apiDescription Mengambil data dari tabel AHT sesuai dengan chip_id.
 * @apiQuery {String} chip_id ID chip domba
 * @apiQuery {Number} page Halaman paginasi
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "pagination": {
 *      "totalPages": 3,
 *      "currentPage": 1
 *  },
 *  "data": {
 *      "count": 14,
 *      "rows": [
 *          {
 *              "id": 14,
 *              "suhu": 28.12,
 *              "kelembaban": 60.12,
 *              "createdAt": "2024-09-10T09:35:07.320Z",
 *              "updatedAt": "2024-09-10T09:35:07.320Z"
 *          },
 *          {
 *              "id": 13,
 *              "suhu": 28.12,
 *              "kelembaban": 60.12,
 *              "createdAt": "2024-09-10T08:47:38.935Z",
 *              "updatedAt": "2024-09-10T08:47:38.935Z"
 *          },
 *          ...
 *      ]
 *  }
 * }
 */
router.get('/graph', function (req, res, next) { ahtController.graph(req, res, next) });

/**
 * @api {post} /api/v2/aht/edit/:id Edit AHT Entry
 * @apiVersion 0.2.0
 * @apiName Edit-AHT
 * @apiGroup AHT
 * @apiParam {Number} id ID data suhu.
 * @apiDescription Mengubah data suhu.
 * @apiBody {Number} suhu Data suhu baru.
 * @apiBody {Number} kelembapan Data kelembapan baru.
 * @apiParamExample {json} Example-Body:
 * {
 *      "suhu" : 29.12,
 *      "kelembapan" : 60.12
 * }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 1,
 *      "suhu": "29.12",
 *      "kelembapan": "60.12",
 *      "createdAt": "2024-08-28T14:30:00.000Z",
 *      "updatedAt": "2024-09-10T10:09:06.660Z",
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "sensor_id": 4
 *  }
 * }
 */
router.post('/edit/:id', function (req, res, next) { ahtController.update(req, res, next) });

/**
 * @api {post} /api/v2/aht/delete/:id Delete AHT Entry
 * @apiVersion 0.2.0
 * @apiName Delete-AHT
 * @apiGroup AHT
 * @apiParam {Number} id ID data suhu.
 * @apiDescription Menghapus data suhu.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "AHT entry deleted successfully"
 * }
 */
router.post('/delete/:id', function (req, res, next) { ahtController.destroy(req, res, next) });

router.get('/daily/:date/:chip_id', function(req, res, next) {
    ahtController.getDailyData(req, res, next);
  });

router.get('/weekly/:date/:chip_id', function(req, res, next) {
    ahtController.getWeeklyData(req, res, next);
  });

  router.get('/monthly/:date/:chip_id', function(req, res, next) {
    ahtController.getMonthlyData(req, res, next);
  });
  
/**
 * @api {get} /api/v2/aht/:id Get AHT Entry by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-AHT-Data
 * @apiGroup AHT
 * @apiParam {Number} id ID data suhu.
 * @apiDescription Mengambil satu data suhu.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "data": {
 *          "id": 1,
 *          "suhu": 29.12,
 *          "kelembaban": 60.12,
 *          "createdAt": "2024-08-28T14:30:00.000Z",
 *          "updatedAt": "2024-08-28T14:30:00.000Z",
 *          "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *          "nama_domba": "John",
 *          "jenis_kelamin": "Jantan"
 *      }
 *  }
 */
router.get('/:id', function (req, res, next) { ahtController.show(req, res, next) });

export default router;