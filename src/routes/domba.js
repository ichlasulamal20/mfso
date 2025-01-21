import express from 'express';
import dombaController from '../controllers/domba.js';

const router = express.Router();

// v2

/**
 * @api {post} /api/v2/chip Create Domba Entry
 * @apiVersion 0.2.0
 * @apiName Add-Domba
 * @apiGroup Domba
 * @apiDescription Menambahkan domba baru.
 * @apiBody {String} id UUID dari RFID tag.
 * @apiBody {String} nama_domba Nama dari domba.
 * @apiBody {Date} usia Tanggal lahir domba.
 * @apiBody {String="Jantan", "Betinas"} jenis_kelamin Gender of the domba.
 * @apiParamExample {json} Example Body:
 * {
 *  "id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *  "nama_domba": "Jane",
 *  "usia": "2022-09-03T14:45:30",
 *  "jenis_kelamin": "Betina",
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *  "message": "success",
 *  "data": {
 *      "id": "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2",
 *      "nama_domba": "Jane",
 *      "usia": "2022-09-03T07:45:30.000Z",
 *      "jenis_kelamin": "Betina",
 *      "createdAt": "2024-09-10T11:47:00.635Z",
 *      "updatedAt": "2024-09-10T11:47:00.635Z",
 *      }
 *  }
 */
router.post('/', function (req, res, next) { dombaController.create(req, res, next) });

/**
 * @api {get} /api/v2/chip Get All Domba Entry
 * @apiVersion 0.2.0
 * @apiName Get-All-Domba
 * @apiGroup Domba
 * @apiDescription Ambil semua data dari tabel domba.
 * @apiQuery {Number} page Halaman paginasi.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "pagination": {
 *      "totalPages": 1,
 *      "currentPage": 1
 *  },
 *  "data": {
 *      "count": 3,
 *      "rows": [
 *          {
 *              "id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *              "nama_domba": "John",
 *              "usia": 0,
 *              "jenis_kelamin": "Jantan",
 *              "createdAt": "2022-09-03T07:45:30.000Z",
 *              "updatedAt": "2022-09-03T07:45:30.000Z",
 *          },
 *          {
 *              "id": "e6",
 *              "nama_domba": "Jane",
 *              "usia": 0,
 *              "jenis_kelamin": "Betina",
 *              "createdAt": "2024-09-10T11:47:00.635Z",
 *              "updatedAt": "2024-09-10T11:47:00.635Z",
 *          },
 *          ...
 *          ]
 *      }
 * }    
 */
router.get('/', function (req, res, next) { dombaController.index(req, res, next) });

/**
 * @api {post} /api/v2/chip/edit/:chip_id Edit Domba Entry
 * @apiVersion 0.2.0
 * @apiName Edit-Domba
 * @apiGroup Domba
 * @apiParam {String} chip_id Chip ID tag domba.
 * @apiBody {String} nama_domba Nama dari domba.
 * @apiBody {Date} usia Tanggal lahir domba.
 * @apiBody {String="Jantan", "Betina"} jenis_kelamin Gender of the domba.
 * @apiDescription Edit a specific domba entry.
 * @apiParamExample {json} Example Body:
 * {
 *  "nama_domba": "Jane",
 *  "usia": "2022-09-03T14:25:30",
 *  "jenis_kelamin": "Betina"
 *  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "success",
 *  "updatedData": {
 *      "id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "nama_domba": "John",
 *      "usia": "2019-05-03T07:45:30.000Z",
 *      "jenis_kelamin": "Jantan",
 *      "createdAt": "2024-09-10T12:48:03.431Z",
 *      "updatedAt": "2024-09-10T15:29:41.644Z"
 *  },
 *  "oldData": {
 *      "id": "7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f",
 *      "nama_domba": "John",
 *      "usia": "2019-05-03T07:45:30.000Z",
 *      "jenis_kelamin": "Jantan",
 *      "createdAt": "2024-09-10T12:48:03.431Z",
 *      "updatedAt": "2024-09-10T12:54:20.560Z"
 *      }
 *  }
 */
router.post('/edit/:chip_id', function (req, res, next) { dombaController.update(req, res, next) });

/**
 * @api {post} /api/v2/chip/delete/:chip_id Delete Domba Entry
 * @apiVersion 0.2.0
 * @apiName Delete-Domba
 * @apiGroup Domba
 * @apiParam {String} chip_id RFID chip ID.
 * @apiDescription Menghapus data domba.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Domba deleted successfully"
 * }
 */
router.post('/delete/:chip_id', function (req, res, next) { dombaController.destroy(req, res, next) });

/**
 * @api {get} /api/v2/chip/:chip_id Get Domba Entry by Chip ID
 * @apiVersion 0.2.0
 * @apiName Get-One-Domba
 * @apiGroup Domba
 * @apiParam {String} chip_id RFID chip ID.
 * @apiDescription Mengambil satu data domba.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "success",
 *   "data": {
 *     "id": "1",
 *     "nama_domba": "Domba A",
 *     "usia": 2,
 *     "jenis_kelamin": "Jantan",
 *     "createdAt": "2024-01-10T20:14:00.000Z",
 *     "updatedAt": "2024-01-10T20:14:00.000Z"
 *   }
 * }
 */
router.get('/:chip_id', function (req, res, next) { dombaController.show(req, res, next) });

export default router;