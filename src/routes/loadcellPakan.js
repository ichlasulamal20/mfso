import express from 'express';
import loadcellPakanController from '../controllers/loadcellPakan.js';

const router = express.Router();

// v2

/**
 * @api {post} /api/v2/loadcellpakan Create Loadcell Pakan Entry
 * @apiVersion 0.2.0
 * @apiName Add-BeratPakan-Data
 * @apiGroup LoadCell Pakan
 * @apiDescription Menambahkan data berat pakan\
 * @apiBody {Number} berat Berat pakan [gram].
 * @apiParamExample {json} Example Body:
 * {
 *  "berat": 2500.12,
 *  "chip_id" : "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 12,
 *      "berat_pakan": "2500.12",
 *      "chip_id" : "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *      "createdAt": "2024-09-10T10:13:15.619Z",
 *      "updatedAt": "2024-09-10T10:13:15.619Z",
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "sensor_id": 3
 *      }
 *  }
 */
router.post('/', function (req, res, next) {loadcellPakanController.create(req, res, next) });

/**
 * @api {get} /api/v2/loadcellpakan Get All Loadcell Pakan Entry
 * @apiVersion 0.2.0
 * @apiName Get-All-BeratPakan
 * @apiGroup LoadCell Pakan
 * @apiDescription Mengambil semua data berat badan.
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
 *      "count": 12,
 *      "rows": [
 *          {
 *              "id": 12,
 *              "berat_pakan": 156.24,
 *              "createdAt": "2024-09-10T10:13:15.619Z",
 *              "updatedAt": "2024-09-10T10:13:15.619Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *              "nama_domba": "John",
 *              "jenis_kelamin": "Jantan"
 *          },
 *          {
 *              "id": 11,
 *              "berat_pakan": 156.24,
 *              "createdAt": "2024-09-10T08:48:38.791Z",
 *              "updatedAt": "2024-09-10T08:48:38.791Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *              "nama_domba": "John",
 *              "jenis_kelamin": "Jantan"
 *          },
 *          ...
 *          ]
 *      }
 *  }
 */
router.get('/', function (req, res, next) { loadcellPakanController.index(req, res, next) });

/**
 * @api {get} /api/v2/loadcellpakan Get Data Graph Entry
 * @apiVersion 0.2.0
 * @apiName Get-Graph-BeratPakan
 * @apiGroup LoadCell Pakan
 * @apiDescription Mengambil data dari tabel loadcellpakan sesuai dengan chip_id.
 * @apiQuery {Number} page Halaman paginasi
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
 *         "weight": 100.12,
 *         "createdAt": "2024-01-10T20:14:00.000Z",
 *         "updatedAt": "2024-01-10T20:14:00.000Z"
 *       },
 *       {
 *         "id": 2,
 *         "weight": 150.12,
 *         "createdAt": "2024-01-10T20:14:00.000Z",
 *         "updatedAt": "2024-01-10T20:14:00.000Z"
 *       }
 *     ]
 *   }
 * }
 */
router.get('/graph', function (req, res, next) { loadcellPakanController.graph(req, res, next) });


/**
 * @api {post} /api/v2/loadcellpakan/edit/:id Edit Loadcell Pakan Measurement
 * @apiVersion 0.2.0
 * @apiName Edit-BeratPakan
 * @apiGroup LoadCell Pakan
 * @apiParam {Number} id ID data berat pakan.
 * @apiBody {Number} weight Berat pakan [gram].
 * @apiDescription Mengubah data berat pakan.
 * {
 *  "berat": 1500
 * }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 1,
 *      "berat_pakan": "1500.24",
 *      "createdAt": "2024-09-10T10:50:51.149Z",
 *      "updatedAt": "2024-09-10T10:50:51.149Z",
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "sensor_id": 3
 *      }
 *  }
 */
router.post('/edit/:id', function (req, res, next) { loadcellPakanController.update(req, res, next) });

/**
 * @api {post} /api/v2/loadcellpakan/delete/:id Delete Loadcell Pakan Measurement
 * @apiVersion 0.2.0
 * @apiName Delete-BeratPakan
 * @apiGroup LoadCell Pakan
 * @apiParam {Number} id ID data berat pakan.
 * @apiDescription Menghapus data berat pakan.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "success"
 * }
 */
router.post('/delete/:id', function (req, res, next) { loadcellPakanController.destroy(req, res, next) });

router.get('/daily/:date/:chip_id', function(req, res, next) {
  loadcellPakanController.getDailyData(req, res, next);
});


router.get('/weekly/:date/:chip_id', function(req, res, next) {
  loadcellPakanController.getWeeklyData(req, res, next);
});

router.get('/monthly/:date/:chip_id', function(req, res, next) {
  loadcellPakanController.getMonthlyData(req, res, next);
});

  
/**
 * @api {get} /api/v2/loadcellpakan/:id Get Loadcell Pakan Measurement by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-BeratPakan-Data
 * @apiGroup LoadCell Pakan
 * @apiParam {Number} id ID data berat pakan
 * @apiDescription Mengambil satu data berat pakan
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "data": {
 *          "id": 1,
 *          "berat_pakan": 1500.12,
 *          "createdAt": "2024-08-28T14:30:00.000Z",
 *          "updatedAt": "2024-08-28T14:30:00.000Z",
 *          "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *          "nama_domba": "John",
 *          "jenis_kelamin": "Jantan"
 *      }
 *  }
 */
router.get('/:id', function (req, res, next) { loadcellPakanController.show(req, res, next) });

export default router;

