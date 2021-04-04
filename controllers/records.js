const Records = require('../models/records');

exports.getRecords = async (req, res, next) => {

    if(req.body.startDate == undefined || req.body.endDate == undefined) {
        res.status(400).json({
            "code": 2,
            "msg": "Start or end date is missing!",
            "records": []
        });
    } else if (req.body.minCount == undefined || req.body.endDate == undefined) {
        res.status(400).json({
            "code": 3,
            "msg": "Min or max count is missing!",
            "records": []
        });
    }

    Records.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(req.body.startDate), 
                    $lt: new Date(req.body.endDate)
                }
            }
        },
        {
            "$unwind": "$counts"
        },
        {
            "$group": {
                "_id": {
                    "key": "$key",
                    "createdAt": "$createdAt"
                },
                "totalCount": {
                    "$sum": "$counts"
                }
            }
        },
        {
            "$project": {
               "_id": 0,
               "key": "$_id.key",
               "createdAt": "$_id.createdAt",
               "totalCount": 1
           }
        }
    ]).then(data => {
        let records = [];

        data.map(res => {
            if(res.totalCount >= req.body.minCount && res.totalCount <= req.body.maxCount) {
                const obj = {
                    key: res.key,
                    createdAt: res.createdAt,
                    totalCount: res.totalCount
                };
                records.push(obj);
            }
        });

        if(records.length == 0) {
            res.status(200).json({
                "code": 1,
                "msg": "No records found!",
                "records": records
            });
        } else {
            res.status(200).json({
                "code": 0,
                "msg": "Success",
                "records": records
            });
        }
    });
}