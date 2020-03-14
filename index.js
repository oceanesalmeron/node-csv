var csv = require('csv-parser');
var jsonexport = require('jsonexport');
var fs = require('fs');

var myData = [];
var done = false;

fs.createReadStream('data.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => myData.push(data))
    .on('end', () => {
        cleanData(myData);
        console.log(myData);

        jsonexport(myData,function(err, csv){
            if(err) return console.log(err);
            console.log(csv);
        });
        
});

function cleanData(data) {
    var deleteItems = [];

    for (var i = 0; i < data.length; i++) {

        var bdate = parseDate(data[i]['DATE']);

        for (var j = 0; j < data.length; j++) {

            if (data[i]['INDEX'] != data[j]['INDEX']) {

                if (data[i]['STRING'] === data[j]['STRING']) {

                    var adate = parseDate(data[j]['DATE']);

                    if (bdate > adate) {

                        deleteItems.push(data[j]['INDEX']);

                    } else {

                        deleteItems.push(data[i]['INDEX']);

                    }
                }
            }

        }
    }

    deleteItems = removeDuplicates(deleteItems);

    for (var i = 0; i < deleteItems.length; i++) {
        var pos = deleteItems[i] - (1 + i);
        data.splice(pos, 1);
    }
}

function parseDate(date) {
    var date1 = date.split('/')
    var newDate = date1[1] + '/' + date1[0] + '/' + date1[2];
    var fdate = new Date(newDate);
    return fdate;
}

function removeDuplicates(array) {
    array.sort();
    return array.filter((a, b) => array.indexOf(a) === b)
};





