import express from 'express';
import loadcellBadanController from '../controllers/loadcellBadan.js';

const router = express.Router();

// v2


/**
 * @api {post} /api/v2/loadcellbadan Create Loadcell Measurement
 * @apiVersion 0.2.0
 * @apiName Add-BeratBadan-Data
 * @apiGroup LoadCell Badan
 * @apiDescription Menambahkan data berat badan baru.
 * @apiQuery {Number} page Halaman paginasi.
 * @apiBody {Number} berat Berat badan domba. 
 * @apiParamExample {json} Request-Example:
 * {
 *      "berat" : 90.12
 * }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *      "message": "success",
 *      "data": {
 *          "newLoadcellBadan": {
 *              "id": 7,
 *              "berat": "90.12",
 *              "createdAt": "2024-09-12T01:38:25.331Z",
 *              "updatedAt": "2024-09-12T01:38:25.331Z",
 *              "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *              "sensor_id": 2,
 *              "paired": false
 *          },
 *          "updateDatadomba": {
 *              "id": 6,
 *              "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *              "kamera_id": null,
 *              "loadcell_badan_id": 7,
 *              "createdAt": "2024-09-12T01:37:50.795Z",
 *              "updatedAt": "2024-09-12T01:38:25.331Z"
 *          }
 *      }
 *  }
 * 
 * 
 * 
 */
router.post('/', function (req, res, next) { loadcellBadanController.create(req, res, next) });


/**
 * @api {get} /api/v2/loadcellbadan Get All Loadcell Measurements
 * @apiVersion 0.2.0
 * @apiName Get-All-BeratBadan
 * @apiGroup LoadCell Badan
 * @apiDescription Mengambil semua daftar berat badan domba.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
    "message": "success",
    "pagination": {
        "totalPages": 2,
        "currentPage": 1
    },
    "data": {
        "count": 7,
        "rows": [
            {
                "id": 7,
                "berat": 120.12,
                "createdAt": "2024-09-12T01:38:25.331Z",
                "updatedAt": "2024-09-12T01:38:25.331Z",
                "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
                "nama_domba": "Jane",
                "jenis_kelamin": "Betina"
            },
            {
                "id": 6,
                "berat": 12.12,
                "createdAt": "2024-09-12T01:37:50.795Z",
                "updatedAt": "2024-09-12T01:37:50.795Z",
                "chip_id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
                "nama_domba": "Jane",
                "jenis_kelamin": "Betina"
            },
            ...
        ]
    }
}
 */
router.get('/', function (req, res, next) { loadcellBadanController.index(req, res, next) });



/**
 * @api {get} /api/v2/loadcellbadan/graph/:chip_id Get Loadcell Measurement by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-BeratBadan
 * @apiGroup LoadCell Badan
 * @apiParam {String} chip_id Cihp_id domba.
 * @apiDescription Mengambil histori data berat badan satu domba.
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
 *              "berat": 50.12,
 *              "createdAt": "2024-09-10T16:30:50.046Z",
 *              "updatedAt": "2024-09-10T16:30:50.046Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f"
 *          },
 *          {
 *              "id": 5,
 *              "berat": 80.78,
 *              "createdAt": "2024-07-17T14:30:00.000Z",
 *              "updatedAt": "2024-07-17T14:30:00.000Z",
 *              "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f"
 *          },
 *         ...
 *          ]
 *      }
 *  }
 */
router.get('/graph', function (req, res, next) { loadcellBadanController.graph(req, res, next) });


/**
 * @api {post} /api/v2/loadcellbadan/edit/:id Edit Loadcell Measurement
 * @apiVersion 0.2.0
 * @apiName Edit-BeratBadan
 * @apiGroup LoadCell Badan
 * @apiParam {Number} id ID data berat badan domba.
 * @apiDescription Mengubah data berat badan domba
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "message": "success",
 *      "updatedData": {
 *          "id": 5,
 *          "berat": "900.24",
 *          "createdAt": "2024-07-17T14:30:00.000Z",
 *          "updatedAt": "2024-09-12T01:39:45.455Z",
 *          "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *          "sensor_id": 2
 *      },
 *      "oldData": {
 *          "id": 5,
 *          "berat": "80.78",
 *          "createdAt": "2024-07-17T14:30:00.000Z",
 *          "updatedAt": "2024-07-17T14:30:00.000Z",
 *          "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *          "sensor_id": 2
 *      }
 *  }
 */
router.post('/edit/:id', function (req, res, next) { loadcellBadanController.update(req, res, next) });

/**
 * @api {post} /api/v2/loadcellbadan/delete/:id Delete Loadcell Measurement
 * @apiVersion 0.2.0
 * @apiName Delete-BeratBadan
 * @apiGroup LoadCell Badan
 * @apiParam {Number} id ID data berat badan domba.
 * @apiDescription Menghapus data berat badan.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Load cell measurement deleted successfully"
 * }
 */
router.post('/delete/:id', function (req, res, next) { loadcellBadanController.destroy(req, res, next) });

router.get('/daily/:date/:chip_id', function(req, res, next) {
    loadcellBadanController.getDailyData(req, res, next);
  });

router.get('/weekly/:date/:chip_id', function(req, res, next) {
    loadcellBadanController.getWeeklyData(req, res, next);
  });

  router.get('/monthly/:date/:chip_id', function(req, res, next) {
    loadcellBadanController.getMonthlyData(req, res, next);
});


/**
 * @api {get} /api/v2/loadcellbadan/:id Get Loadcell Measurement by ID
 * @apiVersion 0.2.0
 * @apiName Get-One-BeratBadan
 * @apiGroup LoadCell Badan
 * @apiParam {Number} id ID data berat badan.
 * @apiDescription Mengambil satu data berat badan.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "data": {
 *      "id": 1,
 *      "berat": 80.45,
 *      "createdAt": "2024-08-28T14:30:00.000Z",
 *      "updatedAt": "2024-08-28T14:30:00.000Z",
 *      "chip_id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "nama_domba": "Doe",
 *      "jenis_kelamin": "Jantan"
 *      }
 *  }   
 */
router.get('/:id', function (req, res, next) { loadcellBadanController.show(req, res, next) });


export default router;
